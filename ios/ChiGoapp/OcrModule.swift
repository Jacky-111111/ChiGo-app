import Foundation
import Photos
import UIKit
import Vision

@objc(OcrModule)
class OcrModule: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(recognizeText:resolver:rejecter:)
  func recognizeText(
    _ imageUri: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    resolveCgImage(from: imageUri) { result in
      switch result {
      case .success(let cgImage):
        self.performTextRecognition(cgImage: cgImage, resolve: resolve, reject: reject)
      case .failure(let error):
        reject(error.code, error.message, nil)
      }
    }
  }

  private func performTextRecognition(
    cgImage: CGImage,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let request = VNRecognizeTextRequest { request, requestError in
      if let requestError {
        reject("ocr_failed", "Vision OCR failed: \(requestError.localizedDescription)", requestError)
        return
      }

      guard let observations = request.results as? [VNRecognizedTextObservation] else {
        reject("ocr_failed", "Vision returned invalid OCR observations.", nil)
        return
      }

      var lines: [String] = []
      var confidenceTotal: Float = 0

      for observation in observations {
        guard let topCandidate = observation.topCandidates(1).first else {
          continue
        }

        let value = topCandidate.string.trimmingCharacters(in: .whitespacesAndNewlines)
        if value.isEmpty {
          continue
        }

        lines.append(value)
        confidenceTotal += topCandidate.confidence
      }

      let rawText = lines.joined(separator: "\n")
      let confidence = lines.isEmpty ? 0 : confidenceTotal / Float(lines.count)

      resolve([
        "rawText": rawText,
        "lines": lines,
        "confidence": confidence,
      ])
    }

    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.minimumTextHeight = 0.012

    do {
      let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
      try handler.perform([request])
    } catch {
      reject("ocr_failed", "Could not process the selected image.", error)
    }
  }

  private func resolveCgImage(
    from imageUri: String,
    completion: @escaping (Result<CGImage, OcrModuleError>) -> Void
  ) {
    if imageUri.hasPrefix("ph://") {
      resolvePhotoLibraryImage(from: imageUri, completion: completion)
      return
    }

    let normalizedUri = imageUri.hasPrefix("file://") ? imageUri : "file://\(imageUri)"
    guard let url = URL(string: normalizedUri) else {
      completion(.failure(.invalidUri))
      return
    }

    DispatchQueue.global(qos: .userInitiated).async {
      guard
        let data = try? Data(contentsOf: url),
        let image = UIImage(data: data),
        let cgImage = image.cgImage
      else {
        completion(.failure(.unreadableFile))
        return
      }

      completion(.success(cgImage))
    }
  }

  private func resolvePhotoLibraryImage(
    from imageUri: String,
    completion: @escaping (Result<CGImage, OcrModuleError>) -> Void
  ) {
    let localIdentifier = imageUri.replacingOccurrences(of: "ph://", with: "")
    let assets = PHAsset.fetchAssets(withLocalIdentifiers: [localIdentifier], options: nil)

    guard let asset = assets.firstObject else {
      completion(.failure(.assetNotFound))
      return
    }

    let options = PHImageRequestOptions()
    options.version = .current
    options.deliveryMode = .highQualityFormat
    options.isNetworkAccessAllowed = true
    options.isSynchronous = false

    PHImageManager.default().requestImageDataAndOrientation(for: asset, options: options) {
      data,
      _,
      _,
      _
      in
      guard
        let data,
        let image = UIImage(data: data),
        let cgImage = image.cgImage
      else {
        completion(.failure(.unreadableFile))
        return
      }

      completion(.success(cgImage))
    }
  }
}

private enum OcrModuleError {
  case invalidUri
  case unreadableFile
  case assetNotFound

  var code: String {
    switch self {
    case .invalidUri:
      return "invalid_uri"
    case .unreadableFile:
      return "unreadable_image"
    case .assetNotFound:
      return "asset_not_found"
    }
  }

  var message: String {
    switch self {
    case .invalidUri:
      return "The selected image URI is invalid."
    case .unreadableFile:
      return "Could not read the selected image file."
    case .assetNotFound:
      return "The selected photo asset could not be loaded."
    }
  }
}
