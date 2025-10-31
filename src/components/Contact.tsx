import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Phone, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import emailjs from "emailjs-com";

// 🔐 Variáveis de ambiente (Vite usa import.meta.env)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

const Contact = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!PUBLIC_KEY) {
      console.warn("⚠️ VITE_EMAILJS_PUBLIC_KEY não definido. EmailJS não será inicializado.");
      return;
    }

    try {
      // @ts-ignore
      emailjs.init(PUBLIC_KEY);
    } catch (err) {
      console.error("Erro ao inicializar o EmailJS:", err);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // 🧩 Normaliza o telefone (remove símbolos e adiciona +55 se faltar)
  const normalizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    const cleaned = digits.startsWith("0") ? digits.slice(1) : digits;
    return cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  };

  // 🕒 Timestamp formatado
  const getFormattedTime = () => {
    const date = new Date();
    return date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.error("Configuração do EmailJS ausente. Verifique o arquivo .env.");
      console.error("Missing EmailJS config:", { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
      return;
    }

    const normalizedData = {
      ...formData,
      phone: normalizePhone(formData.phone),
      time: getFormattedTime(),
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, normalizedData, PUBLIC_KEY)
      .then(() => {
        toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail:", error);
        toast.error("Erro ao enviar mensagem. Tente novamente.");
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contato" className="py-24 px-4 gradient-dark">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Entre em Contato</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pronto para transformar o sistema de som da sua igreja? Solicite um orçamento sem compromisso.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informações de contato */}
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Telefone</h3>
                    <p className="text-muted-foreground">(21) 99776-7702</p>
                    <a
                      href="https://wa.me/5521997767702?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary underline hover:text-primary/80 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Abrir no WhatsApp
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <a
                  href="https://www.instagram.com/masterrsonorizacao?igsh=MTN3YTg1d2ozMThoNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Instagram className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Instagram</h3>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                      @masterrsonorizacao
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Localização</h3>
                    <p className="text-muted-foreground">
                      Santíssimo, Rio de Janeiro - RJ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58791.56043343983!2d-43.52364889589844!3d-22.898729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bde6f50000001%3A0x3cbd44641e16c7b9!2sSant%C3%ADssimo%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1709000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização - Santíssimo, Rio de Janeiro"
                />
              </CardContent>
            </Card>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="name"
                    placeholder="Nome da Igreja ou Responsável"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <Textarea
                    name="message"
                    placeholder="Conte-nos sobre suas necessidades de sonorização..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-background/50 resize-none"
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg py-6 transition-all hover:scale-105"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
