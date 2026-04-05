import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { copy } from "@/constants/copy";
import { colors, spacing } from "@/constants/theme";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { resetSessionState } from "@/store/mvpSession";

export default function Index() {
  const goToUpload = () => {
    resetSessionState();
    router.push("/upload");
  };

  return (
    <ScreenContainer>
      <View style={styles.centerContent}>
        <Text style={styles.brand}>{copy.appName}</Text>
        <Text style={styles.title}>{copy.homeTitle}</Text>
        <Text style={styles.subtitle}>{copy.homeSubtitle}</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Scan a Menu" onPress={goToUpload} />
        <PrimaryButton label="Choose Photo" onPress={goToUpload} variant="secondary" />
      </View>

      <Text style={styles.helper}>{copy.helperText}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    gap: spacing.sm,
  },
  brand: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 20,
    letterSpacing: 0.4,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.sm,
  },
  helper: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
