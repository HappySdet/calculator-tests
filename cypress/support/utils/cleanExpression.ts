/**
 * Removes spaces and filters out invalid calculator characters.
 * Allows only: digits (0-9), dot, +, -, ×, ÷, =
 *
 * @param expression - Expression string to be cleaned.
 * @returns cleaned expression string
 */
export function sanitizeCalculatorExpression(expression: string): {
  cleaned: string;
  removedInvalidChars: boolean;
} {
  const noSpaces = expression.replace(/\s+/g, "");
  const cleaned = noSpaces.replace(/[^0-9+\-×÷.=]/g, "");
  const removedInvalidChars = cleaned.length !== noSpaces.length;

  return {
    cleaned,
    removedInvalidChars,
  };
}
