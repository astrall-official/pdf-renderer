import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DocumentData } from "../types";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    marginBottom: 40,
    textAlign: "center",
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: "center",
    color: "grey",
  },
});

interface MyDocumentProps {
  data: DocumentData;
}

const MyDocument: React.FC<MyDocumentProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.author}>Author: {data.author}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.content}>{data.content}</Text>
      </View>
      <View style={styles.footer}>
        <Text>Generated with Next.js and React-PDF</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
