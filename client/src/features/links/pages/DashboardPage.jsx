import { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  AlertCircle,
  Filter,
  Globe,
  Link2,
  MousePointerClick,
  Search,
  TrendingUp,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { CreateLink } from "@/features/links/components/CreateLink";
import LinkCard from "@/features/links/components/LinkCard";
import { EmptyState } from "@/components/common/EmptyState";
import { StatCard } from "@/components/common/StatCard";
import { getFriendlyErrorMessage } from "@/utils/friendly-error";

import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/services/api/urls";
import { getClicksForUrls } from "@/services/api/clicks";
import { useAuth } from "@/features/auth/context";
import { ACCENT_HEX } from "@/constants/theme";
import { summarizeClicks } from "@/features/analytics/utils/summarize";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicksForUrls, urls?.map((url) => url.id));

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const summary = useMemo(() => summarizeClicks(clicks ?? []), [clicks]);
  const linkCount = urls?.length ?? 0;
  const clickCount = clicks?.length ?? 0;
  const avgClicks =
    linkCount > 0 ? (clickCount / linkCount).toFixed(1) : "0";

  return (
    <div className="page-container flex flex-col gap-5 sm:gap-7">
      {(loading || loadingClicks) && (
        <BarLoader width="100%" color={ACCENT_HEX} />
      )}

      <div className="page-header">
        <div className="min-w-0">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Manage short links and monitor performance at a glance.
          </p>
        </div>
        <div className="page-header-actions">
          <CreateLink />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Links"
          value={linkCount}
          hint="Active short URLs"
          icon={Link2}
        />
        <StatCard
          label="Total clicks"
          value={clickCount}
          hint="All-time engagements"
          icon={MousePointerClick}
        />
        <StatCard
          label="Avg per link"
          value={avgClicks}
          hint="Clicks divided by links"
          icon={TrendingUp}
        />
        <StatCard
          label="Reach"
          value={summary.countries}
          hint={
            summary.topCity
              ? `Top city: ${summary.topCity}`
              : "Countries detected"
          }
          icon={Globe}
        />
      </div>

      <div className="relative max-w-md">
        <Input
          type="text"
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {loading === false && error && !urls?.length && (
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load your links"
            description={getFriendlyErrorMessage(error?.message)}
            ctaLabel="Try again"
            ctaOnClick={() => fnUrls()}
          />
        )}
        {loading === false &&
          !error &&
          !filteredUrls?.length &&
          (urls?.length && searchQuery ? (
            <EmptyState
              icon={Search}
              title="No matching links"
              description={`Nothing matched "${searchQuery}". Try a different keyword or browse all links.`}
              ctaLabel="Clear search"
              ctaOnClick={() => setSearchQuery("")}
            />
          ) : (
            <EmptyState
              icon={Link2}
              title="No links yet"
              description="Create your first SnapLink to start tracking clicks, sharing QR codes, and viewing analytics."
              action={<CreateLink />}
            />
          ))}
        {(filteredUrls || []).map((url) => (
          <LinkCard key={url.id} url={url} fetchUrls={fnUrls} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
