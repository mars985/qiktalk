import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/createUser",
        { email, password, username },
        { withCredentials: true }
      );
      if (response.data.success === true) navigate("/");
      else throw "Server failure";
    } catch (err) {
      console.error("Signin failed:", err);
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              />

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
              />
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
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-content">
              Sign up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
