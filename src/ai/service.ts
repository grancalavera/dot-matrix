import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { fromBinaryString } from "../symbol/mapper";
import { symbolCols, symbolRows, transposeIndex } from "../symbol/model";

const delimitedVar = (s: string) => "```{" + s + "}```";

export const templateString = `\
You are a pixel font designer who designs fonts by turning pixels on and off. \
These are the constraints for your work:

- black and white
- 0 means black
- 1 means white
- 9 rows
- 7 columns
- replies include only the grid and nothing more
- leave at least one empty column (0s only)
- leave at least one empty row (0s only)

Users will give you a single character delimited in triple backticks, and you will \
return a grid with a valid representation of such character.

Character: ${delimitedVar("char")}`;

export const predict = async (char: string) => {
  if (char.length !== 1) {
    throw new Error(`Invalid input: ${char}`);
  }

  const prompt = ChatPromptTemplate.fromTemplate(templateString);

  const messages = await prompt.formatMessages({ char });

  const chat = new ChatOpenAI({
    temperature: 1.1,
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    modelName: "gpt-4",
  });

  const { content } = await chat.invoke(messages);

  if (typeof content !== "string") {
    throw new Error(`Invalid output: ${content}`);
  }

  const sanitized = sanitize(content);
  const transposed = transpose(sanitized);

  return fromBinaryString(char, transposed);
};

const sanitize = (s: string) => s.trim().replace(/[`\n]/g, "");

const transpose = (s: string) => {
  const transposed: string[] = [];

  s.split("").forEach((char, i) => {
    const index = transposeIndex(i, symbolRows, symbolCols);
    transposed[index] = char;
  });

  return transposed.join("");
};
