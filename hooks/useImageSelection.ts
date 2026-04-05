import { useCallback, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import type { MenuImage } from "@/types/menu";

type SelectionError = string | null;

function toMenuImage(
  asset: ImagePicker.ImagePickerAsset,
  source: MenuImage["source"]
): MenuImage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    source,
    createdAt: new Date().toISOString(),
  };
}

export function useImageSelection() {
  const [selectedImage, setSelectedImage] = useState<MenuImage | undefined>();
  const [error, setError] = useState<SelectionError>(null);
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const chooseFromLibrary = useCallback(async () => {
    setError(null);
    const permission = libraryPermission?.granted
      ? libraryPermission
      : await requestLibraryPermission();

    if (!permission.granted) {
      setError("Photo library permission is required to choose a menu photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(toMenuImage(result.assets[0], "library"));
    }
  }, [libraryPermission, requestLibraryPermission]);

  const takePhoto = useCallback(async () => {
    setError(null);
    const permission = cameraPermission?.granted
      ? cameraPermission
      : await requestCameraPermission();

    if (!permission.granted) {
      setError("Camera permission is required to take a menu photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(toMenuImage(result.assets[0], "camera"));
    }
  }, [cameraPermission, requestCameraPermission]);

  const permissionDenied = useMemo(
    () =>
      cameraPermission?.canAskAgain === false ||
      libraryPermission?.canAskAgain === false,
    [cameraPermission?.canAskAgain, libraryPermission?.canAskAgain]
  );

  return {
    selectedImage,
    setSelectedImage,
    takePhoto,
    chooseFromLibrary,
    error,
    setError,
    permissionDenied,
  };
}
