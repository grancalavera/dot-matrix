import { isKnownSymbol } from "../symbol/model";

export const messageMaxLength = 80;

export const isValidMessageLength = (message: string) =>
  message.length <= messageMaxLength;

export const sanitizeMessage = (message: string) => {
  return message
    .split("")
    .map((x) => x.toUpperCase())
    .filter(isKnownSymbol)
    .slice(0, messageMaxLength - 1)
    .join("");
};

export const formatCharCount = (count: number) =>
  count.toString().padStart(2, "0");

export const buffer = Array.from({ length: messageMaxLength }, (_, i) => i);
