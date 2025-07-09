"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();

  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  const [email, setEmail] = useState("");

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onError: (error) => {
            console.error("Đăng nhập thất bại:", { error });
            toast.error(
              `Đăng nhập thất bại: ${
                error?.error.message || "Lỗi không xác định"
              }`
            );
          },
        },
      });
    });
  }

  async function signInWithEmail() {
    startEmailTransition(async () => {
      if (!email) {
        toast.error("Vui lòng nhập email của bạn.");
        return;
      }
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Đã gửi mã xác minh đến email của bạn. Vui lòng kiểm tra hộp thư đến."
            );
            router.push(`/verify-request?email=${encodeURIComponent(email)}`);
          },
          onError: (error) => {
            console.error("Gửi mã thất bại:", { error });
            toast.error(
              `Gửi mã thất bại: ${error?.error.message || "Lỗi không xác định"}`
            );
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập tài khoản của bạn</CardTitle>
        <CardDescription>
          Đăng nhập bằng tài khoản Github hoặc Google của bạn để tiếp tục.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full mb-2 cursor-pointer"
          variant="outline"
          disabled={githubPending}
          onClick={signInWithGithub}
        >
          {githubPending ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <>
              <GithubIcon className="size-4" />
              Đăng nhập với Github
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Hoặc tiếp tục với
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>

          <Button onClick={signInWithEmail} disabled={emailPending}>
            {emailPending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <>
                <Mail className="size-4" />
                <span>Gửi mã xác minh</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
