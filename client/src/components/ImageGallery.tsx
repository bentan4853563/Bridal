import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";

interface ImageGalleryProps {
  secondaryPhotoPreviews: string[];
  handleCloseSecondaryPhoto: (index: number) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  secondaryPhotoPreviews,
  handleCloseSecondaryPhoto,
  handleFileSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % secondaryPhotoPreviews.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? secondaryPhotoPreviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex gap-4">
      {secondaryPhotoPreviews?.map((preview, index) => (
        <div key={index} className="relative">
          <img
            src={preview}
            alt={`Secondary Preview ${index + 1}`}
            loading="lazy"
            className="w-16 sm:w-32 h-16 sm:h-32 rounded-lg cursor-pointer"
            onClick={() => openModal(index)}
          />
          <IoMdClose
            onClick={() => handleCloseSecondaryPhoto(index)}
            className="absolute top-2 right-2 text-white text-2xl cursor-pointer"
          />
        </div>
      ))}

      <div className="border rounded-lg hover:border-sky-300">
        <input
          type="file"
          id="secondaryPhotos"
          name="secondaryPhotos"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="secondaryPhotos"
          className="flex justify-center w-full h-full cursor-pointer"
        >
          <div className="w-16 sm:w-32 h-16 sm:h-32 p-4 border rounded-lg hover:border-sky-300 flex flex-col items-center justify-center gap-2">
            <CiImageOn className="text-3xl" />
            <span className="hidden sm:block">Secondary Image</span>
          </div>
        </label>
      </div>

      {/* Modal for Image Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <img
              src={secondaryPhotoPreviews[currentImageIndex]}
              alt={`Preview ${currentImageIndex + 1}`}
              className="max-w-full max-h-full"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
              &gt;
            </button>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              <IoMdClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
