"use client";

import Link from "next/link";
import { ArrowLeft, PlusCircle, PlusIcon, Sparkles } from "lucide-react";
import {
  CourseCategory,
  CourseLevel,
  courseSchema,
  CourseSchemaType,
  CourseStatus,
} from "@/lib/zod-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@/components/rich-text-editor/editor";
import Uploader from "@/components/file-uploader/uploader";

const CoursesCreatePage = () => {
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      category: "Khác",
      slug: "",
      smallDescription: "",
      price: 0,
      duration: 0,
      level: "Cơ bản",
      status: "Bản nháp",
    },
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
  };

  const onSubmit = (values: CourseSchemaType) => {
    console.log("Submitted values:", values);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>
        <h1 className="text-2xl font-bold">Tạo khóa học</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
          <CardDescription>
            cung cấp thông tin cơ bản về khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề khóa học</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề khóa học" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả khóa học</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mô tả khóa học" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug khóa học</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập slug cho khóa học"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="secondary"
                  className="w-fit"
                  onClick={generateSlug}
                >
                  Tạo Slug tự động
                  <Sparkles className="ml-1 size-4" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      {/* <Textarea
                        className="field-sizing-content max-h-29.5 min-h-0 resize-none"
                        placeholder="Tóm tắt ngắn gọn về khóa học"
                        {...field}
                      /> */}
                      <Editor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả chi tiết</FormLabel>
                    <FormControl>
                      <Textarea
                        className="field-sizing-content max-h-29.5 min-h-0 resize-none"
                        placeholder="Chi tiết nội dung khóa học, đối tượng học, yêu cầu đầu vào..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ảnh mô tả</FormLabel>
                    <FormControl>
                      <Uploader
                        onUploadComplete={(data) => {
                          field.onChange(data?.url || "");
                          toast.success("Upload ảnh thành công!");
                        }}
                        onUploadError={(error) => {
                          toast.error(`Lỗi upload: ${error}`);
                        }}
                        onFileRemove={() => {
                          field.onChange("");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thể loại</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn thể loại" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CourseCategory.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category || "Khác"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cấp độ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn cấp độ cho khóa học" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CourseLevel.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level || "Khác"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời lượng khóa học (Giờ học)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập lượng khoảng thời gian (giờ) cho khóa học"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá khóa học (VND)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập giá khóa học (VND)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái khóa học</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn trạng thái khóa học" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CourseStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status || "Bản nháp"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="flex items-center  ">
                <span>Tạo khóa học</span>
                <PlusCircle className="ml-1 size-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default CoursesCreatePage;
