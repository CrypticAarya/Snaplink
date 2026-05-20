import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/services/api/urls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }) => {
  const slug = url?.custom_url || url?.short_url;

  const downloadImage = () => {
    const anchor = document.createElement("a");
    anchor.href = url?.qr;
    anchor.download = url?.title;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="surface-card p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 group">
      <img
        src={url?.qr}
        className="h-24 w-24 sm:h-28 sm:w-28 object-contain rounded-lg ring-1 ring-border/60 p-1.5 bg-muted/30 self-start shrink-0"
        alt="QR code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 min-w-0 gap-1.5">
        <span className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {url?.title}
        </span>
        <span className="text-sm sm:text-base font-medium text-primary truncate">
          {window.location.host}/{slug}
        </span>
        <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground min-w-0">
          <LinkIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{url?.original_url}</span>
        </span>
        <span className="text-xs text-muted-foreground/80 mt-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex sm:flex-col gap-2 self-end sm:self-center shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 min-h-[40px] min-w-[40px] rounded-lg ring-1 ring-border/60 hover:bg-primary/10 hover:text-primary sm:h-9 sm:w-9"
          onClick={() =>
            navigator.clipboard.writeText(`${window.location.origin}/${slug}`)
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
          onClick={() => fnDelete().then(() => fetchUrls())}
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
  );
};

export default LinkCard;
