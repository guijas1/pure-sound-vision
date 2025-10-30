import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Mic, Music, Settings } from "lucide-react";

const services = [
  {
    icon: Volume2,
    title: "Instalação Completa",
    description: "Projeto, instalação e configuração de sistemas de som profissionais adaptados ao espaço da sua igreja."
  },
  {
    icon: Mic,
    title: "Microfones & Monitores",
    description: "Seleção e configuração de microfones e monitores de palco para máxima clareza e conforto."
  },
  {
    icon: Music,
    title: "Mixagem & Equalização",
    description: "Ajuste profissional de mixagem, equalização e processamento de áudio para som perfeito."
  },
  {
    icon: Settings,
    title: "Manutenção & Suporte",
    description: "Manutenção preventiva e corretiva, além de suporte técnico contínuo para seu sistema."
  }
];

const Services = () => {
  return (
    <section id="servicos" className="py-24 px-4 gradient-subtle relative">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground">
            Soluções completas em áudio para transformar a experiência de culto da sua congregação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
