"use client"


import Link from 'next/link'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {

    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { signOutUser } from '@/lib/actions/auth';
import { getInitials } from '@/lib/utils'
export function NavUser({
    user,
}: {
    user: {
        name: string | null
        email: string | null
        avatar: string | null
    }
}) {
    async function handleLogout() {

        await toast.info(`You have successfully signed out.`)
        return await signOutUser()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="user">
                    <Avatar>
                        <AvatarFallback className="bg-amber-100">
                            {getInitials(user?.name || 'IN')}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={'bottom'} align="end" sideOffset={4}>

                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="size-8 rounded-lg">

                            <AvatarFallback className="rounded-lg">{getInitials(user?.name ?? 'IN')}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user?.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href='/my-profile'>
                            <IconUserCircle />
                            Profile
                        </Link>

                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <IconNotification />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <IconLogout />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
