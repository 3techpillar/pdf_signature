'use client';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const SignaturePad = ({  setActiveTool,  setSignatureImage  }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';
    }
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureImage(null);
  };

  const finalizeSignature = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    console.log(dataURL);
    setSignatureImage(dataURL);
    setActiveTool('none'); 
  };

  return (
    <div>
      <div className='flex justify-end mb-4'>
        <button onClick={() => setActiveTool('none')}>
          <AiOutlineClose />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className='border border-black'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className='flex justify-center gap-3 mt-3'>
        <button
          onClick={clearCanvas}
          className='border-2 border-gray-400 p-2 bg-gray-300 disabled:opacity-50'
        >
          Clear
        </button>
        <button
          onClick={finalizeSignature}
          className='border-2 border-green-600 p-2 bg-green-400 disabled:opacity-50'
        >
          Finalize Sign
        </button>
      </div>

    </div>
  );
};

export default SignaturePad;
