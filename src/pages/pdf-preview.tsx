"use client";
import React, { useState, useEffect } from "react";
import PDFPreviewRenderer from "../components/PDFDocument/PDFPreviewRenderer";
import { exampleMarkdown } from "../data/exampleMarkdown";
import styles from "../styles/PdfPreview.module.css";

const PdfPreviewPage = () => {
  const [markdown, setMarkdown] = useState(exampleMarkdown);
  const [theme, setTheme] = useState("astrology");
  const [documentName, setdocumentName] = useState("3 PREGUNTAS A LAS ESTRELLAS");
  const [userName, setUserName] = useState("Fernanda Escobar");
  const [viewerHeight, setViewerHeight] = useState("100%");

  return (
    <div className={styles.splitContainer}>
      {/* Left Column - Controls */}
      <div className={styles.leftColumn}>
        <h1 className={styles.title}>PDF Markdown Preview</h1>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Theme:</label>
            <select
              className={styles.select}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="astrology">Astrology</option>
              <option value="dark">Dark</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>Report Name:</label>
            <input
              className={styles.input}
              type="text"
              value={documentName}
              onChange={(e) => setdocumentName(e.target.value)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.label}>User Name:</label>
            <input
              className={styles.input}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.markdownEditor}>
          <h3 className={styles.subtitle}>Markdown Editor</h3>
          <textarea
            className={styles.textarea}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={20}
          />
        </div>
      </div>

      {/* Right Column - PDF Preview */}
      <div className={styles.rightColumn}>
        <PDFPreviewRenderer
          key={markdown.length + theme}
          markdown={markdown}
          theme={theme}
          documentName={documentName}
          userName={userName}
          location="Santiago, Chile"
          birthDate="1995-NOV-18"
          birthTime="12:00"
          viewerHeight={viewerHeight}
        />
      </div>
    </div>
  );
};

export default PdfPreviewPage;
