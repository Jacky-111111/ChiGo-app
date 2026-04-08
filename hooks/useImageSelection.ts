import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import type { MenuImage } from "@/types/menu";

type SelectionError = string | null;

function toMenuImage(
  asset: ImagePicker.ImagePickerAsset,
  source: MenuImage["source"]
): MenuImage {
  const iosLibraryOcrUri =
    Platform.OS === "ios" && source === "library" && asset.assetId
      ? `ph://${asset.assetId}`
      : asset.uri;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    uri: asset.uri,
    ocrUri: iosLibraryOcrUri,
    originalUri: asset.uri,
    width: asset.width,
    height: asset.height,
    source,
    createdAt: new Date().toISOString(),
  };
}

export function useImageSelection() {
  const [selectedImage, setSelectedImage] = useState<MenuImage | undefined>();
  const [error, setError] = useState<SelectionError>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const chooseFromLibrary = useCallback(async () => {
    setError(null);
    setPermissionDenied(false);
    const currentPermission =
      await ImagePicker.getMediaLibraryPermissionsAsync();
    const permission = currentPermission.granted
      ? currentPermission
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setPermissionDenied(permission.canAskAgain === false);
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
  }, []);

  const takePhoto = useCallback(async () => {
    setError(null);
    setPermissionDenied(false);
    const currentPermission = await ImagePicker.getCameraPermissionsAsync();
    const permission = currentPermission.granted
      ? currentPermission
      : await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      setPermissionDenied(permission.canAskAgain === false);
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
  }, []);

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
