import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
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
  registerSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/validators/user.validator";

type RegisterFields = z.infer<typeof registerSchema>;

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterFields>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = registerSchema.safeParse({ username, email, password });
    if (!result.success) {
      setFieldErrors(toFieldErrors(result.error.issues));
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const response = await UserRequest.register(result.data);
      if (response.data.success === true) navigate("/");
      else throw "Server failure";
    } catch (err) {
      const serverFieldErrors = axios.isAxiosError(err)
        ? toFieldErrors<RegisterFields>(err.response?.data?.errors ?? [])
        : {};
      setFieldErrors(serverFieldErrors);

      if (Object.keys(serverFieldErrors).length === 0) {
        setError(
          (axios.isAxiosError(err) && err.response?.data?.message) ||
            "Couldn't sign up. Try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <Card className="w-full max-w-sm shadow-lg bg-base-100">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-base-content">
            Create your account
          </CardTitle>
          <CardAction onClick={() => (window.location.href = "/login")}>
            <Button variant="link" className="text-primary">
              Log in
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-base-content">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="abhi-del"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-base-200 text-base-content"
                aria-invalid={!!fieldErrors.username}
              />
              {fieldErrors.username && (
                <p className="text-xs text-error">{fieldErrors.username}</p>
              )}

              <Label htmlFor="email" className="text-base-content">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-base-200 text-base-content"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="text-xs text-error">{fieldErrors.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-base-content">
                  Password
                </Label>
                <a
                  href="#"
                  className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
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
                className="bg-base-200 text-base-content"
                aria-invalid={!!fieldErrors.password}
              />
              {fieldErrors.password && (
                <p className="text-xs text-error">{fieldErrors.password}</p>
              )}
            </div>

            {error && <p className="text-xs text-error">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-content"
              disabled={submitting}
            >
              {submitting ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
