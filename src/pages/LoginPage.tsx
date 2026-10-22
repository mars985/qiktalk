import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { z } from "zod";

import { UserRequest } from "@/api/user.api";
import {
  loginSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/validators/user.validator";

type LoginFields = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginFields>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(toFieldErrors(result.error.issues));
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const response = await UserRequest.login(result.data);

      if (response.data.success === true) navigate("/");
      else throw "Server failure";
    } catch (err) {
      const serverFieldErrors = axios.isAxiosError(err)
        ? toFieldErrors<LoginFields>(err.response?.data?.errors ?? [])
        : {};
      setFieldErrors(serverFieldErrors);

      if (Object.keys(serverFieldErrors).length === 0) {
        setError(
          (axios.isAxiosError(err) && err.response?.data?.message) ||
            "Couldn't log in. Try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction onClick={() => (window.location.href = "/signup")}>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="text-xs text-error">{fieldErrors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
              />
              {fieldErrors.password && (
                <p className="text-xs text-error">{fieldErrors.password}</p>
              )}
            </div>

            {error && <p className="text-xs text-error">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
