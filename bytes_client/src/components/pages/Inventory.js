// import React, { useState } from 'react';
// // import '../../App.css';
// import './Inventory.css';

// function Inventory() {
//   const [images, setImages] = useState([]);
//   const fileInputRef = React.createRef();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     setImages([...images, ...droppedFiles]);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleFileSelect = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImages([...images, ...selectedFiles]);
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div className="inventory-container">
//       <div
//         className="drop-area"
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//       >
//         <p>Drag and drop images here</p>
//         <button type="button" onClick={handleUploadClick}>
//           Upload Images
//         </button>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           style={{ display: 'none' }}
//           onChange={handleFileSelect}
//           ref={fileInputRef}
//         />
//       </div>
//       <div className="image-preview">
//         {images.map((image, index) => (
//           <img
//             key={index}
//             src={URL.createObjectURL(image)}
//             alt={`Image ${index}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Inventory;

import React, { useState } from 'react';
import './Inventory.css';

function Inventory() {
  const [images, setImages] = useState([]);
  const fileInputRef = React.createRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setImages([...images, ...droppedFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  return (
    <div className="inventory-container">
      <div
        className="drop-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag and drop images here</p>
        <button type="button" onClick={handleUploadClick}>
          Upload Images
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          ref={fileInputRef}
        />
      </div>
      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img
              src={URL.createObjectURL(image)}
              alt={`Image ${index}`}
            />
            <button
              className="remove-button"
              onClick={() => handleRemoveImage(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;

