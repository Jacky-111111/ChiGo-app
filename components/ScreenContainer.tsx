import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors, spacing } from "@/constants/theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export function ScreenContainer({ children, scroll = false }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      ) : (
        <View style={styles.inner}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
