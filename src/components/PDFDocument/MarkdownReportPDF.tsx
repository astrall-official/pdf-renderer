// @ts-nocheck
import React from "react";
// @ts-ignore
import Markdown from "react-markdown";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { getTheme } from "../../styles/pdfThemes";
// @ts-ignore
import remarkGfm from "remark-gfm";
import { default as Logo } from "./assets/general/logo";
import { getThemeComponents } from "./themes/themeComponents";
import { text } from "stream/consumers";
import { transform } from "next/dist/build/swc/generated-native";


/**
 * Component to render a markdown string as PDF
 * @param {Object} props - Component props
 * @param {string} props.markdown - Markdown content to render
 * @param {string} [props.theme='default'] - Theme name to apply ('default', 'dark', 'professional', or 'astrology')
 * @param {string} [props.documentName=''] - Name of the report
 * @param {string} [props.userName=''] - Name of the user
 * @param {string} [props.location=''] - Birth location
 * @param {string} [props.birthDate=''] - Birth date
 * @param {string} [props.birthTime=''] - Birth time
 */
const MarkdownReportPDF = ({
  markdown,
  theme = "astrology",
  documentName = "Interpretación Consultas Astrológicas",
  userName = "Ximena Vallejos",
  location = "Villarrica, Chile",
  birthDate = "1985-03-04",
  birthTime = "14:40"
}: { markdown: string; theme?: string; documentName?: string; userName?: string; location?: string; birthDate?: string; birthTime?: string; }) => {
  const styles = getTheme(theme);
  const components = getThemeComponents(theme, styles);

  const coverPageStyles = {
    page: { ...styles.page, backgroundColor: "#444444", color: "white", position: "relative" },
    icon: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-30%)",
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

  // Calculate processed markdown adding an \n character after at start of line if line contains '-' and ':'
  const processedMarkdown = markdown.split('\n').map(line => {
    // count number of '-' in line
    const dashCount = (line.match(/-/g) || []).length;
    if (dashCount > 1 && line.includes(':')) {
      return '\n' + line + '\n';
    }
    return line + '\n';
  }).join('');
  return (
    <Document>
      <Page size="RA4" style={coverPageStyles.page} wrap={true}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 40,
            backgroundColor: "#777777"
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 40,
            backgroundColor: "#777777"
          }}
        />
        <View style={coverPageStyles.mainContent}>
          <View style={coverPageStyles.icon}>
            <Logo width={60} height={60} fill="white" />
          </View>
          <Text style={{ ...styles.h1, fontSize: 24, fontWeight: 200, maxWidth: 350 }}>{documentName}</Text>
          <Image src={"https://raw.githubusercontent.com/astrall-official/pdf-renderer/refs/heads/main/src/assets/img/astrology-wheel.jpg"} style={{ width: 400, height: 400, marginVertical: 20 }} />
          <Text style={styles.h1}>{userName}</Text>
          <Text style={{ ...styles.h4, marginTop: 5 }}>{location}</Text>
          <Text style={{ ...styles.h4, marginTop: 5 }}>{birthDate} {birthTime || ''}</Text>
        </View>
      </Page>
      <Page size="RA4" style={styles.page} wrap={true}>
        <Text render={({ pageNumber, totalPages }) => {
          if (pageNumber <= 2) {
            return "";
          }
          return pageNumber - 2
        }} fixed style={{ right: 30, bottom: 30, position: "absolute" }} />
        <Markdown
          key={processedMarkdown.length + theme}
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
            // pre: components.pre,
            //div: components.div,
          }}
        >
          {processedMarkdown}
        </Markdown>
      </Page>
    </Document>
  );
};

export default MarkdownReportPDF;
