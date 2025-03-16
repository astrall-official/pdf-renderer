import React from "react";
import { Text, Link } from "@react-pdf/renderer";

// Helper function to render individual child elements
export const renderChildElement = (child, index, styles) => {
  if (child.type === "text") {
    if (!child.value) return null;
    return child.value;
  } else if (child.type === "element") {
    switch (child.tagName) {
      case "strong":
        return (
          <Text key={index} style={styles.strong}>
            {child.children.map(c => c.value).join("")}
          </Text>
        );
      case "em":
        return (
          <Text key={index} style={styles.em}>
            {child.children.map(c => c.value).join("")}
          </Text>
        );
      case "a":
        return (
          <Link key={index} style={styles.link} src={child.properties.href}>
            {child.children.map(c => c.value).join("")}
          </Link>
        );
      case "code":
        return (
          <Text key={index} style={styles.code}>
            {child.children.map(c => c.value).join("")}
          </Text>
        );
      default:
        return child.children.map(c => c.value).join("");
    }
  }
  return null;
};

// Helper function to render paragraph children with proper styling
export const renderTextWithStyles = (node, theme, styles) => {
  if (!node || !node.children) return null;

  // Check if the paragraph only contains a single element with potential title styling
  if (node.children.length === 1 && node.children[0].type === "element") {
    const child = node.children[0];
    if (child.tagName === "strong") {
      if (theme.strongTitle) {
        return theme.strongTitle({
          children: child.children.map(c => c.value).join(""),
          index: 0
        });
      }
      return (
        <Text style={styles.strong}>
          {child.children.map(c => c.value).join("")}
        </Text>
      );
    }
  }

  // Process multi-child paragraphs and find strong titles within them
  if (node.children.length > 1 && theme.strongTitle) {
    const strongTitleIndices = [];

    // Find all potential strong title indices
    node.children.forEach((child, index) => {
      if (child.type === "element" && child.tagName === "strong") {
        // Check if this strong element should be treated as a title
        const isStrongTitle =
          // Check if this is the first element and next element is a br or starts with newline
          (index === 0 &&
            ((node.children[index + 1].type === "element" &&
              node.children[index + 1].tagName === "br") ||
              (node.children[index + 1].type === "text" &&
                node.children[index + 1].value.startsWith("\n")))) ||
          // Check if previous element ends with newline
          (index > 0 &&
            node.children[index - 1].type === "text" &&
            node.children[index - 1].value.endsWith("\n") &&
            // Check if next element is a br or starts with newline
            ((index < node.children.length - 1 &&
              ((node.children[index + 1].type === "element" &&
                node.children[index + 1].tagName === "br") ||
                (node.children[index + 1].type === "text" &&
                  node.children[index + 1].value.startsWith("\n")))) ||
              index === node.children.length - 1));

        if (isStrongTitle) {
          strongTitleIndices.push(index);
        }
      }
    });

    // If we found strong titles, split the content
    if (strongTitleIndices.length > 0) {
      const segments = [];
      let currentIndex = 0;

      // Add segments before each strong title
      strongTitleIndices.forEach(titleIndex => {
        // Add text segment before the strong title
        if (currentIndex < titleIndex) {
          segments.push(
            <Text key={`text-${currentIndex}`} style={styles.p} orphans={2}>
              {node.children
                .slice(currentIndex, titleIndex)
                .map((child, idx) => {
                  const childKey = `${currentIndex}-${idx}`;
                  return renderChildElement(child, childKey, styles);
                })}
            </Text>
          );
        }

        // Add the strong title as its own segment
        const strongElement = node.children[titleIndex];
        segments.push(
          theme.strongTitle({
            key: `title-${titleIndex}`,
            children: strongElement.children.map(c => c.value).join(""),
            index: titleIndex
          })
        );

        // Skip the br element or newline after the strong title
        currentIndex = titleIndex + 1;
        if (
          currentIndex < node.children.length &&
          ((node.children[currentIndex].type === "element" &&
            node.children[currentIndex].tagName === "br") ||
            (node.children[currentIndex].type === "text" &&
              node.children[currentIndex].value.startsWith("\n")))
        ) {
          currentIndex++;
        }
      });

      // Add remaining text after the last strong title
      if (currentIndex < node.children.length) {
        segments.push(
          <Text key={`text-end`} style={styles.p}>
            {node.children.slice(currentIndex).map((child, idx) => {
              const childKey = `end-${idx}`;
              return renderChildElement(child, childKey, styles);
            })}
          </Text>
        );
      }

      return [segments];
    }
  }

  // If no strong titles to split, render normally
  return (
    <Text style={styles.p}>
      {node.children.map((child, index) =>
        renderChildElement(child, index, styles)
      )}
    </Text>
  );
};
