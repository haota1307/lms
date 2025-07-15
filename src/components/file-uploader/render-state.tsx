import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CloudUploadIcon,
  ImagesIcon,
  RefreshCcwIcon,
  UploadIcon,
} from "lucide-react";

export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean;
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Kéo thả file vào đây hoặc{" "}
        <span className="text-primary cursor-pointer">nhấn để tải lên</span>
      </p>
      <p className="text-sm text-muted-foreground">
        Định dạng file: PNG, JPG, JPEG, GIF, SVG. Tối đa 5MB
      </p>
      <Button variant="secondary" type="button" className="w-full mt-4">
        <UploadIcon className="size-4 mr-2" />
        Tải lên
      </Button>
    </div>
  );
};

export const RenderErrorState = () => {
  return (
    <div className="text-destructive text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImagesIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold text-foreground">
        Đã có lỗi xảy ra khi tải lên file
      </p>
      <p className="text-sm text-muted-foreground">
        Vui lòng thử lại sau hoặc liên hệ hỗ trợ
      </p>

      <Button variant="secondary" type="button" className="w-full mt-4">
        <RefreshCcwIcon className="size-4 mr-2" />
        Thử lại
      </Button>
    </div>
  );
};
