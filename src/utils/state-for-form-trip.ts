export function getStateForFormTrip(
  trip: any,
  toRoute: any,
  isOnlyViewing: any,
  whoShowInfo: any
) {
  return {
    state: {
      detailsTrip: trip,
      toRoute: toRoute,
      isOnlyViewing: isOnlyViewing,
      whoShowInfo: whoShowInfo,
    },
  };
}
