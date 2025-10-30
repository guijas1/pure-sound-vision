import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import masterLogo from "@/assets/master-logo.jpg";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-dark">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden glow-effect">
              <img 
                src={masterLogo} 
                alt="Master Sonorização Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Som Profissional para
            <br />
            <span className="text-gradient">Sua Igreja</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Especialistas em sonorização para igrejas evangélicas e neopentecostais. 
            Qualidade técnica e excelência em cada culto.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 transition-all hover:scale-105"
              onClick={scrollToContact}
            >
              Solicitar Orçamento
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2 transition-all hover:scale-105"
              onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Nossos Serviços
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;
