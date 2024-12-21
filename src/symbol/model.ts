// prettier-ignore
export const symbols = [
  "1", "2", "3", "4", "5", "6",
  "7", "8", "9", "0", "A", "B",
  "C", "D", "E", "F", "G", "H",
  "I", "J", "K", "L", "M", "N",
  "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z",
  " ", "'", "!", "?", "-", ".",
]

export const defaultSymbolId = symbols[0] ?? "Z";

export const isKnownSymbol = (symbol: string) => symbols.includes(symbol);

export type SymbolDescription = { id: string; data: SymbolData };
export type SymbolData = boolean[];

export const symbolRows = 9;
export const symbolCols = 7;
export const symbolSize = symbolRows * symbolCols;

export const transposeIndex = (
  index: number,
  rows: number,
  cols: number
): number => {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return col * rows + row;
};

export const symbolIndexToRowMajor = (i: number) =>
  transposeIndex(i, symbolCols, symbolRows);

export const symbolIndexToColMajor = (i: number) =>
  transposeIndex(i, symbolRows, symbolCols);

const colMajorIndexCoordinates = (i: number) => {
  const row = i % symbolRows;
  const col = Math.floor(i / symbolRows);
  return { row, col };
};

/**
 * A column major vector of indices for a 2D matrix of size `symbolRows` x `symbolCols`.
 * we render the pixels in row-major order, but we store them in column-major order, so
 * we need to transpose the index.
 */
export const symbolVector = Array.from({ length: symbolSize }, (_, i) =>
  symbolIndexToColMajor(i)
);

export const emptySymbol = (): SymbolData => {
  const symbol: SymbolData = [];
  for (let i = 0; i < symbolSize; i++) {
    symbol.push(false);
  }
  return symbol;
};

export const defaultSymbolDescription = (
  id = defaultSymbolId
): SymbolDescription => ({
  id,
  data: emptySymbol(),
});

export const isModified = (
  original: SymbolData,
  draft: SymbolData
): boolean => {
  for (let i = 0; i < symbolSize; i++) {
    if (original[i] !== draft[i]) {
      return true;
    }
  }
  return false;
};

export const invertSymbol = (symbol: SymbolDescription): SymbolDescription => {
  symbol.data = symbol.data.map((value) => !value);
  return symbol;
};

export const fillSymbol = (symbol: SymbolDescription): SymbolDescription => {
  symbol.data = symbol.data.map(() => true);
  return symbol;
};

export const clone = (data: SymbolData): SymbolData => {
  return [...data];
};

export const merge = (base: SymbolData, merged: SymbolData): SymbolData => {
  return base.map((value, index) => merged[index] || value);
};

export const verticalFlipSymbol = (
  symbol: SymbolDescription
): SymbolDescription => {
  const data: SymbolData = [];
  symbol.data.forEach((value, key) => {
    const coords = colMajorIndexCoordinates(key);
    const flippedRow = symbolRows - 1 - coords.row;
    const index = coords.col * symbolRows + flippedRow;
    data[index] = value;
  });
  return { ...symbol, data };
};

export const horizontalFlipSymbol = (
  symbol: SymbolDescription
): SymbolDescription => {
  const data: SymbolData = [];
  symbol.data.forEach((value, key) => {
    const coords = colMajorIndexCoordinates(key);
    const flippedCol = symbolCols - 1 - coords.col;
    const index = flippedCol * symbolRows + coords.row;
    data[index] = value;
  });
  return { ...symbol, data };
};

export const rotate180Symbol = (symbol: SymbolDescription): SymbolDescription =>
  verticalFlipSymbol(horizontalFlipSymbol(symbol));
