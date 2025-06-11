'use client';
import { useState } from "react";
import DraggableImage from "./DraggableImage";


const SignatureCanvas = ({ signatureImage, pageNumber, copies, setCopies }) => {
  const [selectedId, setSelectedId] = useState(null); // <- Track selected copy


const handleAddCopy = () => {
  const newCopy = {
    id: Date.now(),
    position: { x: 100, y: 100 },
    size: { width: 100, height: 50 },
    page: pageNumber,
  };
  setCopies((prev) => [...prev, newCopy]);
};

 const handleDeleteCopy = (idToRemove) => {
  setCopies((prev) =>
    prev.filter((copy) => copy.id !== idToRemove || copy.id === 0)
  );
};

  const updateCopy = (id, field, value) => {
    setCopies((prev) =>
      prev.map((copy) =>
        copy.id === id ? { ...copy, [field]: value } : copy
      )
    );
  };


  return (
    <div className="absolute top-0 left-0 p-4 flex flex-wrap gap-4">
      {copies.map((copy, index) =>
        index === 0 ? (
          <button
            key={copy.id}
            onClick={handleAddCopy}
            className="w-42 h-24 border-2 border-red-500 relative"
          >
            <img
              src={signatureImage}
              alt="Add Signature Copy"
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </button>
        ) : (
          <div
            key={copy.id}
           
            
          >
           {pageNumber === copy.page && (
  <DraggableImage
    signatureImage={signatureImage}
    position={copy.position}
    size={copy.size}
    onPositionChange={(newPos) => updateCopy(copy.id, 'position', newPos)}
    onSizeChange={(newSize) => updateCopy(copy.id, 'size', newSize)}
    onDeleteCopy={(id) => {
      setCopies((prev) => prev.filter((c) => c.id !== id));
    }}
    copy={copy}
  />
)}

          

           
          </div>
        )
      )}
    </div>
  );
};

export default SignatureCanvas;
