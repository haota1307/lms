"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { data: session, isPending: sessionPending } = authClient.useSession();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }

  return (
    <div>
      {sessionPending ? (
        <Loader className="size-4 animate-spin" />
      ) : session ? (
        <div>
          <p>{session.user.name}</p>
          <Button onClick={signOut}>Đăng xuất</Button>
        </div>
      ) : (
        <Button>Đăng nhập</Button>
      )}
    </div>
  );
}
