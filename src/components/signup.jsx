import { useEffect, useState } from "react";
import Error from "./error";
import Success from "./success";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup, loginWithOAuth } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { useAuth } from "@/context";

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);
  const { fetchUser } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (error === null && data) {
      setShowSuccess(true);
      fetchUser();
      setTimeout(() => {
        navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      }, 2000);
    }
  }, [error, data]);

  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text">Create Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Join SnapLink to start managing your links with ease.
        </CardDescription>
        {error && <Error message={error?.message} />}
        {showSuccess && <Success message="Signup Successful! Redirecting..." />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            name="name"
            type="text"
            placeholder="Full Name"
            className="bg-muted/40 border-border/60 text-foreground focus-visible:border-primary/40"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Profile Picture</label>
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            className="bg-muted/40 border-border/60 cursor-pointer text-foreground file:bg-primary file:border-0 file:text-primary-foreground file:rounded-lg file:px-3 file:py-1.5 file:mr-4 file:font-medium file:hover:bg-primary/90"
            onChange={handleInputChange}
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button
          onClick={handleSignup}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 ease-out"
        >
          {loading ? (
            <BeatLoader size={10} color="#fafafa" />
          ) : (
            "Create SnapLink Account"
          )}
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

export default Signup;
