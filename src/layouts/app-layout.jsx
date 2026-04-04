import Header from "@/components/header";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20 text-foreground overflow-x-hidden">
      <ParticleField />
      <div className="relative z-10 font-sans">
        <main className="w-full">
          <Header />
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
