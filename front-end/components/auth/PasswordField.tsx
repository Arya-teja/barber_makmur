"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

type PasswordFieldProps = {
  errorMessage?: string;
};

export function PasswordField({ errorMessage }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-1.5">
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="********"
          className="pl-10 pr-10"
          required
          aria-invalid={Boolean(errorMessage)}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label={
            showPassword ? "Sembunyikan password" : "Tampilkan password"
          }
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
      {errorMessage ? (
        <p className="text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
