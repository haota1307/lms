"use client";

import {
  RenderEmptyState,
  RenderErrorState,
} from "@/components/file-uploader/render-state";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { CheckCircle2, X, Upload, RefreshCw } from "lucide-react";

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
  uploadedData?: {
    publicId: string;
    url: string;
    format: string;
    size: number;
    width?: number;
    height?: number;
  };
}

interface UploaderProps {
  onUploadComplete?: (data: UploaderState["uploadedData"]) => void;
  onUploadError?: (error: string) => void;
  onFileRemove?: () => void;
}

const Uploader = ({
  onUploadComplete,
  onUploadError,
  onFileRemove,
}: UploaderProps) => {
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Không thể đọc file"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
        error: false,
      }));

      try {
        // Chuyển file thành base64
        const fileBase64 = await convertFileToBase64(file);

        // Tạo payload để gửi lên API
        const payload = {
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: file.type.startsWith("image/"),
          fileData: fileBase64,
        };

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFileState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }));
        }, 200);

        // Gửi request lên API
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Lỗi khi upload file");
        }

        const result = await response.json();

        if (result.success) {
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 100,
            error: false,
            uploadedData: result.data,
          }));

          toast.success("Upload file thành công!");
          onUploadComplete?.(result.data);
        } else {
          throw new Error(result.error || "Upload thất bại");
        }
      } catch (error) {
        console.error("Upload error:", error);
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        const errorMessage =
          error instanceof Error ? error.message : "Lỗi không xác định";
        toast.error(errorMessage);
        onUploadError?.(errorMessage);
      }
    },
    [onUploadComplete, onUploadError]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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

        // Tự động upload ngay khi chọn file
        setTimeout(() => {
          uploadFile(file);
        }, 100);
      }
    },
    [uploadFile]
  );

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

  const handleUpload = () => {
    if (fileState.file) {
      uploadFile(fileState.file);
    }
  };

  const handleRemove = async () => {
    // Nếu có file đã upload thành công, xóa từ Cloudinary
    if (fileState.uploadedData?.publicId) {
      setFileState((prev) => ({ ...prev, isDeleting: true }));

      try {
        const response = await fetch("/api/cloudinary/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicId: fileState.uploadedData.publicId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Lỗi khi xóa file");
        }

        toast.success("Xóa file thành công!");
      } catch (error) {
        console.error("Delete error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Lỗi không xác định";
        toast.error(`Lỗi khi xóa file: ${errorMessage}`);

        // Nếu xóa thất bại, không reset state
        setFileState((prev) => ({ ...prev, isDeleting: false }));
        return;
      }
    }

    // Cleanup local state
    if (fileState.objectUrl) {
      URL.revokeObjectURL(fileState.objectUrl);
    }

    setFileState({
      id: null,
      file: null,
      uploading: false,
      progress: 0,
      key: undefined,
      isDeleting: false,
      error: false,
      fileType: "image",
    });

    onFileRemove?.();
  };

  const handleRetry = () => {
    if (fileState.file) {
      uploadFile(fileState.file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: fileState.uploading,
  });

  const renderContent = () => {
    // Hiển thị lỗi
    if (fileState.error) {
      return (
        <div className="text-center">
          <RenderErrorState />
          <div className="mt-4 space-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              variant="outline"
              size="sm"
              type="button"
            >
              <RefreshCw className="size-4 mr-2" />
              Thử lại
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  <X className="size-4 mr-2" />
                  Xóa
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa file</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa file "{fileState.file?.name}"
                    không?
                    {fileState.uploadedData
                      ? " Hành động này sẽ xóa file khỏi Cloudinary và không thể hoàn tác."
                      : " File sẽ bị xóa khỏi danh sách."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }

    // Hiển thị khi đang upload
    if (fileState.uploading) {
      return (
        <div className="text-center space-y-4">
          <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-primary/10 mb-4">
            <Upload className="size-6 text-primary animate-pulse" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground mb-2">
              Đang tải lên...
            </p>
            <Progress value={fileState.progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">
              {fileState.progress}% hoàn thành
            </p>
          </div>
        </div>
      );
    }

    // Hiển thị khi upload thành công
    if (fileState.uploadedData) {
      return (
        <div className="text-center space-y-4">
          <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="size-6 text-green-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              Upload thành công!
            </p>
            <p className="text-sm text-muted-foreground">
              {fileState.file?.name} -{" "}
              {Math.round((fileState.uploadedData.size / 1024 / 1024) * 100) /
                100}{" "}
              MB
            </p>
          </div>
          {fileState.objectUrl && (
            <div className="mt-4">
              <img
                src={fileState.objectUrl}
                alt="Preview"
                className="max-w-full max-h-32 mx-auto rounded-lg border"
              />
            </div>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant="outline"
                size="sm"
                type="button"
                disabled={fileState.isDeleting}
              >
                {fileState.isDeleting ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <X className="size-4 mr-2" />
                    Xóa
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa file</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa file "{fileState.file?.name}" không?
                  Hành động này sẽ xóa file khỏi Cloudinary và không thể hoàn
                  tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    }

    // Hiển thị khi đã chọn file nhưng chưa upload (sẽ tự động upload)
    if (
      fileState.file &&
      !fileState.uploading &&
      !fileState.uploadedData &&
      !fileState.error
    ) {
      return (
        <div className="text-center space-y-4">
          <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-blue-100 mb-4">
            <Upload className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              Chuẩn bị upload...
            </p>
            <p className="text-sm text-muted-foreground">
              {fileState.file.name} -{" "}
              {Math.round((fileState.file.size / 1024 / 1024) * 100) / 100} MB
            </p>
          </div>
          {fileState.objectUrl && (
            <div className="mt-4">
              <img
                src={fileState.objectUrl}
                alt="Preview"
                className="max-w-full max-h-32 mx-auto rounded-lg border"
              />
            </div>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            variant="outline"
            size="sm"
            type="button"
          >
            <X className="size-4 mr-2" />
            Hủy
          </Button>
        </div>
      );
    }

    // Hiển thị trạng thái mặc định
    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-300 ease-in-out w-full min-h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
        fileState.uploading && "pointer-events-none opacity-75"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center h-full w-full p-4">
        <input type="file" {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;
