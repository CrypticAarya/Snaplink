import { useEffect, useMemo } from "react";
import DeviceStats from "@/features/analytics/components/DeviceStats";
import LocationStats from "@/features/analytics/components/LocationStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/common/StatCard";
import { useAuth } from "@/features/auth/context";
import { getClicksForUrl } from "@/services/api/clicks";
import { deleteUrl, getUrl } from "@/services/api/urls";
import useFetch from "@/hooks/use-fetch";
import { summarizeClicks } from "@/features/analytics/utils/summarize";
import { ACCENT_HEX } from "@/constants/theme";
import {
  BarChart3,
  Copy,
  Download,
  Globe,
  LinkIcon,
  MapPin,
  Monitor,
  MousePointerClick,
  Trash,
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

const LinkDetailPage = () => {
  const downloadImage = () => {
    const anchor = document.createElement("a");
    anchor.href = url?.qr;
    anchor.download = url?.title;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const { loading, data: url, fn, error } = useFetch(getUrl, {
    id,
    user_id: user?.id,
  });
  const { loading: loadingStats, data: stats, fn: fnStats } =
    useFetch(getClicksForUrl, id);
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

  const link = url?.custom_url ? url.custom_url : url?.short_url;
  const summary = useMemo(() => summarizeClicks(stats ?? []), [stats]);

  return (
    <div className="page-container flex flex-col gap-5 sm:gap-6">
      {(loading || loadingStats) && (
        <BarLoader width="100%" color={ACCENT_HEX} />
      )}

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          Link details
        </p>
        <h1 className="page-title truncate">{url?.title ?? "…"}</h1>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:gap-7">
        <div className="flex flex-col gap-5 lg:w-[min(100%,380px)] shrink-0">
          <div className="surface-card p-4 sm:p-5 space-y-4">
            <a
              href={`/${link}`}
              target="_blank"
              rel="noreferrer"
              className="block text-lg sm:text-xl font-semibold text-primary hover:underline break-all"
            >
              {window.location.host}/{link}
            </a>
            <a
              href={url?.original_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LinkIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="break-all">{url?.original_url}</span>
            </a>
            <p className="text-xs text-muted-foreground">
              Created {url?.created_at ? new Date(url.created_at).toLocaleString() : "—"}
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[40px] min-w-[40px] rounded-lg ring-1 ring-border/60 hover:bg-primary/10 hover:text-primary sm:h-9 sm:w-9"
                onClick={() =>
                  navigator.clipboard.writeText(`${window.location.origin}/${link}`)
                }
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[40px] min-w-[40px] rounded-lg ring-1 ring-border/60 hover:bg-primary/10 hover:text-primary sm:h-9 sm:w-9"
                onClick={downloadImage}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 min-h-[40px] min-w-[40px] rounded-lg ring-1 ring-border/60 hover:bg-red-500/10 hover:text-red-400 sm:h-9 sm:w-9"
                onClick={() => fnDelete().then(() => navigate("/dashboard"))}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <BeatLoader size={5} color="currentColor" />
                ) : (
                  <Trash className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          {url?.qr && (
            <img
              src={url.qr}
              alt="QR code"
              className="w-full max-w-[280px] mx-auto lg:mx-0 rounded-xl ring-1 ring-border/60 p-3 bg-muted/20 object-contain"
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
          <h2 className="text-base font-semibold sm:text-lg">Analytics</h2>

          {stats?.length ? (
            <>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <StatCard
                  label="Total clicks"
                  value={summary.total}
                  icon={MousePointerClick}
                />
                <StatCard
                  label="Top device"
                  value={summary.topDevice ?? "—"}
                  hint={
                    summary.topDeviceCount
                      ? `${summary.topDeviceCount} clicks`
                      : undefined
                  }
                  icon={Monitor}
                />
                <StatCard
                  label="Top city"
                  value={summary.topCity ?? "—"}
                  hint={
                    summary.topCityCount
                      ? `${summary.topCityCount} clicks`
                      : undefined
                  }
                  icon={MapPin}
                />
                <StatCard
                  label="Countries"
                  value={summary.countries}
                  icon={Globe}
                />
              </div>

              <Card className="surface-card border-none shadow-none">
                <CardHeader className="px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
                  <CardTitle className="text-sm font-semibold sm:text-base">
                    By location
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-4 pt-0 sm:px-4 sm:pb-5">
                  <LocationStats stats={stats} />
                </CardContent>
              </Card>

              <Card className="surface-card border-none shadow-none">
                <CardHeader className="px-4 pb-1 pt-4 sm:px-5 sm:pt-5">
                  <CardTitle className="text-sm font-semibold sm:text-base">
                    By device
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-4 pt-0 sm:px-4 sm:pb-5">
                  <DeviceStats stats={stats} />
                </CardContent>
              </Card>
            </>
          ) : loadingStats ? (
            <EmptyState
              icon={BarChart3}
              title="Pulling in your stats"
              description="We're loading click data for this link. This usually takes just a moment."
            />
          ) : (
            <EmptyState
              icon={MousePointerClick}
              title="No clicks yet"
              description="Share your SnapLink to start seeing visits, devices, and locations here."
              ctaLabel="Copy short link"
              ctaIcon={Copy}
              ctaOnClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/${link}`
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkDetailPage;
