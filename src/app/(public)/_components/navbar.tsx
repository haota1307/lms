"use client";
import Link from "next/link";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";

import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "@/app/(public)/_components/user-dropdown";

interface NavigationItem {
  name: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { name: "Trang chủ", href: "/" },
  { name: "Khóa học", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const { isPending, data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm ">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center space-x-2 mr-4">
          <Image src={"/logo.svg"} alt="Logo" width={40} height={40} />
          <span>HafoLMS.</span>
        </Link>

        {/* Desktop navigation*/}
        <nav className="hidden md:flex md:flex-1 md:justify-between md:items-center">
          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                className="text-sm font-medium transition-colors hover:text-primary space-x-2"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4">
            <ModeToggle />

            {isPending ? null : session ? (
              <UserDropdown
                email={session.user.email}
                image={session.user.image || ""}
                name={session.user.name}
              />
            ) : (
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "outline" })}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
