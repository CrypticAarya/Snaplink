import Login from "@/features/auth/components/LoginForm";
import Signup from "@/features/auth/components/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Auth() {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="page-container flex w-full max-w-md flex-col items-center gap-8 pb-12 sm:gap-8 sm:pb-14">
      <div className="w-full space-y-3 text-center sm:space-y-2.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {searchParams.get("createNew")
            ? "Sign in to shorten your link"
            : "Join SnapLink"}
        </h1>
        <p className="text-sm leading-relaxed text-[hsl(0_0%_68%)] sm:text-[0.9375rem]">
          {searchParams.get("createNew")
            ? "Create an account or log in to continue."
            : "Start shortening and tracking links in seconds."}
        </p>
      </div>

      <Tabs
        defaultValue="login"
        className="flex w-full max-w-[400px] flex-col gap-5 sm:gap-4"
      >
        <TabsList className="grid h-11 w-full grid-cols-2 sm:h-10">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-0">
          <Login />
        </TabsContent>
        <TabsContent value="signup" className="mt-0">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;
