import VerifyForm from "@/app/(auth)/verify-request/_components/verify-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const verifyRequestPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <VerifyForm />;
};

export default verifyRequestPage;
