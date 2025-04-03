"use client";

import { useSession } from "@/lib/auth-client";
import { useUserStore } from "@/lib/store";
import Image from "next/image";
import { useEffect } from "react";

export default function AvatarImg() {
  const { data: session } = useSession();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session?.user, setUser]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-amber-300">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || ""}
          width={40}
          height={40}
          className="w-full h-full object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-xl text-primary-foreground">
            {user.name?.charAt(0).toUpperCase() ||
              user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
