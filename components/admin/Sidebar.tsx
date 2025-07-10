/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,

  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminSideBarLinks } from "@/constants";
// import { signOutUser } from '@/lib/actions/auth';
import { signOut } from "next-auth/react"
import { cn, getInitials } from "@/lib/utils";
import {

  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";

interface Props {
  session: Session | null,
}

const Sidebar = ({ session }: Props) => {
  // const handleSignOut = async () => {
  //   await signOutUser();
  // };
  const pathname = usePathname();

  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1>BookWise</h1>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "link",
                    isSelected && "bg-primary-admin shadow-sm",
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${isSelected ? "brightness-0 invert" : ""}  object-contain`}
                    />
                  </div>

                  <p className={cn(isSelected ? "text-white" : "text-dark")}>
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>

          <div className="user">
            <Avatar>
              <AvatarImage src='/images/shadcn.jpg' alt={`avatar ${session?.user?.name}`} />
              <AvatarFallback className="bg-amber-100">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col max-md:hidden">
              <p className="font-semibold text-dark-200">{session?.user?.name}</p>
              <p className="text-xs text-light-500">{session?.user?.email}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={"right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src='/images/shadcn.jpg' alt={`avatar ${session?.user?.name}`} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(session?.user?.name || "IN")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{session?.user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <Link href='/my-profile'>
              <DropdownMenuItem>
                <IconUserCircle />
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              <IconNotification />
              Notifications
            </DropdownMenuItem>

          </DropdownMenuGroup>
          {session?.user.role === "ADMIN" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Tables
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <Link href='/admin'>
                        <DropdownMenuItem>Admin</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link href='/admin/users'>
                        <DropdownMenuItem>Users</DropdownMenuItem>
                      </Link>
                      <Link href='/admin/books'>
                        <DropdownMenuItem>Books</DropdownMenuItem>
                      </Link>


                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

              </DropdownMenuGroup>
            </>
          )}


          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <IconLogout />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
};

export default Sidebar;
