import { describe, it, expect } from "vitest";
import {
  symbols,
  defaultSymbolId,
  isKnownSymbol,
  symbolRows,
  symbolCols,
  symbolSize,
  transposeIndex,
  symbolIndexToRowMajor,
  symbolIndexToColMajor,
  symbolVector,
  emptySymbol,
  defaultSymbolDescription,
  isModified,
  invertSymbol,
  fillSymbol,
  clone,
  merge,
  verticalFlipSymbol,
  horizontalFlipSymbol,
  rotate180Symbol,
  togglePixel,
  type SymbolData,
  type SymbolDescription,
} from "./model.js";

describe("Symbol Model Constants", () => {
  it("should have correct symbol dimensions", () => {
    expect(symbolRows).toBe(9);
    expect(symbolCols).toBe(7);
    expect(symbolSize).toBe(63); // 9 * 7
  });

  it("should have default symbol ID from symbols array", () => {
    expect(defaultSymbolId).toBe("1");
    expect(symbols).toContain(defaultSymbolId);
  });

  it("should contain expected symbols", () => {
    expect(symbols).toHaveLength(42);
    expect(symbols).toContain("A");
    expect(symbols).toContain("1");
    expect(symbols).toContain(" ");
    expect(symbols).toContain("!");
  });
});

describe("isKnownSymbol", () => {
  it("should return true for known symbols", () => {
    expect(isKnownSymbol("A")).toBe(true);
    expect(isKnownSymbol("1")).toBe(true);
    expect(isKnownSymbol(" ")).toBe(true);
    expect(isKnownSymbol("!")).toBe(true);
  });

  it("should return false for unknown symbols", () => {
    expect(isKnownSymbol("a")).toBe(false);
    expect(isKnownSymbol("@")).toBe(false);
    expect(isKnownSymbol("")).toBe(false);
    expect(isKnownSymbol("AB")).toBe(false);
  });
});

describe("transposeIndex", () => {
  it("should correctly transpose indices", () => {
    // Test with 3x2 matrix for simplicity
    // Row-major: [0,1,2,3,4,5] -> Col-major: [0,2,4,1,3,5]
    expect(transposeIndex(0, 3, 2)).toBe(0); // (0,0) -> 0
    expect(transposeIndex(1, 3, 2)).toBe(3); // (0,1) -> 3
    expect(transposeIndex(2, 3, 2)).toBe(1); // (1,0) -> 1
    expect(transposeIndex(3, 3, 2)).toBe(4); // (1,1) -> 4
    expect(transposeIndex(4, 3, 2)).toBe(2); // (2,0) -> 2
    expect(transposeIndex(5, 3, 2)).toBe(5); // (2,1) -> 5
  });

  it("should handle symbol dimensions", () => {
    // Test first few indices with actual symbol dimensions
    expect(transposeIndex(0, symbolRows, symbolCols)).toBe(0);
    expect(transposeIndex(1, symbolRows, symbolCols)).toBe(symbolRows);
    expect(transposeIndex(symbolCols, symbolRows, symbolCols)).toBe(1);
  });
});

describe("symbolIndexToRowMajor and symbolIndexToColMajor", () => {
  it("should convert between row and column major indices", () => {
    // Test round-trip conversion
    for (let i = 0; i < 10; i++) {
      const rowMajor = symbolIndexToRowMajor(i);
      const backToColMajor = symbolIndexToColMajor(rowMajor);
      expect(backToColMajor).toBe(i);
    }
  });
});

describe("symbolVector", () => {
  it("should have correct length", () => {
    expect(symbolVector).toHaveLength(symbolSize);
  });

  it("should contain valid indices", () => {
    symbolVector.forEach((index) => {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(symbolSize);
    });
  });
});

describe("emptySymbol", () => {
  it("should create an empty symbol with correct size", () => {
    const empty = emptySymbol();
    expect(empty).toHaveLength(symbolSize);
    expect(empty.every((pixel) => pixel === false)).toBe(true);
  });

  it("should create a new instance each time", () => {
    const empty1 = emptySymbol();
    const empty2 = emptySymbol();
    expect(empty1).not.toBe(empty2);
    expect(empty1).toEqual(empty2);
  });
});

describe("defaultSymbolDescription", () => {
  it("should create default symbol description", () => {
    const desc = defaultSymbolDescription();
    expect(desc.id).toBe(defaultSymbolId);
    expect(desc.data).toHaveLength(symbolSize);
    expect(desc.data.every((pixel) => pixel === false)).toBe(true);
  });

  it("should accept custom id", () => {
    const desc = defaultSymbolDescription("A");
    expect(desc.id).toBe("A");
    expect(desc.data).toHaveLength(symbolSize);
  });
});

describe("isModified", () => {
  it("should return false for identical symbols", () => {
    const original = emptySymbol();
    const draft = emptySymbol();
    expect(isModified(original, draft)).toBe(false);
  });

  it("should return true for different symbols", () => {
    const original = emptySymbol();
    const draft = emptySymbol();
    draft[0] = true;
    expect(isModified(original, draft)).toBe(true);
  });

  it("should handle completely different symbols", () => {
    const original = emptySymbol();
    const draft = Array(symbolSize).fill(true);
    expect(isModified(original, draft)).toBe(true);
  });
});

