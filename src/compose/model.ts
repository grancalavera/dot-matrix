import {
  isKnownSymbol,
  symbolCols,
  symbolRows,
  symbolSize,
  transposeIndex,
} from "../symbol/model";

export const messageMaxLength = 80;
export const screenCols = symbolCols * 8;
export const screenRows = symbolRows;
export const screenSize = screenCols * screenRows;
export const bufferSize = symbolSize * messageMaxLength;

export const screenVector = Array.from({ length: screenSize }, (_, i) =>
  transposeIndex(i, screenRows, screenCols)
);

export const isValidMessageLength = (message: string) =>
  message.length <= messageMaxLength;

export const sanitizeMessage = (message: string) => {
  return message
    .split("")
    .map((x) => x.toUpperCase())
    .filter(isKnownSymbol)
    .join("");
};

export const formatCharCount = (count: number) =>
  count.toString().padStart(2, "0");

export const buffer = Array.from({ length: messageMaxLength }, (_, i) => i);

export const advancePlayhead = (playhead: number) =>
  (playhead * screenRows) % screenSize;
