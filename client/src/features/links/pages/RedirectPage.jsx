import { storeClicks } from "@/services/api/clicks";
import { getLongUrl } from "@/services/api/urls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }

  }, [loading]);

  if (loading || loadingStats) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 p-6">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-primary/15 blur-2xl rounded-full" />
          <span className="relative text-5xl font-black bg-gradient-to-br from-foreground via-foreground to-primary bg-clip-text text-transparent tracking-tighter">
            SnapLink
          </span>
        </div>
        <BarLoader width={200} color="#8b5cf6" />
        <p className="mt-8 text-muted-foreground font-medium animate-pulse tracking-wide">
          Navigating to your destination...
        </p>
      </div>
    );
  }

  return null;
};

export default RedirectLink;
