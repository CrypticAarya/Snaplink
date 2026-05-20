import { Link } from "lucide-react";
const Footer = () => {
  return <footer className="border-t border-border/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
            <Link className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">SnapLink</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {(/* @__PURE__ */ new Date()).getFullYear()} SnapLink. All rights reserved.
        </p>
      </div>
    </footer>;
};
var stdin_default = Footer;
export {
  stdin_default as default
};
