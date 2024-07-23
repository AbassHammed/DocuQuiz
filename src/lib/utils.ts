'use client';

import { ClassValue, clsx } from 'clsx';
import { pdfjs } from 'react-pdf';
import { twMerge } from 'tailwind-merge';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts text content from a PDF file.
 * @param {File | Blob | MediaSource} file - The PDF file to extract text from.
 * @returns {Promise<string>} A promise that resolves with the extracted text content.
 */
const pdfToText = async (file: File | Blob | MediaSource): Promise<string | undefined> => {
  // Create a blob URL for the PDF file
  const blobUrl = URL.createObjectURL(file);

  // Load the PDF file
  const loadingTask = pdfjs.getDocument(blobUrl);

  let extractedText = '';
  let hadParsingError = false;
  try {
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    // Iterate through each page and extract text
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      extractedText += pageText;
    }
  } catch (error) {
    hadParsingError = true;
    console.error('Error extracting text from PDF:', error);
  }

  // Clean up the blob URL
  URL.revokeObjectURL(blobUrl);

  // Free memory from loading task
  loadingTask.destroy();

  if (!hadParsingError) {
    return extractedText;
  }
};

export default pdfToText;