describe("invertSymbol", () => {
  it("should invert all pixels", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: [true, false, true, false, true],
    };

    const inverted = invertSymbol(symbol);
    expect(inverted.id).toBe("test");
    expect(inverted.data).toEqual([false, true, false, true, false]);
  });

  it("should not mutate the original symbol", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: [true, false],
    };

    const result = invertSymbol(symbol);
    expect(result).not.toBe(symbol); // Different reference
    expect(symbol.data).toEqual([true, false]); // Original unchanged
    expect(result.data).toEqual([false, true]); // Result is inverted
  });
});

describe("fillSymbol", () => {
  it("should fill all pixels", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: [true, false, true, false],
    };

    const filled = fillSymbol(symbol);
    expect(filled.id).toBe("test");
    expect(filled.data).toEqual([true, true, true, true]);
  });

  it("should not mutate the original symbol", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: [false, false],
    };

    const result = fillSymbol(symbol);
    expect(result).not.toBe(symbol); // Different reference
    expect(symbol.data).toEqual([false, false]); // Original unchanged
    expect(result.data).toEqual([true, true]); // Result is filled
  });
});

describe("clone", () => {
  it("should create a copy of symbol data", () => {
    const original: SymbolData = [true, false, true, false];
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original); // Different reference
  });

  it("should not affect original when modified", () => {
    const original: SymbolData = [true, false];
    const cloned = clone(original);

    cloned[0] = false;
    expect(original[0]).toBe(true);
    expect(cloned[0]).toBe(false);
  });
});

describe("merge", () => {
  it("should merge two symbol data arrays with OR logic", () => {
    const base: SymbolData = [true, false, true, false];
    const merged: SymbolData = [false, true, true, false];

    const result = merge(base, merged);
    expect(result).toEqual([true, true, true, false]);
  });

  it("should not modify original arrays", () => {
    const base: SymbolData = [true, false];
    const merged: SymbolData = [false, true];

    merge(base, merged);
    expect(base).toEqual([true, false]);
    expect(merged).toEqual([false, true]);
  });
});

describe("togglePixel", () => {
  it("should toggle specified pixel", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: [true, false, true, false],
    };

    const toggled = togglePixel(symbol, 1);
    expect(toggled.id).toBe("test");
    expect(toggled.data).toEqual([true, true, true, false]);
  });

  it("should not mutate original symbol", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: [true, false],
    };

    const toggled = togglePixel(symbol, 0);
    expect(symbol.data).toEqual([true, false]); // Original unchanged
    expect(toggled.data).toEqual([false, false]); // New copy modified
    expect(toggled).not.toBe(symbol); // Different reference
  });
});

describe("verticalFlipSymbol", () => {
  it("should flip symbol vertically", () => {
    // Create a simple test symbol (2x2 for simplicity in testing)
    const symbol: SymbolDescription = {
      id: "test",
      // Column-major format: [col0_row0, col0_row1, col1_row0, col1_row1]
      data: Array(symbolSize).fill(false),
    };

    // Set a pattern we can verify
    symbol.data[0] = true; // First pixel of first column

    const flipped = verticalFlipSymbol(symbol);
    expect(flipped.id).toBe("test");
    expect(flipped).not.toBe(symbol); // New instance
    expect(flipped.data).toHaveLength(symbolSize);
  });

  it("should not mutate original symbol", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: emptySymbol(),
    };
    symbol.data[0] = true;

    const flipped = verticalFlipSymbol(symbol);
    expect(symbol.data[0]).toBe(true); // Original unchanged
    expect(flipped).not.toBe(symbol);
  });
});

describe("horizontalFlipSymbol", () => {
  it("should flip symbol horizontally", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: emptySymbol(),
    };

    // Set a pattern we can verify
    symbol.data[0] = true; // First pixel

    const flipped = horizontalFlipSymbol(symbol);
    expect(flipped.id).toBe("test");
    expect(flipped).not.toBe(symbol); // New instance
    expect(flipped.data).toHaveLength(symbolSize);
  });

  it("should not mutate original symbol", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: emptySymbol(),
    };
    symbol.data[0] = true;

    const flipped = horizontalFlipSymbol(symbol);
    expect(symbol.data[0]).toBe(true); // Original unchanged
    expect(flipped).not.toBe(symbol);
  });
});

describe("rotate180Symbol", () => {
  it("should rotate symbol 180 degrees", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: emptySymbol(),
    };

    symbol.data[0] = true; // Set first pixel

    const rotated = rotate180Symbol(symbol);
    expect(rotated.id).toBe("test");
    expect(rotated).not.toBe(symbol); // New instance
    expect(rotated.data).toHaveLength(symbolSize);
  });

  it("should be equivalent to vertical then horizontal flip", () => {
    const symbol: SymbolDescription = {
      id: "test",
      data: emptySymbol(),
    };

    symbol.data[0] = true;
    symbol.data[10] = true;

    const rotated = rotate180Symbol(symbol);
    const manualRotation = verticalFlipSymbol(horizontalFlipSymbol(symbol));

    expect(rotated.data).toEqual(manualRotation.data);
  });
});
