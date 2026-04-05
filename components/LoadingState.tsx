import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/constants/theme";

type Props = {
  label: string;
};

export function LoadingState({ label }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});
