
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import { ArrowRight, Ship } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-light/10 to-white overflow-hidden relative">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230AB3B8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Decorative wave elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white/40 to-transparent z-0" />
      <div className="absolute top-20 right-0 w-40 h-40 bg-ocean/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-ocean/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Header />
        <main className="pt-16 overflow-x-hidden">
          <WelcomeSection />
          
          {/* Call to action banner */}
          <div className="relative mt-8 mb-20 bg-gradient-to-r from-ocean to-ocean-dark text-white py-12 px-4">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to set sail?</h3>
                <p className="text-white/90 max-w-md">Book your speedboat transfer now and experience the beauty of the Maldives islands.</p>
              </div>
              <Link to="/booking" className="flex items-center bg-white text-ocean-dark hover:bg-white/90 font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
                Book Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-8 pt-4 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Ship className="h-4 w-4 text-ocean-light" />
          <span className="font-medium text-ocean-dark">Retour Maldives</span>
        </div>
        <p>© 2025 Retour Maldives - Premium Speedboat Transfers</p>
      </div>
    </div>
  );
};

export default Index;
