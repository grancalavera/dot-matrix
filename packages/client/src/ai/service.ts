import Anthropic from "@anthropic-ai/sdk";
import { fromBinaryString } from "../symbol/mapper";
import { symbolCols, symbolRows, transposeIndex } from "../symbol/model";

export const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

const prompt = `\
You are a pixel font designer who designs fonts by turning pixels on and off. \
These are the constraints for your work:

- black and white
- 0 turns a pixel off (white)
- 1 turns a pixel on (black)
- 9 rows
- 7 columns
- leave at least one empty column (0s only)
- leave at least one empty row (0s only)
- your response should only include 0, 1, and newline characters
- do not include any other characters
- do not include backticks or other characters that are not 0, 1, or newline
- if the character is a letter you can choose to make it uppercase or lowercase

You will get a single character, and you will return a grid with a valid \
representation of such character.
`;

export const predict = async (char: string) => {
  if (char.length !== 1) {
    throw new Error(`Invalid input: ${char}`);
  }

  const completion = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1024,
    system: prompt,
    messages: [
      { role: "user", content: char },
    ],
  });

  const result = completion.content[0];

  if (!result) {
    throw new Error("No content in response");
  }

  if (result.type !== "text") {
    throw new Error(`Invalid output type: ${result.type}`);
  }

  const sanitized = sanitize(result.text);
  const transposed = transpose(sanitized);

  return fromBinaryString(char, transposed);
};

const sanitize = (s: string) => s.trim().replace(/[^01]/g, "");

const transpose = (s: string) => {
  const transposed: string[] = [];

  s.split("").forEach((char, i) => {
    const index = transposeIndex(i, symbolRows, symbolCols);
    transposed[index] = char;
  });

  return transposed.join("");
};
