import { Check } from "lucide-react";

const expertise = [
  "Mais de 10 anos de experiência em sonorização eclesiástica",
  "Atendimento especializado para igrejas evangélicas e neopentecostais",
  "Equipamentos de última geração e marcas reconhecidas",
  "Equipe técnica certificada e altamente qualificada",
  "Projetos personalizados para cada espaço e necessidade",
  "Suporte técnico rápido e eficiente"
];

const About = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Expertise em
              <br />
              <span className="text-gradient">Sonorização Religiosa</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Entendemos as necessidades únicas das igrejas evangélicas e neopentecostais. 
              Nossa missão é garantir que cada palavra pregada e cada louvor cantado 
              sejam ouvidos com perfeita clareza e qualidade.
            </p>
            <p className="text-lg text-muted-foreground">
              Trabalhamos com paixão e dedicação para que a tecnologia sirva ao propósito 
              espiritual, criando ambientes sonoros que elevam a experiência de adoração.
            </p>
          </div>

          <div className="animate-fade-in-up">
            <div className="gradient-subtle rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold mb-6">Por que nos escolher?</h3>
              <ul className="space-y-4">
                {expertise.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 p-1 rounded-full bg-primary/20">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
