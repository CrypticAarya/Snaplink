
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url = [], fetchUrls }) => {
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

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="flex flex-col md:flex-row gap-5 p-6 glow-card transition-all duration-300 group overflow-hidden">
      <img
        src={url?.qr}
        className="h-32 object-contain ring-2 ring-zinc-500/50 p-1 bg-zinc-800 rounded-lg self-start group-hover:ring-zinc-400"
        alt="qr code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 min-w-0">
        <span className="text-3xl font-extrabold text-foreground hover:text-primary transition-colors cursor-pointer tracking-tight truncate">
          {url?.title}
        </span>
        <a
          href={`/${url?.custom_url ? url?.custom_url : url.short_url}`}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="text-xl md:text-2xl text-primary font-bold hover:underline underline-offset-4 cursor-pointer mt-1 truncate"
        >
          {window.location.host}/{url?.custom_url ? url?.custom_url : url.short_url}
        </a>
        <span className="flex items-center gap-1 hover:underline cursor-pointer text-muted-foreground mt-2 text-sm">
          <LinkIcon className="p-1 shrink-0 w-5 h-5 text-primary/70" />
          <span className="truncate">{url?.original_url}</span>
        </span>
        <span className="flex items-end font-extralight text-sm flex-1 text-zinc-600 mt-4">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(`${window.location.origin}/${url?.short_url}`)
          }
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disable={loadingDelete}
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
