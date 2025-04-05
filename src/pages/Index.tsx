
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden relative">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230AB3B8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white/40 to-transparent z-0" />
      
      <div className="relative z-10">
        <Header />
        <main className="pt-20">
          <WelcomeSection />
        </main>
      </div>

      <div className="relative z-10 w-full flex justify-center pb-8 pt-16 text-sm text-gray-500">
        © 2025 Retour Maldives
      </div>
    </div>
  );
};

export default Index;
