import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
import { searchDishImages } from "@/services/dishSearchService";
import {
  getSessionState,
  setDishSearchResponse,
} from "@/store/mvpSession";
import type { DishSearchResponse } from "@/types/api";
import type { DishCandidate } from "@/types/dish";

export default function DishResultScreen() {
  const params = useLocalSearchParams<{ dishId?: string; batch?: string }>();
  const { loading, error, runSearch } = useDishSearch();
  const session = getSessionState();
  const dishId = params.dishId;
  const batchMode = params.batch === "1";
  const [activeDish, setActiveDish] = useState<DishCandidate | undefined>(
    session.selectedDish
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchResponses, setBatchResponses] = useState<
    Record<string, DishSearchResponse>
  >({});
  const { width } = useWindowDimensions();
  const batchCardWidth = Math.max(260, width - spacing.lg * 2 - spacing.sm);

  const dishesForBatch = useMemo(() => {
    if (!batchMode) return [];
    return session.dishes.length > 0
      ? session.dishes
      : session.selectedDish
        ? [session.selectedDish]
        : [];
  }, [batchMode, session.dishes, session.selectedDish]);

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
    if (!batchMode) return;

    const missingDishes = dishesForBatch.filter(
      (dish) => !session.searchResponseByDishId[dish.id] && !batchResponses[dish.id]
    );
    if (missingDishes.length === 0) return;

    let mounted = true;
    setBatchLoading(true);
    setBatchError(null);

    Promise.allSettled(missingDishes.map((dish) => searchDishImages(dish)))
      .then((results) => {
        if (!mounted) return;

        const next: Record<string, DishSearchResponse> = {};
        let successCount = 0;

        results.forEach((result, index) => {
          const dish = missingDishes[index];
          if (result.status === "fulfilled") {
            next[dish.id] = result.value;
            setDishSearchResponse(dish.id, result.value);
            successCount += 1;
          }
        });

        if (successCount === 0) {
          setBatchError("Network connection required for dish image search.");
        }

        if (Object.keys(next).length > 0) {
          setBatchResponses((prev) => ({ ...prev, ...next }));
        }
      })
      .finally(() => {
        if (mounted) setBatchLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [batchMode, batchResponses, dishesForBatch, session.searchResponseByDishId]);

  useEffect(() => {
    if (batchMode) return;

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
  }, [activeDish, batchMode, runSearch, session.searchResponseByDishId]);

  const noResults = !loading && searchResponse && searchResponse.results.length === 0;

  return (
    <ScreenContainer scroll={batchMode}>
      {!activeDish || localError ? (
        <ErrorState
          message={localError ?? "Please select a dish before continuing."}
          actionLabel="Back to Dishes"
          onAction={() => router.replace("/parse-results")}
        />
      ) : batchMode ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Batch Dish Results</Text>
            <Text style={styles.disclaimer}>
              Added dishes are queried together and grouped below.
            </Text>
          </View>

          {batchLoading ? <LoadingState label="Searching multiple dishes..." /> : null}
          {batchError ? <ErrorState message={batchError} /> : null}

          {dishesForBatch.map((dish) => {
            const response =
              batchResponses[dish.id] ?? session.searchResponseByDishId[dish.id];
            const hasResults = Boolean(response?.results.length);

            return (
              <View key={dish.id} style={styles.batchSection}>
                <Text style={styles.batchTitle}>{dish.name}</Text>
                {!hasResults ? (
                  <EmptyState
                    title="No image results yet"
                    description="Try another dish name or run the search again."
                  />
                ) : (
                  <>
                    <Text style={styles.swipeHint}>
                      Swipe left/right to view {response!.results.length} results
                    </Text>
                    <FlatList
                      data={response!.results}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={styles.batchCarouselContent}
                      ItemSeparatorComponent={() => <View style={styles.carouselGap} />}
                      renderItem={({ item, index }) => (
                        <ImageSourceCard
                          result={item}
                          index={index}
                          containerStyle={{ width: batchCardWidth }}
                        />
                      )}
                      getItemLayout={(_, index) => ({
                        length: batchCardWidth + spacing.sm,
                        offset: (batchCardWidth + spacing.sm) * index,
                        index,
                      })}
                    />
                  </>
                )}
              </View>
            );
          })}
        </>
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
        {batchMode ? (
          <PrimaryButton
            label="Back to Home"
            onPress={() => router.replace("/")}
            variant="secondary"
          />
        ) : (
          <>
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
          </>
        )}
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
  batchSection: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  batchTitle: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 22,
  },
  swipeHint: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  batchCarouselContent: {
    paddingVertical: spacing.xs,
  },
  carouselGap: {
    width: spacing.sm,
  },
});
