import { Image, StyleSheet, Text, View } from "react-native";
import type { MenuImage } from "@/types/menu";
import { colors, spacing } from "@/constants/theme";

type Props = {
  image?: MenuImage;
  compact?: boolean;
};

export function PhotoPreview({ image, compact = false }: Props) {
  if (!image) return null;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.uri }}
        style={[styles.image, compact && styles.compactImage]}
        resizeMode="cover"
      />
      <Text style={styles.meta}>
        Source: {image.source === "camera" ? "Camera" : "Library"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactImage: {
    height: 120,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
