"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Sign in with Google
          </Button>
        </div>
      </form>
    </div>
  );
}