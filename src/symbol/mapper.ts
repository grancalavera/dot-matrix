import { SymbolData, SymbolDescription, symbolSize } from "./model";

export const fromBinaryString = (
  id: string,
  binaryString: string
): SymbolDescription => {
  if (binaryString.length !== symbolSize) {
    throw new Error(`Invalid binary string length: ${binaryString.length}`);
  }

  if (!/^[01]*$/.test(binaryString)) {
    throw new Error(`Invalid binary string characters: ${binaryString}`);
  }

  const data = new Map<number, boolean>();
  for (let i = 0; i < binaryString.length; i++) {
    data.set(i, binaryString[i] === "1");
  }

  return { id, data };
};

export const toBinaryString = (data: SymbolData): string => {
  let binaryString = "";
  for (let i = 0; i < data.size; i++) {
    binaryString += data.get(i) ? "1" : "0";
  }
  return binaryString;
};
