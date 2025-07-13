import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const AdminCoursesPage = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Khóa học của bạn</h1>

        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Tạo khóa học mới
        </Link>
      </div>
    </>
  );
};

export default AdminCoursesPage;
