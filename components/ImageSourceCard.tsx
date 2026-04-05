import { Linking, Pressable, StyleSheet, Text, View, Image } from "react-native";
import type { DishImageResult } from "@/types/dish";
import { colors, spacing } from "@/constants/theme";

type Props = {
  result: DishImageResult;
  index: number;
};

export function ImageSourceCard({ result, index }: Props) {
  const sourceUrl = result.sourceUrl;

  return (
    <View style={styles.container}>
      <Image
        accessibilityLabel={`Possible dish image result ${index + 1}`}
        source={{ uri: result.imageUrl }}
        style={styles.image}
      />
      <Text style={styles.title}>{result.title ?? "Possible match"}</Text>
      {result.relevanceScore ? (
        <Text style={styles.meta}>
          Confidence: {Math.round(result.relevanceScore * 100)}%
        </Text>
      ) : null}
      {sourceUrl ? (
        <Pressable onPress={() => Linking.openURL(sourceUrl)}>
          <Text style={styles.link}>Open source</Text>
        </Pressable>
      ) : (
        <Text style={styles.meta}>{result.sourceName ?? "Image result"}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: 10,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12,
  },
});
