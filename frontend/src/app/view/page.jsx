'use client';
import { useSearchParams } from 'next/navigation';
import { PDFDocument } from 'pdf-lib';
import { useState } from "react";
import { pdfjs } from 'react-pdf';
import SignatureCanvas from '../components/SignatureCanvas';
import SignaturePad from '../components/SignaturePad';
import Editor from '../components/text/Editor';
import ToolsSidebar from "../components/ToolsSidebar";
import Viewer from '../components/Viewer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const Page = () => {
  const [textData ,setTextData]= useState(null);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textSize, setTextSize] = useState({ width: 200, height: 50 });
  const [penColor, setPenColor] = useState("black");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(16);
  const [activeTool, setActiveTool] = useState("none");
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("fileUrl");
    const [signatureImage, setSignatureImage] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100 });
  const [signatureSize, setSignatureSize] = useState({ width: 170, height: 100 });
 const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
 const [copies, setCopies] = useState([
  {
    id: 0, // Reserved for the "Add" button image
    position: null,
    size: null,
    page: null,
  },
]);




function base64ToUint8Array(base64) {
  // Remove data URI scheme if present
  const cleanedBase64 = base64.replace(/^data:image\/\w+;base64,/, '');

  const raw = atob(cleanedBase64);
  const uint8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}

async function handleUpdatedPdf(fileUrl, signatureImageBase64) {
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();

  const originalPdfDoc = await PDFDocument.load(arrayBuffer);
  const copiedPdfDoc = await PDFDocument.create();

  const copiedPages = await copiedPdfDoc.copyPages(
    originalPdfDoc,
    originalPdfDoc.getPageIndices()
  );
  copiedPages.forEach((page) => copiedPdfDoc.addPage(page));

  // Embed PNG signature image
  const pngImageBytes = base64ToUint8Array(signatureImageBase64);
  const pngImage = await copiedPdfDoc.embedPng(pngImageBytes);

  const firstPage = copiedPdfDoc.getPage(0);
  const { height } = firstPage.getSize();

  firstPage.drawImage(pngImage, {
    x: 100,
    y: 100,
    width: 150,
    height: 100,
  });

  const pdfBytes = await copiedPdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'copied_pdf.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        No file specified. Please provide a fileUrl query parameter.
      </div>
    );
  }

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white fixed top-0 bottom-0 left-0 z-20">
        <ToolsSidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-4 relative z-10">
        {/* Apply Button */}
        <div className='p-2 flex justify-end'>
          <button
         onClick={() => handleUpdatedPdf(fileUrl, signatureImage)}

            className='bg-green-500 text-white font-bold p-2 rounded-xl hover:bg-green-600'
          >
            Apply Changes
          </button>
        </div>

        {/* PDF Viewer */}
        <main className="flex-1 p-4 overflow-y-auto flex justify-center">
          <Viewer fileUrl={fileUrl}
          numPages={numPages} 
            setNumPages={setNumPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
             
          />
        </main>

        {signatureImage && (
          <div className=" z-20">
           <SignatureCanvas 
           signatureImage={signatureImage}
           copies={copies}
           setCopies={setCopies}
           pageNumber={pageNumber}
            />

          </div>
        )}
          {textData && (
          <div className=" z-20">
            {/* <DraggableText 
              text={textData}
              setText={setTextData}
              position={textPosition}
              setTextPosition={setTextPosition}
              size={textSize}
              penColor={penColor}
              fontFamily={fontFamily}
              setTextSize={setTextSize}
              setPenColor={setPenColor}
              setFontFamily={setFontFamily}
            /> */}
          </div>
        )}
        

       

        
        {activeTool === "Sign Document" && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded shadow-lg">
              <SignaturePad
               signatureImage={signatureImage}
                setActiveTool={setActiveTool}
                setSignatureImage={setSignatureImage}
              />
            </div>
          </div>
        )}
         {activeTool === "Add Text" && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white p-6 rounded shadow-lg">
            <Editor 
       setActiveTool={setActiveTool}
       setTextData={setTextData}  
       fontSize={fontSize}
       setFontSize={setFontSize}
       fontFamily={fontFamily}
       penColor={penColor}
       setFontFamily={setFontFamily}
       setPenColor={setPenColor}
    />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Page;
