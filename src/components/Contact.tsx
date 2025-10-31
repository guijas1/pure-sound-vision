import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || "";
const CONTACT_WHATSAPP = import.meta.env.VITE_CONTACT_WHATSAPP || "";
const CONTACT_INSTAGRAM = import.meta.env.VITE_CONTACT_INSTAGRAM || "";
const CONTACT_LOCATION = import.meta.env.VITE_CONTACT_LOCATION || "";
const CONTACT_MAP_EMBED_URL =
  import.meta.env.VITE_CONTACT_MAP_EMBED_URL || import.meta.env.VITE_CONTACT_MAP_URL || "";
const COOLDOWN_MS = 30_000;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_ACCESS_TOKEN = import.meta.env.VITE_EMAILJS_ACCESS_TOKEN || "";
const EMAILJS_ENDPOINT =
  import.meta.env.VITE_EMAILJS_ENDPOINT || "https://api.emailjs.com/api/v1.0/email/send";
const REQUEST_TIMEOUT_MS = 10_000;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [botField, setBotField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);

  // 🧩 Normaliza o telefone (remove símbolos e adiciona +55 se faltar)
  const normalizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    const cleaned = digits.startsWith("0") ? digits.slice(1) : digits;
    return cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  };

  const phoneSource = CONTACT_WHATSAPP || CONTACT_PHONE;
  const whatsappLink = phoneSource
    ? `https://wa.me/${normalizePhone(
        phoneSource,
      )}?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento.`
    : "";

  // 🕒 Timestamp formatado
  const getFormattedTime = () => {
    const date = new Date();
    return date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (botField.trim()) {
      toast.error("Não foi possível enviar a mensagem.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
      toast.error("Informe um telefone válido com DDD.");
      return;
    }

    if (isSubmitting) {
      return;
    }

    if (lastSubmissionTime) {
      const elapsed = Date.now() - lastSubmissionTime;
      if (elapsed < COOLDOWN_MS) {
        const seconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        toast.error(`Aguarde ${seconds}s antes de enviar uma nova mensagem.`);
        return;
      }
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("Configuração do EmailJS ausente. Verifique o arquivo .env.");
      console.error("Missing EmailJS config:", {
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        EMAILJS_PUBLIC_KEY,
      });
      return;
    }

    const normalizedData = {
      ...formData,
      phone: normalizePhone(formData.phone),
      time: getFormattedTime(),
    };

    const templateParams = {
      ...normalizedData,
      reply_to: formData.email,
      bot_field: botField.trim() || undefined,
      origin: window.location.href,
    };

    const payload: Record<string, unknown> = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    };

    if (EMAILJS_ACCESS_TOKEN) {
      payload.accessToken = EMAILJS_ACCESS_TOKEN;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    setIsSubmitting(true);

    try {
      const response = await fetch(EMAILJS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(errorBody || `EmailJS retornou o status ${response.status}`);
      }

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setBotField("");
      setLastSubmissionTime(Date.now());
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);

      if (error instanceof DOMException && error.name === "AbortError") {
        toast.error("Tempo de resposta excedido. Verifique sua conexão e tente novamente.");
        return;
      }

      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
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
                    {CONTACT_PHONE ? (
                      <p className="text-muted-foreground">{CONTACT_PHONE}</p>
                    ) : (
                      <p className="text-muted-foreground">
                        Informe seu telefone no formulário e entraremos em contato com você.
                      </p>
                    )}
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary underline hover:text-primary/80 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Abrir no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                {CONTACT_INSTAGRAM ? (
                  <a
                    href={CONTACT_INSTAGRAM}
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
                        Visite nosso perfil
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Instagram className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Redes sociais</h3>
                      <p className="text-muted-foreground">
                        Nossas redes sociais serão divulgadas em breve.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Atendimento</h3>
                    <p className="text-muted-foreground">
                      {CONTACT_LOCATION || "Atendimento em todo o Rio de Janeiro."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {CONTACT_MAP_EMBED_URL && (
              <Card className="bg-card/50 backdrop-blur border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    src={CONTACT_MAP_EMBED_URL}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="hidden" aria-hidden>
                    <label htmlFor="company" className="sr-only">
                      Não preencha este campo
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={botField}
                      onChange={(event) => setBotField(event.target.value)}
                    />
                  </div>

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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
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
