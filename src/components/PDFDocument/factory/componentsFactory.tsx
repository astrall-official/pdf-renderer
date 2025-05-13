import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
import { renderTextWithStyles } from "../helpers/renderHelper";

/**
 * Creates the base components that all themes will inherit from
 * @param {Object} styles - The styles object
 * @returns {Object} Base components
 */
export const createBaseComponents = (styles: any) => {
  return {
    // Text elements
    // p: ({ node }) => renderTextWithStyles(node, {}, styles),
    h1: ({ children }: { children: React.ReactNode }) => (
      <Text break style={styles.h1}>
        {children}
      </Text>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <Text minPresenceAhead={1} style={styles.h2}>
        {children}
      </Text>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <Text minPresenceAhead={1} style={styles.h3}>
        {children}
      </Text>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <Text minPresenceAhead={1} style={styles.h4}>
        {children}
      </Text>
    ),
    h5: ({ children }: { children: React.ReactNode }) => (
      <Text minPresenceAhead={1} style={styles.h5}>
        {children}
      </Text>
    ),
    h6: ({ children }: { children: React.ReactNode }) => (
      <Text minPresenceAhead={1} style={styles.h6}>
        {children}
      </Text>
    ),

    // Inline elements
    strong: ({ children }: { children: React.ReactNode }) => <Text style={styles.strong}>{children}</Text>,
    em: ({ children }: { children: React.ReactNode }) => <Text style={styles.em}>{children}</Text>,
    a: ({ children, href }: { children: React.ReactNode, href: string }) => (
      <Link style={styles.link} src={href}>
        {children}
      </Link>
    ),
    code: ({ children }: { children: React.ReactNode }) => <Text style={styles.code}>{children}</Text>,

    // Block elements
    hr: () => <View style={styles.hr}></View>,
    ol: ({ children }: { children: React.ReactNode }) => <View style={styles.list}>{children}</View>,
    ul: ({ children }: { children: React.ReactNode }) => <View style={styles.list}>{children}</View>,
    li: ({ children }: { children: React.ReactNode }) => <Text style={styles.listItem}>• {children}</Text>,
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <View style={styles.blockquote}>{children}</View>
    ),
    pre: ({ children }: { children: React.ReactNode }) => <View style={styles.codeBlock}>{children}</View>,
    div: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,

    // Default handler for strongTitle (can be overridden by themes)
    strongTitle: ({ children }: { children: React.ReactNode }) => (
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
export const createThemeComponents = (styles: any, themeOverrides = {}) => {
  const baseComponents = createBaseComponents(styles);

  // Create a modified p component that uses all theme overrides
  const modifiedBaseComponents = {
    ...baseComponents,
    p: ({ node }: { node: any }) => renderTextWithStyles(node, { ...themeOverrides }, styles)
    // p: ({ node, children }: { node: any, children: React.ReactNode }) => <Text>{children}</Text>,
  };

  // Merge base components with theme overrides
  return {
    ...modifiedBaseComponents,
    ...themeOverrides
  };
};
