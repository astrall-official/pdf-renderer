import { useState, ChangeEvent } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "../components/MyDocument";
import styles from "../styles/Home.module.css";
import { DocumentData } from "../types";

export default function Home() {
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: "Sample PDF Document",
    author: "Next.js PDF Exporter",
    content:
      "This is a sample PDF document generated using React-PDF in Next.js.",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleServerExport() {
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`PDF successfully exported to: ${data.filePath}`);
      } else {
        const error = await response.json();
        alert(`Failed to export PDF: ${error.message}`);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("An error occurred while exporting the PDF.");
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Next.js PDF Exporter</h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Document Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={documentData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                name="author"
                value={documentData.author}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                name="content"
                rows={5}
                value={documentData.content}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.buttonGroup}>
              <PDFDownloadLink
                document={<MyDocument data={documentData} />}
                fileName="document.pdf"
                className={styles.button}
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Generating PDF..." : "Download PDF"
                }
              </PDFDownloadLink>

              <button className={styles.button} onClick={handleServerExport}>
                Export to Server
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <h2>Preview</h2>
            <div className={styles.preview}>
              <h3>{documentData.title}</h3>
              <p>
                <strong>Author:</strong> {documentData.author}
              </p>
              <p>{documentData.content}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
