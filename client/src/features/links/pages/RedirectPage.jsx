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
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6">
        <span className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          SnapLink
        </span>
        <BarLoader width={200} color="#c41e3a" />
        <p className="mt-8 text-sm text-muted-foreground tracking-wide">
          Taking you to your destination…
        </p>
      </div>
    );
  }

  return null;
};

export default RedirectLink;
