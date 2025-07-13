import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface FeatureProps {
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    title: "Học tập linh hoạt",
    description:
      "Truy cập các khóa học mọi lúc, mọi nơi với hệ thống quản lý học tập hiện đại.",
  },
  {
    title: "Nội dung chất lượng cao",
    description:
      "Khám phá các khóa học được thiết kế bởi các chuyên gia hàng đầu trong ngành.",
  },
  {
    title: "Giao diện thân thiện",
    description:
      "Trải nghiệm giao diện người dùng trực quan, dễ sử dụng và tương tác.",
  },
  {
    title: "Tương tác và Hỗ trợ",
    description:
      "Tham gia cộng đồng học tập, đặt câu hỏi và nhận hỗ trợ từ giảng viên.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Badge variant={"outline"}>HafoLMS - Học code thật dễ dàng</Badge>

          <h1 className="text-xl md:text-6xl text-center font-bold tracking-tight">
            Nâng cao Trải nghiệm Học tập của bạn
          </h1>

          <p className="max-w-[700px] text-muted-foreground md:text-xl text-center">
            Khám phá cách học tập mới với hệ thống quản lý học tập hiện đại và
            tương tác. Truy cập các khóa học chất lượng cao mọi lúc, mọi nơi
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href={"/courses"} className={buttonVariants({ size: "lg" })}>
              Khám phá Khóa học
            </Link>
            <Link
              href={"/login"}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-">
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
