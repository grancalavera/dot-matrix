import { SymbolDescription, emptySymbol } from "./model";

export const loadSymbol = (id: string): SymbolDescription => {
  const binaryString = localStorage.getItem(id);

  if (binaryString === null) {
    console.warn(`Symbol "${id}" not found in local storage`);
    return { id, data: emptySymbol() };
  }

  const data = new Map<number, boolean>();
  for (let i = 0; i < binaryString.length; i++) {
    data.set(i, binaryString[i] === "1");
  }

  return { id, data };
};

/**
 * Saves a symbol to local storage
 * Saves a symbol to local storage. In local storate each symbol is stored as a
 * string of 0s and 1s. This function converts the CharSymbol into a string and
 * saves it to local storage.
 * @param id The key to save the symbol under in local storage
 *
 */
export const saveSymbol = ({ id, data }: SymbolDescription): void => {
  let binaryString = "";
  for (let i = 0; i < data.size; i++) {
    binaryString += data.get(i) ? "1" : "0";
  }
  localStorage.setItem(id, binaryString);
};
