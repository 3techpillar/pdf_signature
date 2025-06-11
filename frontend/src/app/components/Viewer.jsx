import { useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Document, Page } from 'react-pdf';


function Viewer({ fileUrl ,numPages,setNumPages,pageNumber,setPageNumber}) {

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && pageNumber > 1) {
        setPageNumber(pageNumber - 1);
      } else if (e.key === 'ArrowRight' && pageNumber < numPages) {
        setPageNumber(pageNumber + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  if (!fileUrl) {
    return <p className="text-gray-500">No file URL provided.</p>;
  }

  return (
    
          
       <div className='flex  h-auto w-full justify-evenly'>
        <div className='flex justify-center items-center'><button   disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}><IoIosArrowBack size={30} /></button>
</div>
       <div className='flex flex-col gap-1 '>
       
         <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="border-2 border-gray-400 "
        loading={<p>Loading PDF...</p>}
        error={<p>Failed to load PDF.</p>}
      >
        <Page pageNumber={pageNumber}  />
      </Document>
       <span className="flex items-center justify-center gap-2">
          Page
          <input
            type="number"
            min={1}
            max={numPages || 1}
            value={pageNumber}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val >= 1 && val <= numPages) setPageNumber(val);
            }}
            className="w-16 border rounded px-2 py-1 text-center"
          />
          of {numPages || '...'}
        </span>
       </div>
           
      
    
     <div className=' flex justify-center items-center'><button  disabled={!numPages || pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}><IoIosArrowForward size={30}/></button></div>
      
    </div>
  
   
  );
}

export default Viewer;
