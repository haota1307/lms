import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { ArrowLeftCircle, Braces } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4",
        })}
      >
        <ArrowLeftCircle className="mr-2 size-4" />
        Về trang chủ
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl">HAFO LMS</span>
        </Link>
        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          Khi ấn nút tiếp tục, đồng nghĩa rằng bạn đã đồng ý với{" "}
          <Link href={"/"} className="hover:text-primary hover:underline">
            điều khoản
          </Link>{" "}
          và{" "}
          <Link href={"/"} className="hover:text-primary hover:underline">
            điều kiện
          </Link>{" "}
          của chúng tôi.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
