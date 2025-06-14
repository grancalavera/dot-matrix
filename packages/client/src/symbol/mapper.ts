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

  const data: boolean[] = [];
  for (let i = 0; i < binaryString.length; i++) {
    data[i] = binaryString[i] === "1";
  }

  return { id, data };
};

export const toBinaryString = (data: SymbolData): string => {
  let binaryString = "";
  for (let i = 0; i < data.length; i++) {
    binaryString += data[i] ? "1" : "0";
  }
  return binaryString;
};
