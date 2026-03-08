export const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let currentIndex = copy.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex]!, copy[currentIndex]!];
  }
  return copy;
};
