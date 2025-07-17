/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import {
  // IconCreditCard,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';
import { Bot } from 'lucide-react';
import { signOutUser } from '@/lib/actions/auth';
import config from '@/lib/config';
import Link from 'next/link';
interface Props {
  name: string | null | undefined;
  email: string | null | undefined;
  avatar: string | null | undefined;
  role: string | null | undefined;
}
const UserMenu = ({ name, email, role, avatar }: Props) => {
  const handleSignOut = async () => {
    await signOutUser();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={`${config.env.imagekit.urlEndpoint}/${avatar}`} alt={`avatar ${name}`} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent // eslint-disable-next-line tailwindcss/no-custom-classname
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={`${config.env.imagekit.urlEndpoint}/${avatar}`} alt={`avatar ${name}`} />
              <AvatarFallback className="rounded-lg">{getInitials(name ?? 'IN')}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href="/my-profile">
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
        {role === 'ADMIN' && (
          <React.Fragment>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Bot />
                  <span className="ml-2">Tables</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <Link href="/admin">
                      <DropdownMenuItem>Admin</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href="/admin/users">
                      <DropdownMenuItem>Users</DropdownMenuItem>
                    </Link>
                    <Link href="/admin/books">
                      <DropdownMenuItem>Books</DropdownMenuItem>
                    </Link>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </React.Fragment>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
