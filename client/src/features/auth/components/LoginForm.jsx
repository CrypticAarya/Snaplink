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
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your short links.
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            className="bg-muted/40 border-border/60 text-foreground focus-visible:border-primary/40"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-2">
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
      <CardFooter className="flex-col gap-4">
        <Button
          onClick={handleLogin}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 ease-out"
        >
          {loading ? <BeatLoader size={10} color="#fafafa" /> : "Login to SnapLink"}
        </Button>

        <div className="flex w-full items-center gap-2">
            <span className="h-px flex-1 bg-border/80" />
            <span className="text-sm text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border/80" />
        </div>

        <Button
          onClick={() => loginWithOAuth("google")}
          variant="outline"
          className="w-full border-border/80 bg-white/[0.04] py-6 rounded-xl font-semibold hover:bg-white/[0.08] transition-all duration-200 ease-out"
        >
          Continue with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
