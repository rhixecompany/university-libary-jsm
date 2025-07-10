/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'

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
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { signOut } from "next-auth/react"
import {
    // IconCreditCard,

    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react";
import { getInitials } from '@/lib/utils';
import Link from "next/link";
import { Bot } from "lucide-react"
interface Props {
    name: string | null | undefined,
    email: string | null | undefined,
    role: string | null | undefined,
}
const UserMenu = ({ name, email, role }: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Avatar className="size-8 rounded-lg">
                        <AvatarImage src='/images/shadcn.jpg' alt={`avatar ${name}`} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>

                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent // eslint-disable-next-line tailwindcss/no-custom-classname
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"

                side={"bottom"}
                align="end"
                sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarImage src='/images/shadcn.jpg' alt={`avatar ${name}`} />
                            <AvatarFallback className="rounded-lg">
                                {getInitials(name ?? "IN")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{name}</span>
                            <span className="truncate text-xs text-muted-foreground">
                                {email}
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
                {role === "ADMIN" && (
                    <React.Fragment>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Bot />
                                    <span className='ml-2'>Tables</span>
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
                    </React.Fragment>
                )}


                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <IconLogout />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu
