import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompt = `\
You are an expert pixel font designer creating dot-matrix characters for LED displays and retro computing applications. Design readable, aesthetically pleasing characters that maintain consistency across the character set.

GRID SPECIFICATIONS:
- Canvas: 9 rows × 7 columns (63 pixels total)
- Binary format: 0 = pixel off (dark/background), 1 = pixel on (bright/foreground)
- Output exactly 9 lines with 7 characters each
- Use only '0', '1', and newline characters - no spaces, formatting, or additional text

DESIGN PRINCIPLES:
- Ensure at least one completely empty column (all 0s) for character separation
- Ensure at least one completely empty row (all 0s) for line spacing
- Use consistent stroke width (typically 1 pixel thick)
- Maintain visual balance and center characters when possible
- Prioritize legibility at small scale over artistic flourishes
- Create clear distinction between similar characters (0/O, 6/9, I/l/1)

CHARACTER-SPECIFIC GUIDELINES:

LETTERS (A-Z):
- Use clean uppercase style for maximum readability
- Maintain consistent baseline (typically row 7-8)
- Standard height of 5-6 pixels for main body
- Use proper proportions (wider for M/W, narrower for I/J)

NUMBERS (0-9):
- Make 0 clearly oval/rounded to distinguish from O
- Ensure 6 and 9 are unambiguous (clear opening direction)
- Make 1 distinctive with base and/or top serif
- Keep consistent height and alignment

PUNCTUATION:
- Period (.): Single pixel at bottom-right
- Comma (,): Hook shape at bottom baseline
- Exclamation (!): Tall line with separate dot below
- Question (?): Curved top with dot below
- Apostrophe ('): Single pixel at top
- Quotes ("): Two pixels at top

SYMBOLS:
- Plus (+): Centered cross shape
- Minus (-): Horizontal line at middle
- Equals (=): Two parallel horizontal lines
- At (@): Circular with inner detail
- Hash (#): Grid pattern with intersections

SPACING STRATEGY:
- Use bottom row (row 9) as spacing/descender area
- Use rightmost column (column 7) for character separation
- Center main character body in remaining 8×6 area
- For wide characters (M, W), use full width but maintain separation

QUALITY STANDARDS:
- Ensure no floating pixels (isolated 1s with no adjacent 1s)
- Maintain visual weight consistency across character set
- Test readability by imagining characters side-by-side
- Balance negative space to avoid crowded appearance

EXAMPLE REFERENCE:
Character 'A':
0111110
1100011
1100011
1111111
1100011
1100011
0000000
0000000
0000000

You will receive a single character and must return its optimized dot-matrix representation following these specifications precisely.`;

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
