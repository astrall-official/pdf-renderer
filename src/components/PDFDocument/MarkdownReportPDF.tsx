import React from "react";
// @ts-ignore
import Markdown from "react-markdown";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { getTheme } from "../../styles/pdfThemes";
// @ts-ignore
import remarkGfm from "remark-gfm";
import { default as Logo } from "./assets/general/logo";
import { getThemeComponents } from "./themes/themeComponents";
import { text } from "stream/consumers";

// Simple placeholder SVG icon component
const PlaceholderIcon = () => <Logo width={120} height={120} fill="white" />;

/**
 * Component to render a markdown string as PDF
 * @param {Object} props - Component props
 * @param {string} props.markdown - Markdown content to render
 * @param {string} [props.theme='default'] - Theme name to apply ('default', 'dark', 'professional', or 'astrology')
 * @param {string} [props.reportName=''] - Name of the report
 * @param {string} [props.userName=''] - Name of the user
 * @param {string} [props.location=''] - Birth location
 * @param {string} [props.birthDate=''] - Birth date
 * @param {string} [props.birthTime=''] - Birth time
 */
const MarkdownReportPDF = ({
  markdown,
  theme = "astrology",
  reportName = "Interpretación Consultas Astrológicas",
  userName = "Ximena Vallejos",
  location = "Villarrica, Chile",
  birthDate = "1985-03-04",
  birthTime = "14:40"
}: { markdown: string; theme?: string; reportName?: string; userName?: string; location?: string; birthDate?: string; birthTime?: string; }) => {
  const styles = getTheme(theme);
  const components = getThemeComponents(theme, styles);

  const coverPageStyles = {
    page: { ...styles.page, backgroundColor: "#444444", color: "white", position: "relative" },
    icon: {
      position: "absolute",
      zIndex: 999999,
      top: 40,
      right: 40
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flex: "1",
      textAlign: "center",
    },
  };

  return (
    <Document>
      <Page size="A4" style={coverPageStyles.page}>
        <View
          debug
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 40,
            backgroundColor: "#777777"
          }}
        ></View>
        <View style={coverPageStyles.icon}>
          <PlaceholderIcon />
        </View>

        <View debug style={coverPageStyles.mainContent}>
        <Text style={styles.h3}>{reportName}</Text>
          <Text style={styles.h1}>{userName}</Text>
            <Text style={{...styles.h4, marginTop: 5 }}>{location}</Text>
            <Text style={{...styles.h4, marginTop: 5}}>{birthDate} {birthTime || ''}</Text>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <Markdown
          key={markdown.length + theme}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: components.h1,
            h2: components.h2,
            h3: components.h3,
            h4: components.h4,
            h5: components.h5,
            h6: components.h6,
            strong: components.strong,
            p: components.p,
            em: components.em,
            a: components.a,
            code: components.code,
            hr: components.hr,
            ol: components.ol,
            ul: components.ul,
            li: components.li,
            blockquote: components.blockquote,
            pre: components.pre,
            div: components.div,
          }}
        >
          {markdown}
        </Markdown>
      </Page>
    </Document>
  );
};

export default MarkdownReportPDF;
