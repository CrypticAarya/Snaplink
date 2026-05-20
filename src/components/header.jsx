import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import GlitchText from "./GlitchText";
import MagneticButton from "./MagneticButton";
import { useAuth } from "@/context";

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();

  const { user, fetchUser } = useAuth();

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
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
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
