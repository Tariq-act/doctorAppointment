"use client";

import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
  accept?: Accept;
  hint?: string;
};

const FileUploader = ({
  files,
  onChange,
  accept,
  hint = "SVG, PNG, JPG or GIF (max 800x400)",
}: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt='uploaded'
          className='max-h-[400px] w-auto overflow-hidden object-cover'
          style={{ width: "auto", height: "auto" }}
        />
      ) : (
        <>
          <Image
            src={"/assets/icons/upload.svg"}
            width={40}
            height={40}
            alt='upload'
          />
          <div className='file-upload_label'>
            <p className='text-14-regular'>
              <span className='text-green-500'>Click to upload</span> or drag
              and drop
            </p>
            <p>{hint}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
