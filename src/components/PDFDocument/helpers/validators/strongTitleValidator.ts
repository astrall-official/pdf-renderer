/**
 * Validates if a node is a strong title element
 */
export const isStrongTitle = (child: any, index: number, children: any[]) => {
  // Not a strong element, can't be a strong title
  if (child.type !== 'element' || child.tagName !== 'strong') {
    return false;
  }

  // Check if is the only element and is strong 
  if (children.length === 1 && child.tagName === 'strong') {
      return true;
  }
  
  return (
    // Check if this is the first element and next element is a br or starts with newline
    (index === 0 &&
      index + 1 < children.length &&
      ((children[index + 1].type === 'element' &&
        children[index + 1].tagName === 'br') ||
        (children[index + 1].type === 'text' &&
          children[index + 1].value.startsWith('\n')))) ||
    // Check if previous element ends with newline
    (index > 0 &&
      children[index - 1].type === 'text' &&
      children[index - 1].value.endsWith('\n') &&
      // Check if next element is a br or starts with newline
      ((index < children.length - 1 &&
        ((children[index + 1].type === 'element' &&
          children[index + 1].tagName === 'br') ||
          (children[index + 1].type === 'text' &&
            children[index + 1].value.startsWith('\n')))) ||
        index === children.length - 1))
  );
};
