export function durationInWeeks(date1: string, date2: string): number {
  const startDate = new Date(date1);
  const endDate = new Date(date2);

  const timeDifference = endDate.getTime() - startDate.getTime();

  const weeksDifference: number = Math.ceil(
    timeDifference / (1000 * 60 * 60 * 24 * 7),
  );

  return weeksDifference;
}
