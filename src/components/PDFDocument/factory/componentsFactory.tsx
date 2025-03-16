import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import { renderTextWithStyles } from "../helpers/renderHelper";

/**
 * Creates the base components that all themes will inherit from
 * @param {Object} styles - The styles object
 * @returns {Object} Base components
 */
export const createBaseComponents = (styles) => {
  return {
    // Text elements
    p: ({ node }) => renderTextWithStyles(node, {}, styles),
    h1: ({ children }) => (
      <Text break style={styles.h1}>
        {children}
      </Text>
    ),
    h2: ({ children }) => (
      <Text minPresenceAhead={1} style={styles.h2}>
        {children}
      </Text>
    ),
    h3: ({ children }) => (
      <Text minPresenceAhead={1} style={styles.h3}>
        {children}
      </Text>
    ),
    h4: ({ children }) => (
      <Text minPresenceAhead={1} style={styles.h4}>
        {children}
      </Text>
    ),
    h5: ({ children }) => (
      <Text minPresenceAhead={1} style={styles.h5}>
        {children}
      </Text>
    ),
    h6: ({ children }) => (
      <Text minPresenceAhead={1} style={styles.h6}>
        {children}
      </Text>
    ),
    
    // Inline elements
    strong: ({ children }) => <Text style={styles.strong}>{children}</Text>,
    em: ({ children }) => <Text style={styles.em}>{children}</Text>,
    a: ({ children, href }) => (
      <Link style={styles.link} src={href}>
        {children}
      </Link>
    ),
    code: ({ children }) => <Text style={styles.code}>{children}</Text>,
    
    // Block elements
    hr: () => <View style={styles.hr}></View>,
    ol: ({ children }) => <View style={styles.list}>{children}</View>,
    ul: ({ children }) => <View style={styles.list}>{children}</View>,
    li: ({ children }) => <Text style={styles.listItem}>• {children}</Text>,
    blockquote: ({ children }) => (
      <View style={styles.blockquote}>{children}</View>
    ),
    pre: ({ children }) => <View style={styles.codeBlock}>{children}</View>,
    div: ({ children }) => <View>{children}</View>,
    
    // Default handler for strongTitle (can be overridden by themes)
    strongTitle: ({ children }) => (
      <Text style={styles.strong}>{children}</Text>
    )
  };
};

/**
 * Creates components for a specific theme by merging base components with theme-specific ones
 * @param {Object} styles - The styles object 
 * @param {Object} themeOverrides - Theme-specific component overrides
 * @returns {Object} Theme components
 */
export const createThemeComponents = (styles, themeOverrides = {}) => {
  const baseComponents = createBaseComponents(styles);
  
  // Create a modified p component that uses all theme overrides
  const modifiedBaseComponents = {
    ...baseComponents,
    p: ({ node }) => renderTextWithStyles(node, { ...themeOverrides }, styles)
  };

  // Merge base components with theme overrides
  return {
    ...modifiedBaseComponents,
    ...themeOverrides
  };
};
