import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/constants/theme";

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 17,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
