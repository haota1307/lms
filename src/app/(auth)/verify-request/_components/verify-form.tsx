"use client";

import { useState, useTransition } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const VerifyForm = () => {
  const router = useRouter();

  const param = useSearchParams();
  const email = param.get("email") || "";

  const [otpPending, startOtpTransition] = useTransition();
  const [otp, setOtp] = useState("");

  const isOtpValid = otp.length === 6;

  function verifyOtp() {
    startOtpTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
          onError: (error) => {
            console.error("Xác minh OTP thất bại:", { error });
            toast.error(
              `Xác minh OTP thất bại: ${
                error?.error.message === "Invalid OTP"
                  ? "Mã OTP không hợp lệ"
                  : "Lỗi không xác định"
              }`
            );
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Kiểm tra email của bạn</CardTitle>
        <CardDescription>
          Chúng tôi đã gửi một liên kết xác minh đến email của bạn. Vui lòng
          kiểm tra hộp thư đến và làm theo hướng dẫn để hoàn tất quá trình đăng
          nhập.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center items-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(value) => setOtp(value)}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="text-center text-sm mt-4 text-muted-foreground">
          {otp === "" ? (
            <p className="text-muted-foreground"> Vui lòng nhập mã xác minh</p>
          ) : (
            <>Mã bạn nhập là: {otp}</>
          )}
        </div>

        <Button
          onClick={verifyOtp}
          disabled={otpPending || !isOtpValid}
          className="w-full mt-4"
        >
          {otpPending ? <Loader className="size-4 animate-spin" /> : "Xác nhận"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerifyForm;
