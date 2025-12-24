import { StyleSheet, Font } from "@react-pdf/renderer";
import path from "path";

// Calculate absolute path to public/fonts/ttf directory
const getPublicFontsPath = () => {
  // Get the current working directory (project root)
  const projectRoot = process.cwd();
  // Build path to public/fonts/ttf
  return path.join(projectRoot, 'public', 'fonts', 'ttf');
};

const fontsPath = getPublicFontsPath();

Font.registerHyphenationCallback(word => {
  // Return entire word as unique part
  return [word];
});

// Register font
// Font.register({
//   family: "Aboreto",
//   fonts: [
//     { src: "https://fonts.gstatic.com/s/aboreto/v2/5DCXAKLhwDDQ4N8bpK3UAk6t1Sd3PA.woff2" },
//     { src: "https://fonts.gstatic.com/s/aboreto/v2/5DCXAKLhwDDQ4N8bpK3UAk6t1Sd3PA.woff2", fontStyle: "italic" },
//   ]
// });

// Font.register({
//   family: "Poiret One",
//   fonts: [
//     { src: "http://fonts.gstatic.com/s/poiretone/v4/HrI4ZJpJ3Fh0wa5ofYMK8S3USBnSvpkopQaUR-2r7iU.ttf" },
//     { src: "http://fonts.gstatic.com/s/poiretone/v4/HrI4ZJpJ3Fh0wa5ofYMK8S3USBnSvpkopQaUR-2r7iU.ttf", fontStyle: "italic" },
//   ]
// });

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(fontsPath, "Montserrat-Thin.ttf"), fontWeight: 100 },
    { src: path.join(fontsPath, "Montserrat-ThinItalic.ttf"), fontWeight: 100, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-ExtraLight.ttf"), fontWeight: 200 },
    { src: path.join(fontsPath, "Montserrat-ExtraLightItalic.ttf"), fontWeight: 200, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-Light.ttf"), fontWeight: 300 },
    { src: path.join(fontsPath, "Montserrat-LightItalic.ttf"), fontWeight: 300, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsPath, "Montserrat-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-Medium.ttf"), fontWeight: 500 },
    { src: path.join(fontsPath, "Montserrat-MediumItalic.ttf"), fontWeight: 500, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(fontsPath, "Montserrat-SemiBoldItalic.ttf"), fontWeight: 600, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-Bold.ttf"), fontWeight: 700 },
    { src: path.join(fontsPath, "Montserrat-BoldItalic.ttf"), fontWeight: 700, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-ExtraBold.ttf"), fontWeight: 800 },
    { src: path.join(fontsPath, "Montserrat-ExtraBoldItalic.ttf"), fontWeight: 800, fontStyle: "italic" },

    { src: path.join(fontsPath, "Montserrat-Black.ttf"), fontWeight: 900 },
    { src: path.join(fontsPath, "Montserrat-BlackItalic.ttf"), fontWeight: 900, fontStyle: "italic" },
  ]
});

// Font.register({
//   family: "Aboreto",
//   source: "http://fonts.gstatic.com/s/adventpro/v4/rT9jpj7pBpZV6AmssbZKky3USBnSvpkopQaUR-2r7iU.ttf",
//   fontStyle: "bold",
// });

// Base styles that all themes will extend
const baseStyles = {
  page: {
    padding: 50,
    fontFamily: "Montserrat",
    fontSize: 12
  },
  h1: {
    fontSize: 18,
    fontWeight: 300,
    marginBottom: 10,
    marginTop: 20,
    textTransform: "uppercase",
    maxWidth: 400
  },
  h2: {
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 8,
    marginTop: 16,
    maxWidth: 400
  },
  h3: {
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 6,
    marginTop: 14,
    maxWidth: 400
  },
  h4: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 4,
    marginTop: 12
    // maxWidth removed - let it use full width
  },
  h5: {
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 4,
    marginTop: 10
  },
  h6: {
    fontSize: 8,
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 10
  },
  p: {
    marginBottom: 10,
    lineHeight: 1.5,
    fontWeight: 400
  },
  strong: {
    fontWeight: "bold",
    textDecoration: "underline"
  },
  em: {
    fontStyle: "italic"
  },
  link: {
    textDecoration: "underline"
  },
  hr: {
    borderBottom: 1,
    marginVertical: 10
  },
  list: {
    marginBottom: 12,
    paddingLeft: 10
  },
  listItem: {
    marginBottom: 5,
    lineHeight: 1.5
  },
  blockquote: {
    marginLeft: 10,
    paddingLeft: 10,
    padding: 10,
    borderLeftWidth: 2,
    fontStyle: "italic"
  },
  code: {
    // fontFamily: "Courier",
    padding: 2
  },
  codeBlock: {
    // fontFamily: "Courier",
    padding: 8,
    marginVertical: 10
  },
  line1: {
    height: 5,
    border: "0",
    background:
      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
  }
};

