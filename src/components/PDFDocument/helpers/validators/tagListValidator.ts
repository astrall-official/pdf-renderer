/**
 * Validates if a node is a tag list element
 * Matches patterns like: "Califcativos de Tierra: Estable - Práctico - Sensual"
 */
export const isTagList = (child: any, index: number, children: any[]) => {
  // Only validate text nodes
  if (child.type !== 'text' || !child.value) {
    return false;
  }

  const value = child.value.trim();

  // Match the pattern: "Something: tag1 - tag2 - tag3"
  // The pattern should have a colon followed by terms separated by dashes
  const tagListPattern = /^.+:\s*.+\s+-\s+.+$/;
  const tagListPattern2 = /^.+\s+-\s+.+$/;
  return tagListPattern.test(value) || tagListPattern2.test(value);
};
