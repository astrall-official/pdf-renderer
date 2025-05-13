import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { createThemeComponents } from "../factory/componentsFactory";
import Line1 from "../assets/lines/line1";
import Line3 from "../assets/lines/line3";
import EightPointedStar from "../assets/general/eightPointedStar";
import Moons from "../assets/general/moons";
import Moon from "../assets/general/moon";

/**
 * Default theme - uses base components without modifications
 */
export const defaultTheme = (styles: any) => {
  return createThemeComponents(styles);
};

/**
 * Astrology theme - custom components with astrology-themed decorations
 */
export const astrologyTheme = (styles: any) => {
  const themeOverrides = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <View
        break
        wrap={false}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <View>
          <Moons width={150} />
        </View>
        <View style={{ width: "100%" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              textAlign: "center"
            }}
          >
            <View
              style={{
                flex: 1,
                marginRight: 20,
                height: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Line3 width={100} height={0.7} rtl={true} />
              <View
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  top: "0",
                  bottom: "0",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <EightPointedStar width={20} height={20} />
              </View>
            </View>
            <Text style={{ ...styles.h1, marginBottom: 20 }}>
              {children}
            </Text>
            <View
              style={{
                flex: 1,
                marginLeft: 20,
                height: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Line3 width={100} height={0.7} />
              <View
                style={{
                  position: "absolute",
                  left: "0",
                  right: "0",
                  top: "0",
                  bottom: "0",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <EightPointedStar width={20} height={20} />
              </View>
            </View>
          </View>
        </View>
      </View>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <View
        minPresenceAhead={80}
        wrap={false}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Text break style={{ ...styles.h2, marginBottom: 20 }}>
          {children}
        </Text>
        <View style={{ marginLeft: 20, marginRight: -30 }}>
          <EightPointedStar width={20} height={20} fill="#000" />
        </View>
        <View
          style={{
            flex: 1,
            marginRight: 30,
            marginLeft: 20
          }}
          minPresenceAhead={80}
        >
          <Line3 height={1} />
        </View>
      </View>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <View
        minPresenceAhead={80}
        wrap={false}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          marginVertical: 10
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <EightPointedStar width={10} height={10} fill="#000" />
          <Moon rtl width={8} height={13} fill="#000" />
          <View>
            <Text
              style={{
                ...styles.h3,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 15
              }}
            >
              {children}
            </Text>
          </View>
          <Moon width={8} height={13} fill="#000" />
          <EightPointedStar width={10} height={10} fill="#000" />
        </View>
      </View>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
        minPresenceAhead={80}
        wrap={false}
      >
        <EightPointedStar width={10} height={10} fill="#000" />
        <View>
          <Text
            style={{
              ...styles.h4,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10
            }}
          >
            {children}
          </Text>
        </View>
        <EightPointedStar width={10} height={10} fill="#000" />
      </View>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <View
        style={{
          ...styles.blockquote,
          borderLeft: "3 solid #555",
          backgroundColor: "#f5f5f5"
        }}
      >
        <Text>{children}</Text>
      </View>
    ),
    strongTitle: ({ children, index }: { children: React.ReactNode, index: number }) => (
      <View
        minPresenceAhead={80}
        wrap={false}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          marginVertical: 10
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <EightPointedStar width={10} height={10} fill="#000" />
          <Moon rtl width={8} height={13} fill="#000" />
          <View>
            <Text
              style={{
                ...styles.h3,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 15
              }}
            >
              {children}
            </Text>
          </View>
          <Moon width={8} height={13} fill="#000" />
          <EightPointedStar width={10} height={10} fill="#000" />
        </View>
      </View>
    ),
    tagList: ({ children, title, elements }: { children: React.ReactNode, title: string, elements: React.ReactNode[] }) => (
      <View
        wrap={false}
        minPresenceAhead={80}
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        {title && <Text
          style={{
            ...styles.h4,
          }}
        >
          {title}
        </Text>}
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 5, marginBottom: 20 }}>
          {elements.map((element: React.ReactNode, idx: number) => (
            <View
              key={idx}
              style={{
                marginBottom: 10,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  backgroundColor: "#444",
                  borderRadius: 50,
                  color: "#fff",
                  padding: "5 10"
                }}
              >
                {element}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ),
  };

  return createThemeComponents(styles, themeOverrides);
};

/**
 * Professional theme - business-oriented styling
 */
export const professionalTheme = (styles: any) => {
  const themeOverrides = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <View>
        <Text
          break
          style={{
            ...styles.h1,
            color: "#1a365d",
            borderBottom: "1 solid #1a365d"
          }}
        >
          {children}
        </Text>
      </View>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <View>
        <Text
          style={{
            ...styles.h2,
            color: "#1a365d"
          }}
        >
          {children}
        </Text>
      </View>
    ),
    strongTitle: ({ children }: { children: React.ReactNode }) => (
      <View style={{ marginTop: 15, marginBottom: 5 }}>
        <Text style={{ ...styles.h3, color: "#1a365d" }}>
          {children}
        </Text>
      </View>
    )
  };

  return createThemeComponents(styles, themeOverrides);
};

/**
 * Dark theme - dark background with light text
 */
export const darkTheme = (styles: any) => {
  const themeOverrides = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <View
        style={{
          backgroundColor: "#333",
          padding: 10,
          marginVertical: 10
        }}
      >
        <Text
          break
          style={{
            ...styles.h1,
            color: "#fff"
          }}
        >
          {children}
        </Text>
      </View>
    ),
    strongTitle: ({ children }: { children: React.ReactNode }) => (
      <View
        style={{
          backgroundColor: "#333",
          padding: 5,
          marginTop: 10,
          marginBottom: 5
        }}
      >
        <Text style={{ ...styles.h4, color: "#fff" }}>
          {children}
        </Text>
      </View>
    )
  };

  return createThemeComponents(styles, themeOverrides);
};

// Map of theme names to their generator functions
const themeRegistry = {
  default: defaultTheme,
  astrology: astrologyTheme,
  professional: professionalTheme,
  dark: darkTheme
};

/**
 * Returns the component set for the specified theme
 * @param {string} themeName - Name of the theme to use
 * @param {Object} styles - Styles object to apply
 * @returns {Object} Theme component set
 */
export const getThemeComponents = (themeName: string, styles: any) => {
  // Check if requested theme exists, otherwise fall back to default
  if (!themeName || !themeRegistry[themeName as keyof typeof themeRegistry]) {
    console.warn(`Theme "${themeName}" not found. Using default theme.`);
    return defaultTheme(styles);
  }
  return themeRegistry[themeName as keyof typeof themeRegistry](styles);
};

/**
 * Get a list of all available theme names
 * @returns {string[]} List of theme names
 */
export const getAvailableThemes = () => {
  return Object.keys(themeRegistry);
};