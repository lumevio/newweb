import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Chat from "./components/Chat";
import {
  BarChart3,
  CheckCircle2,
  Globe2,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Store,
  TabletSmartphone,
  TrendingUp,
  UserRound,
  X,
  Zap,
} from "lucide-react";

type Lang = "pl" | "en";
type Theme = "dark" | "light";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type ProductCard = {
  name: string;
  tag: string;
  image: string;
  points: readonly string[];
};

type IndustryCard = {
  name: string;
  tag: string;
  image: string;
  points: readonly string[];
};

const COMPANY = {
  brand: "LUMEVIO",
  website: "https://www.lumevio.pl",
  phone: "+48 511 125 651",
  emails: [
    "hello@lumevio.pl",
    "sales@lumevio.pl",
    "work@lumevio.pl",
    "contact@lumevio.pl",
    "partnership@lumevio.pl",
  ] as const,
  nip: "6681935834",
  regon: "380004555",
};

const visuals = {
  hero: "/images/lumevio-hero.png",
  grid: "/images/lumevio-grid.png",
  os: "/images/lumevio-os.png",
  ai: "/images/lumevio-ai.png",
  cloud: "/images/lumevio-cloud.png",
  telco: "/images/lumevio-telco.png",
  retail: "/images/lumevio-retail.png",
  banking: "/images/lumevio-banking.png",
  logo: "/images/logo.png",
} as const;

