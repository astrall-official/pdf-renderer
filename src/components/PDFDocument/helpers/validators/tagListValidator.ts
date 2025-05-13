/**
 * Validates if a node is a tag list element
 * Matches patterns like: "Califcativos de Tierra: Estable - Práctico - Sensual"
 * Or patterns like: "Estable - Práctico - Sensual"
 * It checks if items separated by " - " are all between 1 and 30 characters long.
 */
export const isTagList = (child: any, index: number, children: any[]) => {
  // Only validate text nodes
  if (child.type !== 'text' || !child.value) {
    return false;
  }

  const value = child.value.trim();
  let tagsPart = value;

  // Check for the "Label: Tags" structure
  const colonIndex = value.indexOf(':');
  // Ensure ':' is not the first char and has a space after or is followed by end of string
  if (colonIndex > 0 && (value.length === colonIndex + 1 || value[colonIndex + 1] === ' ')) {
    const labelPart = value.substring(0, colonIndex).trim();
    if (labelPart.length > 0) {
      // Potential label found, use the part after ":" for tag checking
      tagsPart = value.substring(colonIndex + 1).trim();
    }
    // If labelPart is empty or no space/end after ':', treat the whole line as potential tags (handled below)
  }

  // The part containing tags must exist and must contain the " - " separator
  // Also check tagsPart is not empty in case the original value was just "Label: "
  if (tagsPart.length === 0 || !tagsPart.includes(' - ')) {
    return false;
  }

  // Split the potential tags by " - " allowing for variable whitespace
  const tags = tagsPart.split(/\s+-\s+/);

  // After splitting by " - ", we must have at least two tags.
  // Also handles edge cases like "Tag1 - " or " - Tag2" resulting in empty strings after split.
  if (tags.length < 2) {
    return false;
  }


  // Validate each tag's length
  for (const tag of tags) {
    const trimmedTag = tag.trim(); // Trim potentially remaining spaces if split pattern wasn't perfect
    if (trimmedTag.length === 0 || trimmedTag.length > 50) {
      // Found an empty tag (e.g., from "Tag1 -  - Tag2") or a tag that is too long
      return false;
    }
  }

  // If all checks pass, it's a valid tag list
  return true;
};
