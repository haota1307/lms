import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Rently <no-reply@rently.top>",
          to: [email],
          subject: "HAFO LMS - Xác thực Email",
          html: `<p>Xin chào,</p>
                 <p>Mã xác thực của bạn là: <strong>${otp}</strong></p>
                 <p>Vui lòng nhập mã này để xác thực email của bạn.</p>
                 <p>Trân trọng,</p>
                 <p>HAFO LMS</p>`,
        });
      },
    }),
  ],
});
