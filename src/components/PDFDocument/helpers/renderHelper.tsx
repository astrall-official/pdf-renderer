import React from "react";
import { Text, Link } from "@react-pdf/renderer";
import { ComponentType, componentValidators, ThemeComponentProps } from "./validators";

// Helper function to render individual child elements
export const renderChildElement = (child, index, styles, stripStart = false) => {
  if (child.type === "text") {
    if (!child.value) return null;
    return stripStart ? child.value.replace(/^\n+/, '') : child.value;
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
        let value = child.children.map(c => c.value).join("");
        return stripStart ? value.replace(/^\n+/, '') : value;
    }
  }
  return null;
};

/**
 * Identifies custom components in a node's children
 * Returns an array of identified components with their indices
 */
const identifyCustomComponents = (node, theme) => {
  if (!node?.children?.length) return [];

  const customComponents = [];

  // Check each child for custom component types
  node.children.forEach((child, index) => {
    // Check against all registered validators
    Object.entries(componentValidators).forEach(([componentType, validator]) => {
      // Only process if theme has a renderer for this component type
      if (theme[componentType] && validator(child, index, node.children)) {
        customComponents.push({
          index,
          type: componentType as ComponentType,
          child
        });
      }
    });
  });

  return customComponents;
};

/**
 * Helper function to extract content from different component types
 */
const extractComponentContent = (component, child) => {
  switch (component) {
    case 'strongTitle':
      return { children: child.children.map(c => c.value).join("") };
    case 'tagList':
      // Parse tag list content with format "title: element 1 - element 2 - element N"
      // Match either "title: tag1 - tag2" or just "tag1 - tag2" format
      const tagMatch = child.value.match(/(?:(.+?):\s*)?(.+)$/);
      if (tagMatch) {
        const [_, title, elementsStr] = tagMatch;
        // Split elements by dash separator and trim whitespace
        const elements = elementsStr.split('-').map(elem => elem.trim()).filter(Boolean);

        return {
          title: title?.trim(),
          elements,
          children: child.children
        };
      }
      return { children: child.value };
    default:
      return { children: (child.children ? child.children.map(c => c.value).join("") : child.value) || '' };
  }
};

/**
 * Splits text content around custom components and renders them
 */
export const renderTextWithStyles = (node, theme, styles) => {
  if (!node || !node.children) return null;

  // Identify custom components
  const customComponents = identifyCustomComponents(node, theme);

  // If no custom components found, render as regular paragraph
  if (customComponents.length === 0) {
    return (
      <Text style={styles.p} wrap={true} orphans={0}>
        {node.children.map((child, index) =>
          renderChildElement(child, index, styles)
        )}
      </Text>
    );
  }

  // Split content around custom components
  const segments = [];
  let currentIndex = 0;

  customComponents.forEach((component, idx) => {
    const { index, type, child } = component;

    // Add regular text before this custom component
    if (currentIndex < index) {
      segments.push(
        <Text key={`text-${currentIndex}`} style={styles.p} orphans={2}>
          {node.children
            .slice(currentIndex, index)
            .map((child, childIdx) => {
              const childKey = `${currentIndex}-${childIdx}`;
              return renderChildElement(child, childKey, styles);
            })}
        </Text>
      );
    }

    // Add the custom component
    const content = extractComponentContent(type, child);
    segments.push(
      theme[type]({
        key: `${type}-${index}`,
        index,
        ...content
      })
    );

    // Update current index to skip this component
    currentIndex = index + 1;

    // Handle special cases to skip line breaks after certain components
    if (type === 'strongTitle' && currentIndex < node.children.length) {
      if (
        (node.children[currentIndex].type === "element" &&
          node.children[currentIndex].tagName === "br")
        // || (node.children[currentIndex].type === "text" &&
        //   node.children[currentIndex].value.startsWith("\n"))
      ) {
        currentIndex++;
      }
    }
  });

  // Add remaining text after the last custom component
  if (currentIndex < node.children.length) {
    segments.push(
      <Text key={`text-end`} style={styles.p}>
        {node.children.slice(currentIndex).map((child, idx) => {
          const childKey = `end-${idx}`;
          return renderChildElement(child, childKey, styles, idx === 0);
        })}
      </Text>
    );
  }

  return segments;
};