const copy = {
  pl: {
    nav: {
      products: "Produkty",
      experience: "Experience",
      industries: "Branże",
      analytics: "Analityka",
      roi: "ROI",
      contact: "Kontakt",
      chat: "Czat",
      cta: "Umów demo",
    },
    hero: {
      title: "Operating System dla świata fizycznego.",
      subtitle:
        "LUMEVIO zamienia offline w mierzalny, skalowalny kanał sprzedaży. Łączymy NFC, dane i AI, tworząc inteligentną infrastrukturę dla retailu, marketingu i nowoczesnych marek.",
      badge: "Phygital Growth Infrastructure",
      stats: ["Offline analytics", "Smart retail", "AI optimization"],
      ctaPrimary: "Poznaj platformę",
      ctaSecondary: "Porozmawiajmy",
    },
    trust: {
      title: "Jedna platforma. Trzy warstwy wzrostu.",
      points: [
        "Fizyczne punkty styku zamienione w kanał sprzedaży i danych.",
        "Pełna mierzalność interakcji NFC bez potrzeby instalacji aplikacji.",
        "AI wspierające treści, ofertę, CTA i decyzje wdrożeniowe.",
      ],
    },
    products: {
      title: "Trzy produkty, jeden ekosystem wzrostu",
      subtitle:
        "LUMEVIO OS, LUMEVIO Grid i LUMEVIO Intelligence tworzą nową generację infrastruktury phygital dla retailu, bankowości, marek premium i nowoczesnych przestrzeni komercyjnych.",
      os: {
        name: "LUMEVIO OS",
        tag: "The Operating System for the Physical World",
        image: visuals.os,
        points: [
          "Campaign Engine: kampanie NFC, landingi, onboarding i dynamiczna personalizacja.",
          "Dashboard i Analytics: interakcje, lokalizacje, czas, ścieżki użytkownika i konwersje.",
          "Offline A/B Testing i Automation Engine w czasie rzeczywistym.",
          "Integracje z CRM, e-commerce, marketing automation i systemami enterprise.",
        ],
      },
      grid: {
        name: "LUMEVIO Grid",
        tag: "The Phygital Interaction Network",
        image: visuals.grid,
        points: [
          "Sieć inteligentnych punktów interakcji w sklepach, na eventach, półkach, plakatach i materiałach POS.",
          "Global Data Layer i mapa skuteczności kampanii offline.",
          "Location Intelligence: gdzie użytkownicy reagują, klikają i kupują.",
          "Skalowalne wdrożenia dla retailu, galerii handlowych, banków i marek premium.",
        ],
      },
      ai: {
        name: "LUMEVIO Intelligence",
        tag: "Data. Interaction. Conversion. Everywhere.",
        image: visuals.ai,
        points: [
          "Predictive Conversion AI i Behavioral Engine analizujące zachowania klientów.",
          "Auto-Optimization: AI optymalizuje treści, oferty, CTA i scenariusze kampanii.",
          "Smart Recommendations dla marketingu, sprzedaży i operacji.",
          "Dynamic Content Engine do personalizacji doświadczeń bez potrzeby instalacji aplikacji.",
        ],
      },
    },
    experience: {
      title: "Interaktywne experience, które sprzedają",
      subtitle:
        "Wirtualna karta zbliżeniowa, demo półki i warstwa motion pokazują, jak LUMEVIO działa w realnym świecie.",
      shelf: "Smart shelf demo",
      trigger: "Zbliż telefon",
      tap: "Aktywuj tap",
      live: "Punkt NFC aktywny",
      labels: ["Treść otwarta", "Lead capture", "Live analytics"],
      sideTitle: "Offline traffic staje się mierzalnym przychodem",
      sidePoints: [
        "Jedno zbliżenie uruchamia landing, ofertę, formularz lub kampanię.",
        "Zbieraj leady bezpośrednio z półki, produktu i materiału POS.",
        "Widzisz, gdzie klient reaguje, kiedy wchodzi i co konwertuje.",
      ],
    },
    industries: {
      badge: "Industry Visualizations",
      title: "LUMEVIO dla branż o najwyższym potencjale wzrostu",
      subtitle:
        "Gotowe scenariusze wdrożeń dla telco, retailu i bankowości. Każda branża może zamienić fizyczne punkty styku w mierzalną sprzedaż, leady i inteligentne doświadczenia.",
      cta: "Poznaj scenariusz",
      items: [
        {
          name: "LUMEVIO Telco Experience",
          tag: "For mobile networks and telecom retail",
          image: visuals.telco,
          points: [
            "Aktywacja ofert abonamentowych i urządzeń po zbliżeniu telefonu.",
            "Lead capture i onboarding eSIM w salonach operatora.",
            "AI rekomendacje taryf, urządzeń i ofert dodatkowych.",
          ],
        },
        {
          name: "LUMEVIO Retail Activation",
          tag: "For smart retail and shelf conversion",
          image: visuals.retail,
          points: [
            "Interaktywne półki, smart shelf i kampanie produktowe NFC.",
            "Kupony, landing pages, konkursy i analityka offline w czasie rzeczywistym.",
            "Wzrost konwersji przy półce i pełna mierzalność działań.",
          ],
        },
        {
          name: "LUMEVIO Banking Experience",
          tag: "For banking branches and financial acquisition",
          image: visuals.banking,
          points: [
            "Aktywacja ofert kont, kredytów i konsultacji w oddziałach.",
            "Szybki onboarding klienta bez potrzeby instalacji aplikacji.",
            "AI dopasowanie ofert i tracking skuteczności placówki.",
          ],
        },
      ] as readonly IndustryCard[],
    },
    roi: {
      title: "ROI Calculator",
      subtitle:
        "Policz potencjał wdrożenia w retail w kilkanaście sekund. Zmieniaj parametry i pokazuj klientowi realny potencjał biznesowy.",
      stores: "Liczba sklepów",
      customers: "Klientów dziennie / sklep",
      basket: "Średni koszyk (PLN)",
      uplift: "Wzrost konwersji (%)",
      monthly: "Dodatkowy obrót / miesiąc",
      yearly: "Dodatkowy obrót / rok",
      interactions: "Szacowane interakcje / miesiąc",
      note:
        "Symulacja sprzedażowa do rozmów handlowych i demo. Finalne wyniki zależą od kategorii, ekspozycji i scenariusza wdrożenia.",
    },
    analytics: {
      title: "Live analytics panel",
      subtitle:
        "Pokaż, że technologia działa teraz. Dynamiczne liczniki budują wiarygodność i efekt premium.",
      cards: ["Interakcje dziś", "Aktywne lokalizacje", "Leady z kampanii", "Wzrost zaangażowania"],
      ticker:
        "Nowa interakcja retail • Aktywna kampania premium • AI rekomenduje pilotaż • Wykryto nowy punkt styku",
    },
    faq: {
      title: "Najczęstsze pytania",
      items: [
        {
          q: "Czy użytkownik musi instalować aplikację?",
          a: "Nie. Doświadczenie może otwierać się bezpośrednio po zbliżeniu telefonu do punktu NFC.",
        },
        {
          q: "Czy to działa w dużych sieciach?",
          a: "Tak. LUMEVIO projektowane jest pod skalę: od pilota po rollout wielolokalizacyjny.",
        },
        {
          q: "Czy da się mierzyć skuteczność kampanii offline?",
          a: "Tak. Zbieramy interakcje, lokalizacje, czas, aktywacje i inne sygnały zachowań użytkownika.",
        },
      ],
    },
    contact: {
      title: "Porozmawiajmy o wzroście Twojej firmy",
      subtitle:
        "Zostaw kontakt, a przygotujemy strategię wdrożenia LUMEVIO dopasowaną do Twojej branży, punktów styku i celów sprzedażowych.",
      name: "Imię i nazwisko",
      email: "Email firmowy",
      company: "Firma",
      message: "Czego potrzebujesz?",
      send: "Wyślij zapytanie",
      success: "Dziękujemy. Odezwiemy się najszybciej jak to możliwe.",
      sending: "Wysyłanie...",
      error: "Błąd wysyłki. Spróbuj ponownie.",
      info: "Odpowiadamy zwykle w 24h.",
    },
    chat: {
      title: "LUMEVIO Live Chat",
      placeholder: "Napisz pytanie o wdrożenie, ceny lub demo...",
      open: "Otwórz czat",
      close: "Zamknij",
      send: "Wyślij",
      hello: "Witaj. Jestem doradcą LUMEVIO. Jak mogę pomóc Twojej firmie?",
      quick: ["Ceny", "Demo", "Retail", "Bankowość"],
    },
    footer: {
      notes: [
        "LUMEVIO OS, LUMEVIO Grid i LUMEVIO Intelligence tworzą nową generację infrastruktury NFC, phygital i AI dla nowoczesnego biznesu.",
        "Dostępność niektórych funkcji, integracji i usług może zależeć od rynku, branży, języka oraz modelu wdrożenia.",
        "Zakres funkcji i modułów może ulegać zmianie wraz z rozwojem platformy i aktualizacjami produktowymi.",
      ],
      columns: {
        explore: {
          title: "Poznaj LUMEVIO",
          links: [
            { label: "Platforma", href: "#home" },
            { label: "Produkty", href: "#products" },
            { label: "Branże", href: "#industries" },
            { label: "ROI", href: "#roi" },
            { label: "Kontakt", href: "#contact" },
          ],
        },
        products: {
          title: "Produkty",
          links: ["LUMEVIO OS", "LUMEVIO Grid", "LUMEVIO Intelligence", "Offline Analytics", "Automation Engine", "Location Intelligence"],
        },
        company: {
          title: "Firma",
          lines: [
            COMPANY.brand,
            `NIP: ${COMPANY.nip}`,
            `REGON: ${COMPANY.regon}`,
            COMPANY.phone,
            COMPANY.website,
          ],
        },
      },
      legal: {
        copyright: "Copyright © 2026 LUMEVIO. Wszelkie prawa zastrzeżone.",
        region: "Polska",
      },
    },
  },
  en: {
    nav: {
      products: "Products",
      experience: "Experience",
      industries: "Industries",
      analytics: "Analytics",
      roi: "ROI",
      contact: "Contact",
      chat: "Chat",
      cta: "Book demo",
    },
    hero: {
      title: "Operating System for the physical world.",
      subtitle:
        "LUMEVIO transforms offline touchpoints into a measurable, scalable sales channel. We connect NFC, data, and AI to build intelligent infrastructure for retail, marketing, and modern brands.",
      badge: "Phygital Growth Infrastructure",
      stats: ["Offline analytics", "Smart retail", "AI optimization"],
      ctaPrimary: "Explore platform",
      ctaSecondary: "Let’s talk",
    },
    trust: {
      title: "One platform. Three layers of growth.",
      points: [
        "Physical touchpoints transformed into a sales and data channel.",
        "Full measurement of NFC interactions with no app install required.",
        "AI supporting content, offers, CTAs, and deployment decisions.",
      ],
    },
    products: {
      title: "Three products, one growth ecosystem",
      subtitle:
        "LUMEVIO OS, LUMEVIO Grid, and LUMEVIO Intelligence create a next-generation phygital infrastructure for retail, banking, premium brands, and modern commercial spaces.",
      os: {
        name: "LUMEVIO OS",
        tag: "The Operating System for the Physical World",
        image: visuals.os,
        points: [
          "Campaign Engine: NFC campaigns, landing pages, onboarding, and dynamic personalization.",
          "Dashboard and Analytics: interactions, locations, timing, user journeys, and conversions.",
          "Offline A/B Testing and real-time Automation Engine.",
          "Integrations with CRM, e-commerce, marketing automation, and enterprise systems.",
        ],
      },
      grid: {
        name: "LUMEVIO Grid",
        tag: "The Phygital Interaction Network",
        image: visuals.grid,
        points: [
          "A network of intelligent interaction points across stores, events, shelves, posters, and POS materials.",
          "Global Data Layer and offline campaign effectiveness mapping.",
          "Location Intelligence: where users react, engage, and buy.",
          "Scalable deployment for retail, shopping centers, banks, and premium brands.",
        ],
      },
      ai: {
        name: "LUMEVIO Intelligence",
        tag: "Data. Interaction. Conversion. Everywhere.",
        image: visuals.ai,
        points: [
          "Predictive Conversion AI and Behavioral Engine for customer insight.",
          "Auto-Optimization: AI improves content, offers, CTAs, and campaign logic.",
          "Smart Recommendations for marketing, sales, and operations teams.",
          "Dynamic Content Engine for app-free personalization at scale.",
        ],
      },
    },
    experience: {
      title: "Interactive experiences that sell",
      subtitle:
        "A virtual contactless card, a shelf demo, and a motion layer show how LUMEVIO works in the real world.",
      shelf: "Smart shelf demo",
      trigger: "Tap the phone",
      tap: "Activate tap",
      live: "NFC point active",
      labels: ["Content opened", "Lead capture", "Live analytics"],
      sideTitle: "Offline traffic becomes measurable revenue",
      sidePoints: [
        "One tap launches a landing page, offer, form, or campaign.",
        "Collect leads directly from the shelf, product, and POS materials.",
        "See where the customer reacts, when they enter, and what converts.",
      ],
    },
    industries: {
      badge: "Industry Visualizations",
      title: "LUMEVIO for high-growth industries",
      subtitle:
        "Ready-made deployment scenarios for telco, retail, and banking. Every sector can transform physical touchpoints into measurable sales, leads, and intelligent experiences.",
      cta: "Explore scenario",
      items: [
        {
          name: "LUMEVIO Telco Experience",
          tag: "For mobile networks and telecom retail",
          image: visuals.telco,
          points: [
            "Activate plan and device offers with one phone tap.",
            "Lead capture and eSIM onboarding inside operator stores.",
            "AI recommendations for tariffs, devices, and add-on offers.",
          ],
        },
        {
          name: "LUMEVIO Retail Activation",
          tag: "For smart retail and shelf conversion",
          image: visuals.retail,
          points: [
            "Interactive shelves, smart shelf journeys, and NFC product campaigns.",
            "Coupons, landing pages, contests, and real-time offline analytics.",
            "Higher shelf conversion with full measurability.",
          ],
        },
        {
          name: "LUMEVIO Banking Experience",
          tag: "For banking branches and financial acquisition",
          image: visuals.banking,
          points: [
            "Activate account, loan, and consultation offers in branches.",
            "Fast customer onboarding without requiring an app.",
            "AI offer matching and branch-level performance tracking.",
          ],
        },
      ] as readonly IndustryCard[],
    },
    roi: {
      title: "ROI Calculator",
      subtitle:
        "Calculate rollout potential in seconds. Adjust the inputs and show clients the real commercial upside.",
      stores: "Number of stores",
      customers: "Daily customers / store",
      basket: "Average basket (PLN)",
      uplift: "Conversion uplift (%)",
      monthly: "Additional revenue / month",
      yearly: "Additional revenue / year",
      interactions: "Estimated interactions / month",
      note:
        "Sales simulation for commercial calls and demos. Final results depend on category, exposure, and rollout scenario.",
    },
    analytics: {
      title: "Live analytics panel",
      subtitle:
        "Show that the technology is working right now. Dynamic counters create trust and a premium effect.",
      cards: ["Interactions today", "Active locations", "Campaign leads", "Engagement uplift"],
      ticker:
        "New retail interaction • Premium campaign active • AI recommends a pilot • New touchpoint detected",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "Does the user need to install an app?",
          a: "No. The experience can open directly after the phone touches the NFC point.",
        },
        {
          q: "Can this work across large retail chains?",
          a: "Yes. LUMEVIO is designed for scale, from pilot projects to multi-location rollouts.",
        },
        {
          q: "Can offline campaign effectiveness be measured?",
          a: "Yes. We capture interactions, locations, timing, activations, and other user behavior signals.",
        },
      ],
    },
    contact: {
      title: "Let’s talk about your growth",
      subtitle:
        "Leave your details and we will prepare a LUMEVIO deployment strategy tailored to your industry, touchpoints, and sales goals.",
      name: "Full name",
      email: "Business email",
      company: "Company",
      message: "What do you need?",
      send: "Send inquiry",
      success: "Thank you. We will get back to you as soon as possible.",
      sending: "Sending...",
      error: "Sending failed. Please try again.",
      info: "We usually reply within 24h.",
    },
    chat: {
      title: "LUMEVIO Live Chat",
      placeholder: "Ask about deployment, pricing, or demo...",
      open: "Open chat",
      close: "Close",
      send: "Send",
      hello: "Hi. I am your LUMEVIO advisor. How can I help your company today?",
      quick: ["Pricing", "Demo", "Retail", "Banking"],
    },
    footer: {
      notes: [
        "LUMEVIO OS, LUMEVIO Grid, and LUMEVIO Intelligence create a new generation of NFC, phygital, and AI infrastructure for modern business.",
        "Availability of selected features, integrations, and services may depend on market, industry, language, and deployment model.",
        "The scope of features and modules may evolve as the platform grows and product updates continue.",
      ],
      columns: {
        explore: {
          title: "Explore LUMEVIO",
          links: [
            { label: "Platform", href: "#home" },
            { label: "Products", href: "#products" },
            { label: "Industries", href: "#industries" },
            { label: "ROI", href: "#roi" },
            { label: "Contact", href: "#contact" },
          ],
        },
        products: {
          title: "Products",
          links: ["LUMEVIO OS", "LUMEVIO Grid", "LUMEVIO Intelligence", "Offline Analytics", "Automation Engine", "Location Intelligence"],
        },
        company: {
          title: "Company",
          lines: [
            COMPANY.brand,
            `NIP: ${COMPANY.nip}`,
            `REGON: ${COMPANY.regon}`,
            COMPANY.phone,
            COMPANY.website,
          ],
        },
      },
      legal: {
        copyright: "Copyright © 2026 LUMEVIO. All rights reserved.",
        region: "Poland",
      },
    },
  },
} as const;

