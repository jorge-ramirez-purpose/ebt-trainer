import { createContext, useContext, useState } from "react";
import { loadMarked, saveMarked, toggleMarked } from "../utils/markedStorage";

type TMarkedContext = {
  markedIds: Set<number>;
  toggleMark: (id: number) => void;
};

const MarkedContext = createContext<TMarkedContext>({
  markedIds: new Set(),
  toggleMark: () => {},
});

export const MarkedProvider = ({ children }: { children: React.ReactNode }) => {
  const [markedIds, setMarkedIds] = useState<Set<number>>(
    () => new Set(loadMarked()),
  );

  const toggleMark = (id: number) => {
    const updated = toggleMarked(id, markedIds);
    saveMarked(updated);
    setMarkedIds(new Set(updated));
  };

  return (
    <MarkedContext.Provider value={{ markedIds, toggleMark }}>
      {children}
    </MarkedContext.Provider>
  );
};

export const useMarked = () => useContext(MarkedContext);
