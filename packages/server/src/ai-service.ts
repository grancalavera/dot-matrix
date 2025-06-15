import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompt = `\
You are a creative pixel font designer creating diverse dot-matrix characters. Explore different design approaches and styles while maintaining readability and technical requirements.

REQUIRED FORMAT:
- Canvas: 9 rows × 7 columns (63 pixels total)
- Binary format: 0 = pixel off, 1 = pixel on
- Output exactly 9 lines with 7 characters each
- Use only '0', '1', and newline characters - no spaces, formatting, or additional text

ESSENTIAL REQUIREMENTS:
- Include at least one empty column for character separation
- Include at least one empty row for line spacing
- Ensure character remains recognizable and distinct from similar characters
- Avoid completely isolated pixels (floating dots)

CREATIVE FREEDOM:
- Experiment with different font styles: bold, thin, condensed, expanded, decorative, minimalist
- Try various stroke widths: single pixel, double pixel, or mixed
- Explore different character proportions and positioning within the grid
- Consider serif, sans-serif, or stylized approaches
- Vary the visual weight and density of characters
- Use creative interpretation while maintaining core character identity

VARIATION ENCOURAGEMENT:
Each time you design a character, try a different creative approach. Consider:
- Different baseline positions
- Alternative character heights (compact vs tall)
- Various centering strategies
- Unique stylistic flourishes
- Different approaches to curves and angles
- Creative use of negative space

Be inventive and explore diverse visual solutions. The goal is to create varied, interesting designs that are still clearly readable as the intended character.`;

export interface SymbolData {
  id: string;
  data: boolean[];
}

export const predict = async (char: string): Promise<SymbolData> => {
  if (char.length !== 1) {
    throw new Error(`Invalid input: ${char}`);
  }

  const completion = await anthropic.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 1024,
    temperature: 0.8, // Increase creativity and variation
    system: prompt,
    messages: [{ role: "user", content: char }],
  });

  const result = completion.content[0];

  console.log({ result });

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
  const symbolRows = 9;
  const symbolCols = 7;
  const transposed: string[] = [];

  s.split("").forEach((char, i) => {
    const index = transposeIndex(i, symbolRows, symbolCols);
    transposed[index] = char;
  });

  return transposed.join("");
};

const transposeIndex = (index: number, rows: number, cols: number): number => {
  const row = Math.floor(index / cols);
  const col = index % cols;
  return col * rows + row;
};

const fromBinaryString = (id: string, binaryString: string): SymbolData => {
  const data = binaryString.split("").map((char) => char === "1");
  return { id, data };
};
