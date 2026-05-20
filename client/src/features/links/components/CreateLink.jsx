import MagneticButton from "@/components/common/MagneticButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "@/components/common/ErrorMessage";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/services/api/urls";
import { BeatLoader } from "react-spinners";
import { useAuth } from "@/features/auth/context";
import { QRCode } from "react-qrcode-logo";

export function CreateLink() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }

  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <MagneticButton className="gradient-primary w-full min-h-11 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-105 sm:w-auto">
          Create new link
        </MagneticButton>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <QRCode ref={ref} size={250} value={formValues?.longUrl} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}
        <Input
          id="longUrl"
          placeholder="Paste your destination URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Card className="shrink-0 px-2.5 py-2 text-xs text-muted-foreground sm:text-sm">
            {window.location.host}
          </Card>
          <span className="hidden text-muted-foreground sm:inline">/</span>
          <Input
            id="customUrl"
            className="min-w-0 flex-1"
            placeholder="Custom slug (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && (
          <p className="text-sm text-muted-foreground rounded-lg border border-border/80 bg-muted/20 px-3 py-2">
            {error?.message?.includes("Error creating")
              ? "We couldn't create your link. Double-check the URL and try again."
              : "Something went wrong while creating your link. Please try again."}
          </p>
        )}
        <DialogFooter className="sm:justify-start">
          <MagneticButton
            onClick={createNewLink}
            disabled={loading}
            className="gradient-primary flex min-h-11 w-full items-center justify-center rounded-lg px-6 py-2.5 font-semibold text-primary-foreground transition-[filter] hover:brightness-105 disabled:opacity-50 sm:w-auto"
          >
            {loading ? <BeatLoader size={10} color="#fafafa" /> : "Create"}
          </MagneticButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