// Default theme extends base styles
const defaultTheme = StyleSheet.create({
  page: {
    ...baseStyles.page
  },
  h1: {
    ...baseStyles.h1
  },
  h2: {
    ...baseStyles.h2
  },
  h3: {
    ...baseStyles.h3
  },
  h4: {
    ...baseStyles.h4
  },
  h5: {
    ...baseStyles.h5
  },
  h6: {
    ...baseStyles.h6
  },
  p: {
    ...baseStyles.p
  },
  strong: {
    ...baseStyles.strong
  },
  em: {
    ...baseStyles.em
  },
  link: {
    ...baseStyles.link,
    color: "blue"
  },
  hr: {
    ...baseStyles.hr,
    borderColor: "#000000"
  },
  list: {
    ...baseStyles.list
  },
  listItem: {
    ...baseStyles.listItem
  },
  blockquote: {
    ...baseStyles.blockquote,
    borderLeftColor: "#ccc"
  },
  code: {
    ...baseStyles.code,
    backgroundColor: "#f0f0f0"
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    backgroundColor: "#f0f0f0"
  },
  line1: {
    ...baseStyles.line1
  }
});

// Dark theme
const darkTheme = StyleSheet.create({
  page: {
    ...baseStyles.page,
    backgroundColor: "#1a1a1a",
    color: "#f5f5f5"
  },
  h1: {
    ...baseStyles.h1,
    color: "#ffffff"
  },
  h2: {
    ...baseStyles.h2,
    color: "#ffffff"
  },
  h3: {
    ...baseStyles.h3,
    color: "#ffffff"
  },
  h4: {
    ...baseStyles.h4,
    color: "#ffffff"
  },
  h5: {
    ...baseStyles.h5,
    color: "#ffffff"
  },
  h6: {
    ...baseStyles.h6,
    color: "#ffffff"
  },
  p: {
    ...baseStyles.p,
    color: "#f5f5f5"
  },
  strong: {
    ...baseStyles.strong
  },
  em: {
    ...baseStyles.em
  },
  link: {
    ...baseStyles.link,
    color: "#4da6ff"
  },
  hr: {
    ...baseStyles.hr,
    borderColor: "#666666"
  },
  list: {
    ...baseStyles.list
  },
  listItem: {
    ...baseStyles.listItem,
    color: "#f5f5f5"
  },
  blockquote: {
    ...baseStyles.blockquote,
    borderLeftColor: "#666666"
  },
  code: {
    ...baseStyles.code,
    backgroundColor: "#2a2a2a",
    color: "#f5f5f5"
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    backgroundColor: "#2a2a2a",
    color: "#f5f5f5"
  }
});

// Professional theme
const professionalTheme = StyleSheet.create({
  page: {
    ...baseStyles.page,
    fontFamily: "Times-Roman",
    padding: 40
  },
  h1: {
    ...baseStyles.h1,
    color: "#003366",
    fontFamily: "Times-Roman"
  },
  h2: {
    ...baseStyles.h2,
    color: "#003366",
    fontFamily: "Times-Roman"
  },
  h3: {
    ...baseStyles.h3,
    color: "#003366",
    fontFamily: "Times-Roman"
  },
  h4: {
    ...baseStyles.h4,
    color: "#003366",
    fontFamily: "Times-Roman"
  },
  h5: {
    ...baseStyles.h5,
    color: "#003366",
    fontFamily: "Times-Roman"
  },
  h6: {
    ...baseStyles.h6,
    color: "#003366",
    fontFamily: "Times-Roman"
  },
  p: {
    ...baseStyles.p,
    fontFamily: "Times-Roman"
  },
  strong: {
    ...baseStyles.strong
  },
  em: {
    ...baseStyles.em
  },
  link: {
    ...baseStyles.link,
    color: "#003366"
  },
  hr: {
    ...baseStyles.hr,
    borderColor: "#003366"
  },
  list: {
    ...baseStyles.list
  },
  listItem: {
    ...baseStyles.listItem,
    fontFamily: "Times-Roman"
  },
  blockquote: {
    ...baseStyles.blockquote,
    borderLeftColor: "#003366"
  },
  code: {
    ...baseStyles.code,
    backgroundColor: "#f7f7f7"
  },
  codeBlock: {
    ...baseStyles.codeBlock,
    backgroundColor: "#f7f7f7"
  }
});

// Function to get theme by name
const getTheme = themeName => {
  switch (themeName) {
    case "dark":
      return darkTheme;
    case "professional":
      return professionalTheme;
    case "default":
    default:
      return defaultTheme;
  }
};

export { defaultTheme, darkTheme, professionalTheme, getTheme };
