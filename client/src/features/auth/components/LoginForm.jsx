import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Error from "@/components/common/ErrorMessage";
import { login, loginWithOAuth } from "@/services/api/auth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@/features/auth/context";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);
  const { fetchUser } = useAuth();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }

  }, [error, data]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="space-y-2 px-5 pb-3 pt-6 sm:space-y-1.5 sm:p-6">
        <CardTitle className="text-xl font-bold gradient-text sm:text-2xl">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your short links.
        </CardDescription>
        {error && (
          <div className="pt-1">
            <Error message={error.message} />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-5 px-5 pb-2 sm:space-y-4 sm:px-6">
        <div className="space-y-2.5">
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            className="bg-muted/40 border-border/60 text-foreground focus-visible:border-primary/40"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-2.5">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            className="bg-muted/40 border-border/60 text-foreground focus-visible:border-primary/40"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-5 px-5 pb-6 pt-2 sm:gap-4 sm:px-6 sm:pb-6">
        <Button
          onClick={handleLogin}
          className="w-full min-h-11 rounded-lg font-semibold"
        >
          {loading ? <BeatLoader size={10} color="#fafafa" /> : "Log in to SnapLink"}
        </Button>

        <div className="flex w-full items-center gap-2">
            <span className="h-px flex-1 bg-border/80" />
            <span className="text-sm text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border/80" />
        </div>

        <Button
          onClick={() => loginWithOAuth("google")}
          variant="outline"
          className="w-full min-h-11 rounded-lg font-semibold"
        >
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
