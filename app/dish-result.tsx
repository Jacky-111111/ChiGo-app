import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ImageSourceCard } from "@/components/ImageSourceCard";
import { LoadingState } from "@/components/LoadingState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { copy } from "@/constants/copy";
import { colors, spacing } from "@/constants/theme";
import { useDishSearch } from "@/hooks/useDishSearch";
import {
  getSessionState,
  resetSessionState,
  setDishSearchResponse,
} from "@/store/mvpSession";
import type { DishCandidate } from "@/types/dish";

export default function DishResultScreen() {
  const params = useLocalSearchParams<{ dishId?: string }>();
  const { loading, error, runSearch } = useDishSearch();
  const session = getSessionState();
  const dishId = params.dishId;
  const [activeDish, setActiveDish] = useState<DishCandidate | undefined>(
    session.selectedDish
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const searchResponse = useMemo(() => {
    if (!activeDish) return undefined;
    return session.searchResponseByDishId[activeDish.id];
  }, [activeDish, session.searchResponseByDishId]);

  useEffect(() => {
    const targetDish =
      session.selectedDish ??
      session.dishes.find((dish) => dish.id === dishId) ??
      undefined;
    setActiveDish(targetDish);
  }, [dishId, session.dishes, session.selectedDish]);

  useEffect(() => {
    if (!activeDish) {
      setLocalError("No dish selected. Go back and choose a dish first.");
      return;
    }

    if (session.searchResponseByDishId[activeDish.id]) return;

    runSearch(activeDish)
      .then((response) => {
        setDishSearchResponse(activeDish.id, response);
      })
      .catch(() => undefined);
  }, [activeDish, runSearch, session.searchResponseByDishId]);

  const noResults = !loading && searchResponse && searchResponse.results.length === 0;

  return (
    <ScreenContainer>
      {!activeDish || localError ? (
        <ErrorState
          message={localError ?? "Please select a dish before continuing."}
          actionLabel="Back to Dishes"
          onAction={() => router.replace("/parse-results")}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{activeDish.name}</Text>
            {activeDish.description ? (
              <Text style={styles.description}>{activeDish.description}</Text>
            ) : null}
            <Text style={styles.disclaimer}>{copy.resultDisclaimer}</Text>
          </View>

          {loading ? <LoadingState label={copy.loadingSearch} /> : null}
          {error ? <ErrorState message={error} /> : null}

          {noResults ? (
            <EmptyState
              title="No image results found"
              description="We couldn't find a strong visual match for this dish. Try another dish."
            />
          ) : null}

          {searchResponse?.results?.length ? (
            <FlatList
              data={searchResponse.results}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item, index }) => (
                <ImageSourceCard result={item} index={index} />
              )}
            />
          ) : null}
        </>
      )}

      <View style={styles.bottomActions}>
        <PrimaryButton
          label="Back to Menu Items"
          onPress={() => router.replace("/parse-results")}
          variant="secondary"
        />
        <PrimaryButton
          label="Try Another Dish"
          onPress={() => router.back()}
          variant="secondary"
        />
        <PrimaryButton
          label="Start Over"
          onPress={() => {
            resetSessionState();
            router.replace("/");
          }}
          variant="secondary"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 28,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  disclaimer: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  bottomActions: {
    gap: spacing.sm,
  },
});
