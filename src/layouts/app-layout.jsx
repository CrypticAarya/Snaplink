import Header from "@/components/header";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/25 text-foreground overflow-x-hidden">
      <ParticleField />
      <div className="flex-1 flex flex-col relative z-10 font-sans">
        <main className="flex-1 w-full">
          <Header />
          <Outlet />
        </main>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