const quickEmailList = COMPANY.emails;

const initialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("lumevio-theme");
  return saved === "light" || saved === "dark" ? saved : "dark";
};

const initialLang = (): Lang => {
  if (typeof window === "undefined") return "pl";
  const saved = localStorage.getItem("lumevio-lang");
  return saved === "pl" || saved === "en" ? saved : "pl";
};

const sectionHrefByQuickIntent: Record<string, string> = {
  retail: "#industries",
  banking: "#industries",
  demo: "#contact",
  pricing: "#roi",
  ceny: "#roi",
};

function ContactForm({
  t,
  lang,
}: {
  t: (typeof copy)["pl"]["contact"] | (typeof copy)["en"]["contact"];
  lang: Lang;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mykbbgzr", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative">
      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/10 p-6 text-white backdrop-blur-xl"
        >
          <p className="text-sm text-emerald-300">{t.success}</p>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="group relative space-y-5 overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f] p-6 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute -top-10 right-[-20px] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-10 left-[-20px] h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          </div>

          <div className="relative space-y-5">
            <label className="block">
              <span className="sr-only">{t.name}</span>
              <input
                required
                name="name"
                placeholder={t.name}
                className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>

            <label className="block">
              <span className="sr-only">{t.email}</span>
              <input
                required
                name="email"
                type="email"
                placeholder={t.email}
                className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>

            <label className="block">
              <span className="sr-only">{t.company}</span>
              <input
                required
                name="company"
                placeholder={t.company}
                className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </label>

            <label className="block">
              <span className="sr-only">{t.message}</span>
              <textarea
                required
                name="message"
                rows={4}
                placeholder={t.message}
                className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30"
              />
            </label>

            <input
              type="hidden"
              name="_subject"
              value={lang === "pl" ? "Nowe zapytanie ze strony LUMEVIO" : "New inquiry from LUMEVIO website"}
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-3 font-semibold text-[#05051b] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? t.sending : t.send}
            </button>

            {status === "error" && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {t.error}
              </div>
            )}

            <div className="text-xs text-white/40">{t.info}</div>
          </div>
        </form>
      )}
    </div>
  );
}

