// prettier-ignore
export const symbols = [
  "1", "2", "3", "4", "5", "6", 
  "7", "8", "9", "0", "A", "B", 
  "C", "D", "E", "F", "G", "H", 
  "I", "J", "K", "L", "M", "N", 
  "O", "P", "Q", "R", "S", "T", 
  "U", "V", "W", "X", "Y", "Z"
]
export const defaultSymbolId = symbols[0] ?? "Z";

export type SymbolDescription = { id: string; data: SymbolData };
export type SymbolData = Map<number, boolean>;

const rows = 9;
const cols = 7;
const symbolSize = rows * cols;

export const emptySymbol = (): SymbolData => {
  const symbol = new Map<number, boolean>();
  for (let i = 0; i < symbolSize; i++) {
    symbol.set(i, false);
  }
  return symbol;
};

export const defaultSymbolDescription = (
  id = symbols[0] ?? "Z"
): SymbolDescription => ({
  id,
  data: emptySymbol(),
});

export const isModified = (
  original: SymbolData,
  draft: SymbolData
): boolean => {
  for (let i = 0; i < symbolSize; i++) {
    if (original.get(i) !== draft.get(i)) {
      return true;
    }
  }
  return false;
};
