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
export const defaultTheme = (styles) => {
  return createThemeComponents(styles);
};

/**
 * Astrology theme - custom components with astrology-themed decorations
 */
export const astrologyTheme = (styles) => {
  const themeOverrides = {
    h1: ({ children }) => (
      <View
        break
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
    h2: ({ children }) => (
      <View
            minPresenceAhead={1}
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
            >
              <Line3 height={1} />
            </View>
          </View>
    ),
    h3: ({ children }) => (
      <View
            minPresenceAhead={1}
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
            <Line1 width={400} />
          </View>
    ),
    h4: ({ children }) => (
      <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
            minPresenceAhead={1}
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
    blockquote: ({ children }) => (
      <View
        style={{
          ...styles.blockquote,
          borderLeft: "3 solid #555",
          backgroundColor: "#f5f5f5"
        }}
      >
        {children}
      </View>
    ),
    strongTitle: ({ children, index }) => (
      <View
        minPresenceAhead={1}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignContent: "center",
          marginVertical: 10
        }}
        debug
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
        <Line1 width={400} />
      </View>
    )
  };

  return createThemeComponents(styles, themeOverrides);
};

/**
 * Professional theme - business-oriented styling
 */
export const professionalTheme = (styles) => {
  const themeOverrides = {
    h1: ({ children }) => (
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
    h2: ({ children }) => (
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
    strongTitle: ({ children }) => (
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
export const darkTheme = (styles) => {
  const themeOverrides = {
    h1: ({ children }) => (
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
    strongTitle: ({ children }) => (
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
export const getThemeComponents = (themeName, styles) => {
  // Check if requested theme exists, otherwise fall back to default
  if (!themeName || !themeRegistry[themeName]) {
    console.warn(`Theme "${themeName}" not found. Using default theme.`);
    return defaultTheme(styles);
  }
  console.warn(`Theme "${themeName}" was found.`);
  return themeRegistry[themeName](styles);
};

/**
 * Get a list of all available theme names
 * @returns {string[]} List of theme names
 */
export const getAvailableThemes = () => {
  return Object.keys(themeRegistry);
};