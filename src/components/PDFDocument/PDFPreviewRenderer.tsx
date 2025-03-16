"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react';
//import { PDFViewer } from '@react-pdf/renderer';
import MarkdownReportPDF from './MarkdownReportPDF';

const PDFViewer = dynamic( () => import( "@react-pdf/renderer" ).then((mod) => mod.PDFViewer), {
    loading: () => "loading PDF preview...",
    ssr: false
  } );

interface PDFPreviewRendererProps {
  markdown: string;
  theme: string;
  reportName: string;
  userName: string;
  location?: string;
  birthDate?: string;
  birthTime?: string;
  viewerHeight?: string;
}

const PDFPreviewRenderer: React.FC<PDFPreviewRendererProps> = ({
  markdown,
  theme,
  reportName,
  userName,
  location = 'Sample Location',
  birthDate = '2000-01-01',
  birthTime = '12:00',
  viewerHeight = '100%'
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return placeholder if not on client
  if (!isClient) {
    return <div>Loading PDF preview...</div>;
  }

  // Prepare the PDF document element
  const pdfDocument = (
    <MarkdownReportPDF
      markdown={markdown}
      theme={theme}
      reportName={reportName}
      userName={userName}
      location={location}
      birthDate={birthDate}
      birthTime={birthTime}
    />
  );

  // Default to viewer mode
  return (
    <PDFViewer width="100%" height={viewerHeight} style={{ border: '1px solid #ccc' }}>
      {pdfDocument}
    </PDFViewer>
  );
};

export default PDFPreviewRenderer;
