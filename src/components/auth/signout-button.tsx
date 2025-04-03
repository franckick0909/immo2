"use client";

import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { toast } from "sonner";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="default"
      className="w-full"
      onClick={async () => {
        await signOut();
        toast.success("Déconnexion réussie");
        router.push("/");
      }}
    >
      <MdLogout className="h-5 w-5 mr-2" />
      <span>Se déconnecter</span>
    </Button>
  );
}
