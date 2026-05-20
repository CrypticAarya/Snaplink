import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/api/auth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import GlitchText from "@/components/common/GlitchText";
import MagneticButton from "@/components/common/MagneticButton";
import { useAuth } from "@/features/auth/context";

function getInitials(name) {
  if (!name || typeof name !== "string") return "SL";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();

  const { user, fetchUser } = useAuth();
  const displayName = user?.user_metadata?.name ?? user?.email ?? "Account";
  const initials = getInitials(user?.user_metadata?.name);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center bg-transparent">
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer hover:no-underline">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center group-hover:shadow-accent group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out">
            <LinkIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            <GlitchText text="SnapLink" />
          </span>
        </Link>
        <div className="flex gap-4 items-center">
          {!user ? (
            <MagneticButton
              onClick={() => navigate("/auth")}
              className="px-5 py-2 rounded-xl border border-border/80 text-sm font-medium text-foreground bg-transparent hover:bg-white/[0.04] hover:border-primary/35 hover:text-primary hover:shadow-accent transition-all duration-300 ease-out"
            >
              Login
            </MagneticButton>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-border/60 hover:ring-primary/40 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  {user?.email && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {user.email}
                    </p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/auth");
                    });
                  }}
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#8b5cf6" />}
    </>
  );
};

export default Header;
