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
import { LayoutDashboard, LinkIcon, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import GlitchText from "@/components/common/GlitchText";
import MagneticButton from "@/components/common/MagneticButton";
import { useAuth } from "@/features/auth/context";
import { ACCENT_HEX } from "@/constants/theme";
import { cn } from "@/utils/cn";

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
  const displayName = user?.user_metadata?.name ?? "Your account";
  const initials = getInitials(user?.user_metadata?.name);

  const handleLogout = () => {
    fnLogout().then(() => {
      fetchUser();
      navigate("/auth");
    });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2 hover:no-underline"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary transition-transform group-hover:scale-[1.02]">
              <LinkIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="truncate text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg">
              <GlitchText text="SnapLink" />
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {!user ? (
              <MagneticButton
                onClick={() => navigate("/auth")}
                className="min-h-10 rounded-lg border border-border/80 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-white/[0.04] hover:text-primary"
              >
                Log in
              </MagneticButton>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "rounded-full outline-none transition-all",
                    "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "hover:ring-2 hover:ring-primary/25"
                  )}
                  aria-label="Account menu"
                >
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-border/80 ring-offset-2 ring-offset-background">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary sm:text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border-border/80 p-1.5"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="px-2 py-2 font-normal">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {displayName}
                        </p>
                        {user?.email && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/80" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg py-2.5"
                    onSelect={() => navigate("/dashboard")}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/80" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                    onSelect={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>
      {loading && <BarLoader width="100%" color={ACCENT_HEX} />}
    </>
  );
};

export default Header;