function SmartShelfDemo({
  labels,
  shelf,
  trigger,
  live,
  tap,
  lang,
}: {
  labels: readonly string[];
  shelf: string;
  trigger: string;
  live: string;
  tap: string;
  lang: Lang;
}) {
  const [active, setActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => setActive(false), 2800);
    return () => clearTimeout(timeout);
  }, [active]);

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#050b18] p-6 shadow-[0_30px_120px_-30px_rgba(34,211,238,0.22)] md:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {!shouldReduceMotion && (
          <>
            <motion.div
              animate={{ x: [0, 50, -40, 0], y: [0, -20, 25, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 right-[-8%] h-[340px] w-[340px] rounded-full bg-cyan-400/20 blur-[120px]"
            />
            <motion.div
              animate={{ x: [0, -40, 30, 0], y: [0, 20, -20, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[-100px] left-[-8%] h-[340px] w-[340px] rounded-full bg-fuchsia-500/20 blur-[120px]"
            />
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035),transparent_60%)]" />
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium text-cyan-200">
            <Store className="h-3.5 w-3.5" />
            {shelf}
          </div>

          <h3 className="max-w-xl text-4xl font-semibold leading-tight text-white">
            {lang === "pl" ? "Zamień półkę w interaktywny kanał sprzedaży" : "Turn the shelf into an interactive sales channel"}
          </h3>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 md:text-base">
            {lang === "pl"
              ? "LUMEVIO łączy produkt, punkt NFC i ekran telefonu w jeden scenariusz: aktywację doświadczenia, otwarcie landing page, przechwycenie leada i pomiar skuteczności w czasie rzeczywistym."
              : "LUMEVIO connects the product, the NFC touchpoint, and the phone screen into one scenario: experience activation, landing page opening, lead capture, and real-time measurement."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => setActive(true)}
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              <ScanLine className="h-4 w-4" />
              {trigger}
            </button>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 backdrop-blur-xl">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Enterprise-ready flow
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {labels.map((label, idx) => (
              <motion.div
                key={label}
                animate={shouldReduceMotion ? {} : { opacity: active ? 1 : 0.78, y: active ? 0 : 6 }}
                transition={{ delay: idx * 0.12 }}
                className="rounded-[22px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
              >
                <div className="mb-3 inline-flex rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">
                  {idx === 0 ? <Globe2 className="h-4 w-4" /> : idx === 1 ? <UserRound className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
                </div>
                <div className="text-sm font-medium text-white/90">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <div className="absolute inset-x-0 bottom-4 right-14 rounded-[34px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_-20px_rgba(34,211,238,0.14)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between text-xs text-white/45">
              <span className="uppercase tracking-[0.24em]">Shelf A / Premium zone</span>
              <span>SKU 29841</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative rounded-2xl border border-white/10 bg-[#0b1422] p-3 shadow-inner shadow-black/20">
                  <div className="h-28 rounded-xl bg-gradient-to-b from-fuchsia-500/20 via-transparent to-cyan-400/20" />
                  <div className="mt-3 h-2 w-16 rounded-full bg-white/20" />
                  <div className="mt-2 h-2 w-10 rounded-full bg-white/10" />

                  {item === 2 && (
                    <>
                      <motion.div
                        animate={shouldReduceMotion ? {} : active ? { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] } : { scale: 1, opacity: 0.75 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative mt-3 flex items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 py-2 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                      >
                        <Radio className="h-4 w-4" />
                      </motion.div>

                      <AnimatePresence>
                        {active && !shouldReduceMotion &&
                          [0, 1, 2].map((ring) => (
                            <motion.div
                              key={ring}
                              initial={{ opacity: 0.7, scale: 0.7 }}
                              animate={{ opacity: 0, scale: 2.2 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: ring * 0.22 }}
                              className="pointer-events-none absolute left-1/2 top-[60%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30"
                            />
                          ))}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            animate={shouldReduceMotion ? {} : active ? { x: -36, y: -50, rotate: -10, scale: 1.04 } : { x: 34, y: 8, rotate: -7, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute right-0 top-0 h-[340px] w-[185px] rounded-[40px] border border-white/10 bg-white/10 p-3 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="relative h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#081423] p-4 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_35%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.08),transparent_30%)]" />

              <div className="relative mb-4 flex items-center justify-between text-xs text-white/45">
                <span>14:28</span>
                <TabletSmartphone className="h-4 w-4 text-cyan-200" />
              </div>

              <div className="relative mt-8 text-center">
                <motion.div
                  animate={shouldReduceMotion ? {} : active ? { scale: [1, 1.18, 1], opacity: [0.8, 1, 0.8] } : { scale: 1 }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="relative mx-auto inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 p-4 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.18)]"
                >
                  <ScanLine className="h-6 w-6" />

                  <AnimatePresence>
                    {active && !shouldReduceMotion &&
                      [0, 1, 2].map((ring) => (
                        <motion.span
                          key={ring}
                          initial={{ opacity: 0.6, scale: 0.7 }}
                          animate={{ opacity: 0, scale: 2.8 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: ring * 0.18 }}
                          className="absolute inset-0 rounded-full border border-cyan-300/30"
                        />
                      ))}
                  </AnimatePresence>
                </motion.div>

                <div className="mt-5 text-sm font-semibold">{active ? live : tap}</div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-left text-xs leading-5 text-white/60 backdrop-blur-xl">
                  Dynamic landing • Promo • Lead form • Analytics
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FloatingCloud3D() {
  const [transform, setTransform] = useState("perspective(2000px) rotateX(0deg) rotateY(0deg) scale(1)");
  const shouldReduceMotion = useReducedMotion();

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 14;
    const rotateX = -((y - centerY) / centerY) * 14;
    setTransform(`perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`);
  };

  return (
    <div className="relative flex items-center justify-center py-10" onMouseMove={handleMove} onMouseLeave={() => setTransform("perspective(2000px) rotateX(0deg) rotateY(0deg) scale(1)")}>
      <div className="relative h-[360px] w-full max-w-[420px] transition-transform duration-200 ease-out" style={{ transform, transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.26),transparent_45%)] blur-3xl" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_55%)] blur-3xl" />

        {!shouldReduceMotion && (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} className="absolute inset-6 rounded-full border border-cyan-300/20" style={{ transform: "translateZ(-20px)" }} />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} className="absolute inset-12 rounded-full border border-fuchsia-400/20" style={{ transform: "translateZ(-30px)" }} />
          </>
        )}

        <motion.img
          src={visuals.cloud}
          alt="LUMEVIO Cloud AI"
          loading="lazy"
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_60px_rgba(168,85,247,0.5)]"
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(40px)" }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [stores, setStores] = useState(50);
  const [customers, setCustomers] = useState(180);
  const [basket, setBasket] = useState(24);
  const [uplift, setUplift] = useState(4);
  const [liveStats, setLiveStats] = useState({ interactions: 1284, locations: 18, leads: 46, engagement: 27 });
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const t = copy[lang];
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("lumevio-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lumevio-lang", lang);
    document.documentElement.lang = lang;
    document.title = lang === "pl" ? "LUMEVIO | Infrastruktura, Sieć i AI dla Świata Fizycznego" : "LUMEVIO | Infrastructure, Network and AI for the Physical World";
  }, [lang]);

  useEffect(() => {
    setMessages([{ id: crypto.randomUUID(), role: "assistant", text: t.chat.hello }]);
  }, [t.chat.hello]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => {
      setLiveStats((prev) => ({
        interactions: prev.interactions + Math.floor(Math.random() * 4),
        locations: prev.locations + (Math.random() > 0.92 ? 1 : 0),
        leads: prev.leads + (Math.random() > 0.82 ? 1 : 0),
        engagement: prev.engagement + (Math.random() > 0.76 ? 1 : 0),
      }));
    }, 2600);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!chatOpen || !chatScrollRef.current) return;
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, chatOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setChatOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const productColumns = useMemo<ProductCard[]>(() => [t.products.os, t.products.grid, t.products.ai], [t.products.os, t.products.grid, t.products.ai]);

  const roi = useMemo(() => {
    const monthly = stores * customers * 30 * basket * (uplift / 100);
    const yearly = monthly * 12;
    const interactions = stores * customers * 30 * 0.08;
    return { monthly, yearly, interactions };
  }, [stores, customers, basket, uplift]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(lang === "pl" ? "pl-PL" : "en-US", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(value);

  const askAssistant = (value: string) => {
    const text = value.toLowerCase();

    if (text.includes("cena") || text.includes("price") || text.includes("pricing")) {
      return lang === "pl"
        ? "Model cenowy jest elastyczny: SaaS od 999 do 9 999 PLN miesięcznie oraz kontrakty enterprise od 20 000 PLN miesięcznie."
        : "Pricing is flexible: SaaS plans from 999 to 9,999 PLN monthly and enterprise contracts from 20,000 PLN monthly.";
    }

    if (text.includes("demo") || text.includes("wdrożenie") || text.includes("implementation")) {
      return lang === "pl"
        ? "Na demo mapujemy Twoje punkty kontaktu i tworzymy plan wdrożenia SmartTap, OS, Grid i AI krok po kroku."
        : "During a demo we map your touchpoints and design a step-by-step SmartTap, OS, Grid, and AI rollout plan.";
    }

    if (text.includes("retail") || text.includes("shelf") || text.includes("półka") || text.includes("store")) {
      return lang === "pl"
        ? "Dla retailu LUMEVIO działa przy półce, na produkcie i w POS. Tworzymy interaktywne doświadczenia, lead capture i analitykę offline w czasie rzeczywistym."
        : "For retail, LUMEVIO works at the shelf, on-product, and across POS. We create interactive experiences, lead capture, and real-time offline analytics.";
    }

    if (text.includes("bank") || text.includes("banking")) {
      return lang === "pl"
        ? "Dla bankowości LUMEVIO wspiera onboarding, aktywację ofert i pomiar skuteczności placówek bez potrzeby dodatkowej aplikacji."
        : "For banking, LUMEVIO supports onboarding, offer activation, and branch performance measurement without requiring an extra app.";
    }

    return lang === "pl"
      ? "LUMEVIO łączy kampanie NFC, globalną sieć interakcji i AI, aby podnieść konwersję oraz wartość klienta w świecie offline."
      : "LUMEVIO combines NFC campaigns, a global interaction network, and AI to increase conversion and customer value across offline touchpoints.";
  };

  const sendChat = (event?: FormEvent, preset?: string) => {
    event?.preventDefault();
    const userText = (preset ?? chatInput).trim();
    if (!userText) return;

    setChatInput("");
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", text: userText },
      { id: crypto.randomUUID(), role: "assistant", text: askAssistant(userText) },
    ]);
  };

  return (
    <div className="bg-white text-slate-900 transition-colors duration-500 dark:bg-[#02020b] dark:text-slate-100">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-white/75 backdrop-blur-xl dark:bg-[#02020b]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center" aria-label="LUMEVIO home">
            <img src={visuals.logo} alt="LUMEVIO logo" className="h-14 w-auto object-contain sm:h-16 md:h-20" />
          </a>

          <nav className="hidden items-center gap-7 text-sm lg:flex">
            <a href="#products" className="transition hover:text-fuchsia-400">{t.nav.products}</a>
            <a href="#experience" className="transition hover:text-fuchsia-400">{t.nav.experience}</a>
            <a href="#industries" className="transition hover:text-fuchsia-400">{t.nav.industries}</a>
            <a href="#analytics" className="transition hover:text-fuchsia-400">{t.nav.analytics}</a>
            <a href="#roi" className="transition hover:text-fuchsia-400">{t.nav.roi}</a>
            <a href="#contact" className="transition hover:text-fuchsia-400">{t.nav.contact}</a>
            <button onClick={() => setChatOpen(true)} className="transition hover:text-fuchsia-400" type="button">{t.nav.chat}</button>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setLang((prev) => (prev === "pl" ? "en" : "pl"))} className="rounded-full border border-slate-400/40 px-3 py-1 text-xs">
              {lang.toUpperCase()}
            </button>
            <button type="button" onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} className="rounded-full border border-slate-400/40 px-3 py-1 text-xs">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <a href="#contact" className="hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 sm:inline-flex">
              {t.nav.cta}
            </a>
            <button type="button" onClick={() => setMobileOpen((prev) => !prev)} className="inline-flex rounded-full border border-slate-400/40 p-2 lg:hidden" aria-label="Open navigation">
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border-t border-white/10 bg-white/95 px-6 py-4 dark:bg-[#02020b]/95 lg:hidden"
            >
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { href: "#products", label: t.nav.products },
                  { href: "#experience", label: t.nav.experience },
                  { href: "#industries", label: t.nav.industries },
                  { href: "#analytics", label: t.nav.analytics },
                  { href: "#roi", label: t.nav.roi },
                  { href: "#contact", label: t.nav.contact },
                ].map((item) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-2 py-2 transition hover:bg-black/5 dark:hover:bg-white/5">
                    {item.label}
                  </a>
                ))}
                <button type="button" onClick={() => { setChatOpen(true); setMobileOpen(false); }} className="rounded-xl px-2 py-2 text-left transition hover:bg-black/5 dark:hover:bg-white/5">
                  {t.nav.chat}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="home" className="overflow-hidden">
        <section className="relative min-h-screen pt-28">
          <img src={visuals.hero} alt="LUMEVIO platforma NFC, AI i phygital dla retailu" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040019]/90 via-[#040019]/80 to-[#040019]/40" />

          <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }} animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-300">
                <Sparkles className="h-3.5 w-3.5" />
                {t.hero.badge}
              </div>

              <div className="flex items-center">
                <img src={visuals.logo} alt="LUMEVIO logo" className="h-20 w-auto object-contain sm:h-24 md:h-32 lg:h-40" />
              </div>

              <h1 className="bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400 bg-clip-text text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-6xl">
                {t.hero.title}
              </h1>

              <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">{t.hero.subtitle}</p>

              <div className="flex flex-wrap gap-3">
                {t.hero.stats.map((item) => (
                  <div key={item} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#products" className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-7 py-3 font-semibold text-slate-950">
                  {t.hero.ctaPrimary}
                </a>
                <a href="#contact" className="rounded-full border border-white/60 px-7 py-3 font-semibold text-white">
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </motion.div>

            <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }} animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }} transition={{ duration: 0.9 }} className="relative">
              <div className="grid gap-6">
                <FloatingCloud3D />
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: ShieldCheck, label: "Enterprise-ready" },
                    { icon: Globe2, label: "Global rollout" },
                    { icon: Zap, label: "Real-time actions" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-white backdrop-blur-xl">
                      <item.icon className="mb-3 h-5 w-5 text-cyan-300" />
                      <div className="text-sm font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-4 rounded-[32px] border border-slate-200/70 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5 md:grid-cols-3 md:p-8">
            <div className="md:col-span-1">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-500">LUMEVIO</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t.trust.title}</h2>
            </div>
            <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
              {t.trust.points.map((point) => (
                <div key={point} className="rounded-[24px] border border-slate-200/70 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#0b1422]">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-cyan-400" />
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-fuchsia-500">
              LUMEVIO Ecosystem
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">{t.products.title}</h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{t.products.subtitle}</p>
          </motion.div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {productColumns.map((product, index) => (
              <motion.article key={product.name} initial={shouldReduceMotion ? {} : { opacity: 0, y: 28 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.12, duration: 0.55 }} className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 shadow-[0_20px_80px_-30px_rgba(168,85,247,0.35)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_100px_-30px_rgba(34,211,238,0.28)] dark:border-white/10 dark:bg-[#0a0a1d]/95">
                <div className="overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                </div>

                <div className="p-7">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{product.name}</h3>
                      <p className="mt-2 text-sm font-medium text-fuchsia-500">{product.tag}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {product.points.map((point, pointIndex) => (
                      <div key={point} className="flex items-start gap-3">
                        <div className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-[10px] font-bold text-slate-950">
                          {pointIndex + 1}
                        </div>
                        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="experience" className="bg-[#05051b] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} className="max-w-3xl">
              <h2 className="text-3xl font-semibold sm:text-5xl">{t.experience.title}</h2>
              <p className="mt-4 text-slate-300">{t.experience.subtitle}</p>
            </motion.div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Why it matters
                </div>

                <h3 className="text-3xl font-semibold leading-tight text-white">{t.experience.sideTitle}</h3>

                <div className="mt-8 grid gap-4">
                  {t.experience.sidePoints.map((item) => (
                    <div key={item} className="rounded-[24px] border border-white/10 bg-[#0b1422] p-4">
                      <div className="text-sm leading-6 text-white/70">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              <SmartShelfDemo labels={t.experience.labels} shelf={t.experience.shelf} trigger={t.experience.trigger} tap={t.experience.tap} live={t.experience.live} lang={lang} />
            </div>
          </div>
        </section>

        <section id="industries" className="relative overflow-hidden bg-[#05051b] py-20 text-white sm:py-24">
          <div className="relative mx-auto max-w-7xl px-6">
            <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200">
                {t.industries.badge}
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-5xl">{t.industries.title}</h2>
              <p className="mt-5 text-base leading-8 text-white/65 sm:text-lg">{t.industries.subtitle}</p>
            </motion.div>

            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {t.industries.items.map((item, index) => (
                <motion.article key={item.name} initial={shouldReduceMotion ? {} : { opacity: 0, y: 28 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.12, duration: 0.55 }} whileHover={shouldReduceMotion ? undefined : { y: -8 }} className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_20px_80px_-30px_rgba(34,211,238,0.15)] backdrop-blur-xl">
                  <div className="overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-60 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-7">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight text-white">{item.name}</h3>
                        <p className="mt-2 text-sm font-medium text-cyan-200">{item.tag}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {item.points.map((point, pointIndex) => (
                        <div key={point} className="flex items-start gap-3">
                          <div className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-[10px] font-bold text-slate-950">
                            {pointIndex + 1}
                          </div>
                          <p className="text-sm leading-7 text-white/70">{point}</p>
                        </div>
                      ))}
                    </div>

                    <button type="button" className="mt-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/30 hover:text-cyan-200">
                      {t.industries.cta}
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="roi" className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-fuchsia-500/5 dark:border-white/10 dark:bg-[#081120] md:p-8">
              <h2 className="text-3xl font-semibold sm:text-5xl">{t.roi.title}</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{t.roi.subtitle}</p>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  { label: t.roi.stores, value: stores, setValue: setStores, min: 1, max: 500, step: 1 },
                  { label: t.roi.customers, value: customers, setValue: setCustomers, min: 10, max: 1000, step: 10 },
                  { label: t.roi.basket, value: basket, setValue: setBasket, min: 5, max: 500, step: 1 },
                  { label: t.roi.uplift, value: uplift, setValue: setUplift, min: 1, max: 20, step: 1 },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#0b1422]">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-white/70">
                      <span>{item.label}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                    <input type="range" min={item.min} max={item.max} step={item.step} value={item.value} onChange={(e) => item.setValue(Number(e.target.value))} className="w-full accent-cyan-400" />
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-500 dark:text-white/60">{t.roi.note}</p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[24px] border border-white/10 bg-[#081423] p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-cyan-200">
                  <BarChart3 className="h-4 w-4" />
                  {t.roi.monthly}
                </div>
                <div className="text-3xl font-semibold text-white">{formatCurrency(roi.monthly)}</div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#081423] p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-cyan-200">
                  <TrendingUp className="h-4 w-4" />
                  {t.roi.yearly}
                </div>
                <div className="text-3xl font-semibold text-white">{formatCurrency(roi.yearly)}</div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#081423] p-5">
                <div className="mb-2 flex items-center gap-2 text-sm text-cyan-200">
                  <MessageCircle className="h-4 w-4" />
                  {t.roi.interactions}
                </div>
                <div className="text-3xl font-semibold text-white">{Math.round(roi.interactions).toLocaleString(lang === "pl" ? "pl-PL" : "en-US")}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="analytics" className="relative overflow-hidden bg-[#05051b] py-20 text-white sm:py-24">
          <div className="relative mx-auto max-w-7xl px-6">
            <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                LUMEVIO Intelligence Layer
              </div>
              <h2 className="text-3xl font-semibold sm:text-5xl">{t.analytics.title}</h2>
              <p className="mt-4 text-slate-300">{t.analytics.subtitle}</p>
            </motion.div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100 backdrop-blur-xl">
              <motion.div animate={shouldReduceMotion ? {} : { x: ["0%", "-12%", "0%"] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="whitespace-nowrap">
                {t.analytics.ticker}
              </motion.div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: t.analytics.cards[0], value: liveStats.interactions, icon: Radio },
                { label: t.analytics.cards[1], value: liveStats.locations, icon: Globe2 },
                { label: t.analytics.cards[2], value: liveStats.leads, icon: UserRound },
                { label: t.analytics.cards[3], value: `${liveStats.engagement}%`, icon: TrendingUp },
              ].map((card, index) => (
                <motion.div key={card.label} initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }} className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#081120] p-5 shadow-[0_20px_70px_-25px_rgba(0,0,0,0.55)]">
                  <div className="mb-3 inline-flex rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-200">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm text-white/55">{card.label}</div>
                  <motion.div key={String(card.value)} initial={shouldReduceMotion ? {} : { opacity: 0.4, y: 8 }} animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    {typeof card.value === "number" ? card.value.toLocaleString(lang === "pl" ? "pl-PL" : "en-US") : card.value}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#081120] md:p-8">
            <h2 className="text-3xl font-semibold sm:text-5xl">{t.faq.title}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.faq.items.map((item) => (
                <div key={item.q} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#0b1422]">
                  <div className="text-base font-semibold">{item.q}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden border-t border-white/10 py-24 text-white">
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-widest text-cyan-200">
                    LUMEVIO CONTACT
                  </div>
                  <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">{t.contact.title}</h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-white/60">{t.contact.subtitle}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="mb-2 text-xs uppercase tracking-widest text-cyan-300/70">Company</div>
                    <div className="space-y-2 text-sm text-white/80">
                      <p>{COMPANY.brand}</p>
                      <p>NIP: {COMPANY.nip}</p>
                      <p>REGON: {COMPANY.regon}</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="mb-2 text-xs uppercase tracking-widest text-cyan-300/70">Direct</div>
                    <div className="space-y-2 text-sm text-white/80">
                      <p><a href={`tel:${COMPANY.phone.replace(/\s+/g, "")}`} className="hover:text-cyan-300">{COMPANY.phone}</a></p>
                      <p><a href={COMPANY.website} target="_blank" rel="noreferrer" className="hover:text-cyan-300">{COMPANY.website.replace("https://", "")}</a></p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="mb-3 text-xs uppercase tracking-widest text-cyan-300/70">Email</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickEmailList.map((email) => (
                      <a key={email} href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:border-cyan-300/30 hover:text-cyan-200">
                        <Mail className="h-4 w-4" />
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={shouldReduceMotion ? {} : { opacity: 0, x: 30 }} whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-fuchsia-500/10 to-cyan-400/10 blur-2xl" />
                <ContactForm t={t.contact} lang={lang} />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f5f5f7] text-slate-700 dark:border-white/10 dark:bg-[#050512] dark:text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="space-y-3 border-b border-slate-300 pb-6 text-xs leading-6 text-slate-500 dark:border-white/10 dark:text-slate-400">
            {t.footer.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>

          <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-5">
                <img src={visuals.logo} alt="LUMEVIO logo" className="h-20 w-auto object-contain sm:h-24 md:h-28 lg:h-32" />
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold text-slate-900 dark:text-white">{t.footer.columns.explore.title}</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {t.footer.columns.explore.links.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="transition-colors hover:text-slate-900 dark:hover:text-white">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold text-slate-900 dark:text-white">{t.footer.columns.products.title}</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {t.footer.columns.products.links.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-semibold text-slate-900 dark:text-white">{t.footer.columns.company.title}</h4>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {t.footer.columns.company.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-6 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p>{t.footer.legal.copyright}</p>
              <p className="text-slate-600 dark:text-slate-300">{t.footer.legal.region}</p>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {chatOpen && (
            <motion.section
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              className="w-[min(92vw,380px)] rounded-2xl border border-white/20 bg-[#090921]/95 p-4 text-white shadow-2xl shadow-fuchsia-500/20 backdrop-blur"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">{t.chat.title}</p>
                <button type="button" className="text-xs text-slate-300" onClick={() => setChatOpen(false)}>
                  {t.chat.close}
                </button>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {t.chat.quick.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      sendChat(undefined, item);
                      const key = item.toLowerCase();
                      const target = Object.entries(sectionHrefByQuickIntent).find(([intent]) => key.includes(intent))?.[1];
                      if (target) document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:border-cyan-300/30 hover:text-cyan-200"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div ref={chatScrollRef} className="max-h-64 space-y-2 overflow-y-auto pr-1 text-sm">
                {messages.map((message) => (
                  <div key={message.id} className={message.role === "assistant" ? "text-cyan-200" : "text-fuchsia-200"}>
                    {message.text}
                  </div>
                ))}
              </div>

              <form onSubmit={sendChat} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder={t.chat.placeholder}
                  className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-xs outline-none ring-fuchsia-500 focus:ring-2"
                />
                <button type="submit" className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950">
                  {t.chat.send}
                </button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>

        {!chatOpen && (
          <button type="button" onClick={() => setChatOpen(true)} className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/30">
            {t.chat.open}
          </button>
        )}
      </div>
    </div>
  );
}
