import React, { ChangeEvent } from "react";

interface ImageUploadProps {
  previewFile: string;
  fileName: string;
  onFileSelect: (file: File | null, name: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  previewFile,
  fileName,
  onFileSelect,
}) => {
  const classNames = (...classes: (string | undefined)[]) => {
    return classes?.filter(Boolean).join(" ");
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files ? e.target.files[0] : null, e.target.name);
  };

  return (
    <>
      <div className="relative w-full h-full flex justify-center items-center">
        <input
          type="file"
          id={fileName}
          className="hidden"
          name={fileName}
          onChange={handleChangeFile}
        />
        <label htmlFor={fileName} className="flex justify-center w-full h-full">
          <img
            src={previewFile}
            alt="Upload"
            loading="lazy"
            className={classNames(
              `inline-block object-cover`,
              "cursor-pointer"
            )}
          />
        </label>
      </div>
    </>
  );
};

export default ImageUpload;
