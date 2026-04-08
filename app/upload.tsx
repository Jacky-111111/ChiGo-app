import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { PhotoPreview } from "@/components/PhotoPreview";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { copy } from "@/constants/copy";
import { colors, spacing } from "@/constants/theme";
import { useImageSelection } from "@/hooks/useImageSelection";
import { useOcr } from "@/hooks/useOcr";
import { parseDishCandidates } from "@/services/menuParser";
import { setDishes, setOcrResult, setSelectedImage } from "@/store/mvpSession";

export default function UploadScreen() {
  const { selectedImage, chooseFromLibrary, takePhoto, error, permissionDenied } =
    useImageSelection();
  const { loading, error: ocrError, runOcr } = useOcr();

  const handleContinue = async () => {
    if (!selectedImage) return;

    try {
      setSelectedImage(selectedImage);
      const ocrInputUri = selectedImage.ocrUri ?? selectedImage.uri;
      const ocrResult = await runOcr(ocrInputUri);
      setOcrResult(ocrResult);
      setDishes(parseDishCandidates(ocrResult));
      router.push("/parse-results");
    } catch {
      // Errors are surfaced via useOcr state; keep user on this screen.
    }
  };

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Add a menu photo</Text>
      <Text style={styles.subtitle}>
        Take a photo or choose one from your library to extract dish names.
      </Text>

      <View style={styles.actions}>
        <PrimaryButton label="Take Photo" onPress={takePhoto} />
        <PrimaryButton
          label="Choose from Library"
          onPress={chooseFromLibrary}
          variant="secondary"
        />
      </View>

      <PhotoPreview image={selectedImage} />

      {loading ? <LoadingState label={copy.loadingOcr} /> : null}

      {error ? <ErrorState message={error} /> : null}
      {ocrError ? <ErrorState message={ocrError} /> : null}
      {permissionDenied ? (
        <ErrorState message="Permission denied. You can allow permissions in settings and try again." />
      ) : null}

      <View style={styles.bottomActions}>
        <PrimaryButton
          label="Continue"
          onPress={handleContinue}
          disabled={!selectedImage || loading}
        />
        <PrimaryButton
          label="Retake / Rechoose"
          onPress={selectedImage ? takePhoto : chooseFromLibrary}
          variant="secondary"
          disabled={loading}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    gap: spacing.sm,
  },
  bottomActions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
