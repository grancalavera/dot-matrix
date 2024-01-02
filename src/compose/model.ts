import {
  SymbolDescription,
  isKnownSymbol,
  symbolCols,
  symbolRows,
  symbolSize,
  transposeIndex,
} from "../symbol/model";

export const messageMaxLength = 80;
export const screenWidthInChars = 8;
export const screenCols = symbolCols * screenWidthInChars;
export const screenRows = symbolRows;
export const screenSize = screenCols * screenRows;
export const bufferSize = symbolSize * messageMaxLength;
export const screenFrequency = 80;
const stepSize = screenRows;

export const screenVector = Array.from({ length: screenSize }, (_, i) =>
  transposeIndex(i, screenRows, screenCols)
);

export const isValidMessageLength = (message: string) =>
  message.length <= messageMaxLength;

export const sanitizeMessage = (message: string) =>
  message
    .split("")
    .map((x) => x.toUpperCase())
    .filter(isKnownSymbol)
    .join("");

export const formatCharCount = (count: number) =>
  count.toString().padStart(2, "0");

export const buffer = Array.from({ length: messageMaxLength }, (_, i) => i);

export const advancePlayhead = (playhead: number) => playhead * stepSize;

export const screenPixelValue = (
  index: number,
  buffer: boolean[],
  playhead: number
) => buffer[(index + playhead) % buffer.length] ?? false;

export const bufferSymbols = (message: string): string[] =>
  message.padEnd(message.length + screenWidthInChars, " ").split("");

export const bufferFromSymbolDescriptions = (
  symbols: SymbolDescription[]
): boolean[] => symbols.flatMap((symbol) => [...symbol.data.values()]);

export const defaultMessage = sanitizeMessage("");
