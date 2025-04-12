"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdHelp, MdPerson, MdSettings } from "react-icons/md";
import { toast } from "sonner";
import AvatarImg from "../avatarImg";
import { useUserStore } from "@/lib/store";
import { navLinks } from "@/app/datas/datas";

export default function Header() {
  const { user, setUser } = useUserStore();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session?.user, setUser]);

  return (
    <header className="sticky top-0 mx-auto w-full border-b backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-primary text-primary-foreground px-3 py-1 rounded-md">
                LOGO
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.id} href={link.href} onClick={(e) => e.preventDefault()} className="text-sm font-medium">
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
                  >
                    <AvatarImg />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 mt-2"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-primary/10"
                      >
                        <MdPerson className="h-4 w-4" />
                        <span>Mon profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-primary/10"
                      >
                        <MdSettings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/"
                        className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-primary/10"
                      >
                        <MdHelp className="h-4 w-4" />
                        <span>Aide</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={async () => {
                        await signOut();
                        toast.success("Déconnexion réussie");
                        router.push("/");
                      }}
                    >
                      <span>Se déconnecter</span>
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "font-medium"
                )}
                href="/signin"
              >
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}