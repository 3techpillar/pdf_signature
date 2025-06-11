"use client";
import { useEffect, useRef, useState } from "react";

const DraggableImage = ({
  signatureImage,
  position,
  onPositionChange,
  size,
  onSizeChange,
  onDeleteCopy,
  copy,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const boxRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsSelected(false);
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const newPos = {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        };
        onPositionChange?.(newPos);
      } else if (isResizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        const newSize = {
          width: Math.max(50, resizeStart.current.width + dx),
          height: Math.max(30, resizeStart.current.height + dy),
        };
        onSizeChange?.(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousedown", handleDocumentClick);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, offset, onPositionChange, onSizeChange]);

  const handleMouseDown = (e) => {
   if (e.target.classList.contains("resize-handle")) return;

    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setIsSelected(true);
    e.stopPropagation();
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        border: isSelected ? "1.5px dashed blue" : "none",
        cursor: isSelected ? "move" : "pointer",
        userSelect: "none",
        zIndex: isSelected ? 1000 : 1,
      }}
    >
    <button
  onClick={(e) => {
    
    onDeleteCopy?.(copy.id);
  }}
  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl"
>
  ✕
</button>

      <img
        src={signatureImage}
        alt="Signature"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
         
        }}
      />

{isSelected && (
  <>
    {/* Resize Handle */}
    <div
      onMouseDown={handleResizeMouseDown}
      className="resize-handle"
      style={{
        position: "absolute",
        right: -8,
        bottom: -8,
        width: 16,
        height: 16,
        backgroundColor: "white",
        border: "2px solid #3B82F6",
        cursor: "nwse-resize",
        borderRadius: "50%",
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
        zIndex: 10,
      }}
      title={`x: ${position.x}, y: ${position.y}, w: ${size.width}, h: ${size.height}`}
    />

    {/* Debug Info Box */}
    <div
      style={{
        position: "absolute",
        top: -24,
        left: 0,
        backgroundColor: "#3B82F6",
        color: "white",
        padding: "2px 6px",
        borderRadius: "6px",
        fontSize: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
      }}
    >
      x: {position.x}, y: {position.y}, w: {size.width}, h: {size.height}
    </div>
     <div className="absolute bottom-0 left-0 bg-white text-xs p-1">
              ID: {copy.id}
              <br />
              Page: {copy.page}
            </div>
  </>
)}

    </div>
  );
};

export default DraggableImage;
