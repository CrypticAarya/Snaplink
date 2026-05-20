import DeviceStats from "@/features/analytics/components/DeviceStats";
import Location from "@/features/analytics/components/LocationStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/context";
import { getClicksForUrl } from "@/services/api/clicks";
import { deleteUrl, getUrl } from "@/services/api/urls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const LinkPage = () => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;


    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;


    document.body.appendChild(anchor);


    anchor.click();


    document.body.removeChild(anchor);
  };
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <div className="pt-32 pb-20 px-6 sm:px-10">
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-2xl sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl text-zinc-300 font-bold hover:underline cursor-pointer"
          >
            {window.location.host}/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer text-muted-foreground w-full sm:max-w-xl"
          >
            <LinkIcon className="p-1 shrink-0 w-6 h-6" />
            <span className="truncate">{url?.original_url}</span>
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-xl hover:bg-primary/15 hover:text-primary transition-all duration-200 ease-out ring-1 ring-border/60 hover:ring-primary/40"
              onClick={() =>
                navigator.clipboard.writeText(`${window.location.origin}/${link}`)
              }
            >
              <Copy className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="h-10 w-10 p-0 rounded-xl hover:bg-primary/15 hover:text-primary transition-all duration-200 ease-out ring-1 ring-border/60 hover:ring-primary/40"
              onClick={downloadImage}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className="h-10 w-10 p-0 rounded-xl hover:bg-red-500/15 hover:text-red-400 transition-all duration-200 ease-out ring-1 ring-border/60 hover:ring-red-500/35"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="currentColor" />
              ) : (
                <Trash className="w-5 h-5" />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start rounded-2xl ring-1 ring-border/50 p-2 object-contain bg-muted/20"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5 glow-card">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold gradient-text-hero">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LinkPage;
