"use client";

import { RenderEmptyState } from "@/components/file-uploader/render-state";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

const Uploader = () => {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    key: undefined,
    isDeleting: false,
    error: false,
    fileType: "image",
  });

  const uploadFile = async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
    } catch (error) {}
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileState({
        file,
        id: uuidv4(),
        uploading: false,
        progress: 0,
        key: file.name,
        isDeleting: false,
        error: false,
        fileType: "image",
        objectUrl: URL.createObjectURL(file),
      });
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const toManyFiles = fileRejections.find(
        (r) => r.errors.length > 0 && r.errors[0].code === "too-many-files"
      );

      const fileTooLarge = fileRejections.find(
        (r) => r.errors[0].code === "file-too-large"
      );

      if (toManyFiles) {
        toast.error("Bạn chỉ có thể tải lên 1 file");
        return;
      }

      if (fileTooLarge) {
        toast.error("File quá lớn, vui lòng tải lên file nhỏ hơn 5MB");
        return;
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-300 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center h-full w-full p-4">
        <input type="file" {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
};

export default Uploader;
