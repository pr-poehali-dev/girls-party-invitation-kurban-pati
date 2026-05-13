import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PARTY_DATE = new Date("2026-05-31T17:00:00");

const HOUSE_IMG = "https://cdn.poehali.dev/projects/ca29f423-8335-4892-a51b-0de0bf0dd129/bucket/f0df47b2-c9bd-4042-83c1-35551879aed2.png";
const PARTY_IMG = "https://cdn.poehali.dev/projects/ca29f423-8335-4892-a51b-0de0bf0dd129/files/eb704ecd-38a6-4709-9f05-7915535fa7a1.jpg";
const DRESS_IMG = "https://cdn.poehali.dev/projects/ca29f423-8335-4892-a51b-0de0bf0dd129/files/b930be80-74f0-4302-9890-6c03a2706e19.jpg";

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="reveal text-center mb-12">
      <h2 className="font-display text-3xl md:text-4xl text-[hsl(340,25%,22%)] font-light tracking-wide mb-3">
        {children}
      </h2>
      <div className="w-12 h-px mx-auto" style={{ background: "hsl(340,45%,72%)" }} />
    </div>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-3 py-3 min-w-[64px] md:min-w-[76px]"
      style={{ background: "rgba(255,255,255,0.6)", border: "1px solid hsl(340 40% 86%)", borderRadius: "14px" }}>
      <span className="font-display text-3xl md:text-4xl text-rose-custom font-light leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] md:text-[11px] mt-1 text-[hsl(340,12%,58%)] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  let result = "+7";
  if (d.length > 1) result += " (" + d.slice(1, 4);
  if (d.length >= 4) result += ") " + d.slice(4, 7);
  if (d.length >= 7) result += "-" + d.slice(7, 9);
  if (d.length >= 9) result += "-" + d.slice(9, 11);
  return result;
}

function normalizeTelegram(raw: string): string {
  let val = raw.trim();
  if (val.startsWith("@")) val = val.slice(1);
  val = val.replace(/[^\w]/g, (ch) => ch === "_" ? "_" : "");
  return val ? "@" + val : "";
}

interface FormData {
  name: string;
  surname: string;
  age: string;
  phone: string;
  telegram: string;
  format: string;
  transfer: string;
  address: string;
}

export default function Index() {
  useReveal();
  const countdown = useCountdown(PARTY_DATE);
  const [form, setForm] = useState<FormData>({
    name: "", surname: "", age: "", phone: "", telegram: "", format: "no-sleep", transfer: "no", address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setForm({ ...form, phone: formatted });
  };

  const handleTelegramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, telegram: e.target.value });
  };

  const handleTelegramBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, telegram: normalizeTelegram(e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("https://functions.poehali.dev/4423475b-7db5-4f71-b78a-b95904974adb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          telegram: normalizeTelegram(form.telegram),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const scrollToForm = () => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ background: "hsl(35, 50%, 98%)" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(255,250,247,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid hsl(340 30% 92%)" }}>
        <span className="font-display text-lg text-[hsl(340,25%,28%)] font-light tracking-widest">КУРБАН ПАТИ</span>
        <button onClick={scrollToForm}
          className="text-xs font-medium px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90"
          style={{ background: "hsl(340,48%,68%)" }}>
          Подать заявку
        </button>
      </nav>

      {/* HERO */}
      <section className="hero-gradient min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-12 px-5 relative overflow-hidden">
        <div className="absolute top-20 left-6 opacity-20 text-3xl animate-float-bow">🎀</div>
        <div className="absolute top-40 right-8 opacity-15 text-2xl animate-float-bow" style={{ animationDelay: "1.2s" }}>🌸</div>
        <div className="absolute bottom-28 left-10 opacity-15 text-3xl animate-float-bow" style={{ animationDelay: "2s" }}>🌷</div>
        <div className="absolute bottom-40 right-6 opacity-20 text-2xl animate-float-bow" style={{ animationDelay: "0.6s" }}>🎀</div>

        <div className="relative z-10 max-w-xl mx-auto">
          <p className="animate-fade-up opacity-0-init delay-100 uppercase tracking-[0.35em] text-[hsl(340,38%,62%)] mb-5 text-xl">клуб Halal girl</p>
          <h1 className="animate-fade-up opacity-0-init delay-200 font-display font-light tracking-widest text-[hsl(340,25%,20%)] leading-none mb-0"
            style={{ fontSize: "clamp(3.5rem, 15vw, 8rem)" }}>
            КУРБАН
          </h1>
          <h1 className="animate-fade-up opacity-0-init delay-300 font-display font-light tracking-widest text-rose-custom leading-none mb-7"
            style={{ fontSize: "clamp(3.5rem, 15vw, 8rem)" }}>
            ПАТИ
          </h1>
          <p className="animate-fade-up opacity-0-init delay-350 text-[hsl(340,35%,58%)] max-w-sm mx-auto mb-3 text-xl" style={{ fontFamily: "serif", direction: "rtl" }}>السلام عليكم ورحمة الله وبركاته</p>
          <p className="animate-fade-up opacity-0-init delay-400 text-[hsl(340,14%,44%)] md:text-base max-w-sm mx-auto leading-relaxed mb-10 text-lg">Приглашаем тебя на закрытый халяльный вечер для девушек-мусульманок 💗

31 МАЯ - 1 ИЮНЯ</p>

          <div className="animate-fade-up opacity-0-init delay-500 flex gap-2 md:gap-3 justify-center mb-10">
            <CountdownBox value={countdown.days} label="дней" />
            <CountdownBox value={countdown.hours} label="часов" />
            <CountdownBox value={countdown.minutes} label="минут" />
            <CountdownBox value={countdown.seconds} label="секунд" />
          </div>

          <div className="animate-fade-up opacity-0-init delay-600 flex flex-col items-center gap-2">
            <button onClick={scrollToForm}
              className="text-white font-medium text-sm md:text-base px-8 py-3 rounded-full transition-opacity hover:opacity-90"
              style={{ background: "hsl(340,48%,68%)", boxShadow: "0 6px 24px hsl(340 48% 68% / 0.35)" }}>
              Подать заявку
            </button>
            <span className="text-xs text-[hsl(340,18%,60%)]">Количество мест ограничено</span>
          </div>
        </div>
      </section>

      {/* PARTY IMAGE */}
      <section className="overflow-hidden">
        <div className="relative h-48 md:h-72">
          <img src={PARTY_IMG} alt="Декор вечера" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(35,50%,98%) 0%, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(35,50%,98%) 0%, transparent 25%)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 md:py-20 px-5" id="about">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>О мероприятии</SectionTitle>
          <div className="reveal text-center space-y-4">
            <p className="text-lg md:text-xl text-[hsl(340,18%,32%)] leading-relaxed font-light">
              Мы создаём пространство, где мусульманки смогут провести Курбан-байрам в атмосфере сестринства, красоты и халяльного отдыха ✨
            </p>
            <p className="text-sm text-[hsl(340,10%,52%)]">
              «КУРБАН ПАТИ» — это возможность вместе вспомнить смысл праздника, поговорить о покорности Аллаху, щедрости, искренности и ценности жертвенности ради Него.
            </p>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative overflow-hidden py-20 px-5">
        <img
          src="https://cdn.poehali.dev/projects/ca29f423-8335-4892-a51b-0de0bf0dd129/files/91ced3ad-ac6f-4d47-b515-a393d517e68f.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(20,12,8,0.38)" }} />
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <p className="text-white mb-3 text-4xl opacity-30 font-display leading-none">"</p>
          <p className="text-lg md:text-xl text-white leading-relaxed italic font-display mb-4" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
            Верующие в своей любви, милосердии и сострадании друг к другу подобны одному телу
          </p>
          <p className="text-sm tracking-wide" style={{ color: "rgba(255,255,255,0.65)" }}>— аль-Бухари, Муслим</p>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="py-16 md:py-20 px-5" id="activities"
        style={{ background: "linear-gradient(160deg, hsl(340,30%,97%), hsl(35,40%,97%))" }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Тебя ждёт</SectionTitle>

          <div className="reveal space-y-8">
            {/* Основной вечер */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,62%)] mb-4 font-medium text-center">ОСНОвная программа</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "уютный двухэтажный дом за городом",
                  "атмосфера сестринства и халяльного отдыха",
                  "эстетичное оформление в девчачьем стиле",
                  "халяльный фуршет и авторский торт",
                  "беседа о смысле Курбан-байрама, покорности и щедрости",
                  "весёлые игры, конкурсы и интерактивы",
                  "TED Talk с выступлениями участниц",
                  "аукцион эксклюзивных подарков",
                  "создание общего арт-объекта с помощью красок",
                  "полароид и обмен открытками",
                  "рисование хной",
                  "выбор Королевы вечера",
                  "бумажное приглашение",
                  "секретный бонус",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-2xl px-4 py-3 text-sm text-[hsl(340,14%,38%)]"
                    style={{ background: "rgba(255,255,255,0.8)", border: "1px solid hsl(340 20% 90%)" }}>
                    <span className="text-rose-custom flex-shrink-0">🤍</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ночёвка */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,62%)] mb-4 font-medium text-center">ночёвка (дополнительно)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "сосиски на мангале",
                  "бенгальские огни",
                  "баня",
                  "душевные разговоры",
                  "размещение в комфортных номерах",
                  "завтрак",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-2xl px-4 py-3 text-sm text-[hsl(340,14%,38%)]"
                    style={{ background: "rgba(255,255,255,0.8)", border: "1px solid hsl(340 20% 90%)" }}>
                    <span className="text-rose-custom flex-shrink-0">🌙</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="py-16 md:py-20 px-5" id="info">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Место и время</SectionTitle>

          {/* Дом + карта в одном блоке */}
          <div className="reveal mb-8 rounded-3xl overflow-hidden" style={{ border: "1px solid hsl(340 20% 88%)" }}>
            <div className="grid md:grid-cols-2">
              <div className="relative">
                <img src={HOUSE_IMG} alt="Место проведения" className="w-full h-44 md:h-full object-cover" />
                <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.3))" }} />
              </div>
              <div className="relative" style={{ minHeight: "200px" }}>
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=52.971&pt=52.971,56.820&z=15&l=map&text=%D1%81.%20%D0%AE%D1%81%D1%8C%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%81%D0%BA%D0%B0%D1%8F%2C%2050"
                  width="100%" height="100%" style={{ border: "none", display: "block", minHeight: "200px", position: "absolute", inset: 0 }}
                  allowFullScreen title="Карта" />
              </div>
            </div>
            <div className="p-5" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="MapPin" size={15} className="text-rose-custom flex-shrink-0" />
                    <span className="text-sm font-medium text-[hsl(340,20%,28%)]">с. Юськи, ул. Октябрьская, 50</span>
                  </div>
                  <p className="text-xs text-[hsl(340,10%,52%)] ml-5">Двухэтажный дом · Возможен трансфер от Соборной мечети</p>
                </div>
                <a href="https://yandex.ru/maps/?text=%D1%81.%20%D0%AE%D1%81%D1%8C%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%81%D0%BA%D0%B0%D1%8F%2C%2050"
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium px-3 py-1.5 rounded-full text-white flex-shrink-0"
                  style={{ background: "hsl(340,48%,68%)" }}>
                  Открыть карту
                </a>
              </div>
            </div>
          </div>

          <div className="reveal grid grid-cols-3 gap-3">
            {[
              { label: "Дата", val: "31 мая 2026" },
              { label: "Заезд", val: "17:00" },
              { label: "Участниц", val: "20–40" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.85)", border: "1px solid hsl(340 20% 90%)" }}>
                <div className="text-xs text-[hsl(340,12%,55%)] mb-1 uppercase tracking-wider">{item.label}</div>
                <div className="font-display text-lg md:text-xl text-[hsl(340,22%,24%)] font-light">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="py-16 md:py-20 px-5" id="program"
        style={{ background: "linear-gradient(160deg, hsl(35,40%,97%), hsl(340,30%,97%))" }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Программа</SectionTitle>

          <div className="reveal mb-8">
            <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,62%)] mb-4 font-medium">31 мая</p>
            <div className="space-y-0">
              {[
                { time: "17:00", text: "Заезд, знакомство с локацией" },
                { time: "18:00", text: "Открытие вечера, беседа о значении Курбан Байрама" },
                { time: "19:00", text: "Ted Talk, интерактивные зоны" },
                { time: "20:00", text: "Аукцион эксклюзивных подарков, выбор Королевы вечера" },
                { time: "до 22:00", text: "Выезд участниц без ночёвки", grey: true },
                { time: "22:00", text: "Сосиски у мангала, бенгальские огни", night: true },
                { time: "23:00", text: "Баня, душевные разговоры", night: true },
              ].map((item, i) => (
                <div key={i} className="flex items-baseline gap-4 py-3"
                  style={{ borderBottom: "1px solid hsl(340 20% 91%)" }}>
                  <span className={`text-xs font-medium w-16 flex-shrink-0 tabular-nums ${item.grey ? "text-[hsl(340,8%,62%)]" : "text-rose-custom"}`}>{item.time}</span>
                  <span className={`text-sm flex-1 ${item.grey ? "text-[hsl(340,8%,60%)]" : "text-[hsl(340,12%,38%)]"}`}>{item.text}</span>
                  {item.night && (
                    <span className="text-[10px] text-[hsl(340,30%,62%)] border rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{ borderColor: "hsl(340,30%,82%)" }}>с ночёвкой</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,62%)] mb-4 font-medium">1 июня</p>
            <div className="space-y-0">
              {[
                { time: "10:00", text: "Завтрак", badge: "с ночёвкой" },
                { time: "11:00", text: "Выезд", badge: "с ночёвкой" },
              ].map((item, i) => (
                <div key={i} className="flex items-baseline gap-4 py-3"
                  style={{ borderBottom: "1px solid hsl(340 20% 91%)" }}>
                  <span className="text-xs font-medium text-rose-custom w-16 flex-shrink-0 tabular-nums">{item.time}</span>
                  <span className="text-sm text-[hsl(340,12%,38%)] flex-1">{item.text}</span>
                  <span className="text-[10px] text-[hsl(340,30%,62%)] border rounded-full px-2 py-0.5 flex-shrink-0"
                    style={{ borderColor: "hsl(340,30%,82%)" }}>{item.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DRESSCODE */}
      <section className="py-16 md:py-20 px-5" id="dresscode">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Дресс-код</SectionTitle>

          <div className="reveal grid md:grid-cols-2 gap-6 items-center">
            <div className="rounded-3xl overflow-hidden" style={{ border: "1px solid hsl(340 20% 88%)" }}>
              <img src={DRESS_IMG} alt="Вечерние платья" className="w-full h-60 md:h-72 object-cover" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[hsl(340,12%,40%)] leading-relaxed mb-3 text-center">Вечерние платья и праздничные причёски. Мероприятие полностью женское, без присутствия мужчин — поэтому можно снять хиджабы</p>
                <div className="h-px" style={{ background: "hsl(340 25% 90%)" }} />
              </div>
              <div className="rounded-2xl p-4" style={{ background: "hsl(340,35%,97%)", border: "1px solid hsl(340 30% 88%)" }}>
                <p className="text-xs text-[hsl(340,20%,50%)] uppercase tracking-wider mb-1 text-center">Важно</p>
                <p className="text-sm text-[hsl(340,22%,32%)] font-medium leading-relaxed text-center">Платья должны закрывать аурат от пупка до колен</p>
              </div>
            </div>
          </div>

          <div className="reveal mt-8 rounded-2xl p-5 text-center" style={{ background: "hsl(35,45%,96%)", border: "1px solid hsl(35 35% 86%)" }}>
            <p className="text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-2 font-medium">Просим приходить без детей</p>
            <p className="text-sm text-[hsl(340,15%,40%)] leading-relaxed">Посвяти этот вечер себе — оставь детей дома и позволь себе отдохнуть по-настоящему</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 md:py-20 px-5"
        style={{ background: "linear-gradient(160deg, hsl(340,30%,97%), hsl(35,40%,97%))" }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Форматы участия</SectionTitle>

          <div className="reveal grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid hsl(340 25% 88%)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,60%)] mb-1">Без ночёвки</p>
                  <p className="font-display text-3xl text-rose-custom font-light">4000₽</p>
                </div>
                <span className="text-xs text-[hsl(340,12%,55%)] mt-1">16+</span>
              </div>
              <div className="h-px mb-4" style={{ background: "hsl(340 20% 90%)" }} />
              <ul className="space-y-1.5 text-xs text-[hsl(340,12%,45%)]">
                <li>Выезд 31 мая до 22:00</li>
                <li>Полная программа вечера</li>
              </ul>
            </div>
            <div className="rounded-3xl p-6 relative"
              style={{ background: "linear-gradient(135deg, hsl(340,38%,96%), hsl(35,38%,96%))", border: "1.5px solid hsl(340 38% 80%)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,60%)]">С ночёвкой</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full text-white flex-shrink-0"
                      style={{ background: "hsl(340,48%,68%)" }}>Популярный</span>
                  </div>
                  <p className="font-display text-3xl text-rose-custom font-light">5500₽</p>
                </div>
                <span className="text-xs text-[hsl(340,12%,55%)] mt-1">18+</span>
              </div>
              <div className="h-px mb-4" style={{ background: "hsl(340 25% 86%)" }} />
              <ul className="space-y-1.5 text-xs text-[hsl(340,12%,45%)]">
                <li>Выезд 1 июня в 11:00</li>
                <li>Полная программа вечера</li>
                <li>Сосиски у мангала</li>
                <li>Баня, душевные разговоры</li>
                <li>Размещение в номерах</li>
                <li>Завтрак</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-10 px-5">
        <div className="max-w-xl mx-auto">
          <div className="reveal text-center rounded-3xl p-7"
            style={{ background: "linear-gradient(135deg, hsl(340,35%,97%), hsl(35,40%,97%))", border: "1px solid hsl(340 25% 88%)" }}>
            <p className="text-sm text-[hsl(340,14%,42%)] leading-relaxed mb-5">
              🤍&nbsp; Мы будем рады партнёрам и спонсорам, которые захотят поддержать проект и сделать его доступнее для участниц
            </p>
            <a href="https://t.me/a_ya_writer" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "hsl(340,48%,68%)" }}>
              Поддержать проект
            </a>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 md:py-20 px-5" id="form"
        style={{ background: "linear-gradient(160deg, hsl(340,30%,97%), hsl(35,38%,97%))" }}>
        <div className="max-w-xl mx-auto">
          <SectionTitle>Подать заявку</SectionTitle>

          {submitted ? (
            <div className="rounded-3xl p-8 text-center"
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid hsl(340 30% 86%)" }}>
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="font-display text-2xl text-[hsl(340,22%,24%)] font-light mb-2">Заявка принята</h3>
              <p className="text-sm text-[hsl(340,10%,50%)] mb-6">Спасибо! Ждём тебя на вечере 🎀</p>

              <div className="rounded-2xl p-5 mb-5 text-left space-y-3"
                style={{ background: "hsl(340,35%,97%)", border: "1px solid hsl(340 25% 88%)" }}>
                <p className="text-xs uppercase tracking-widest text-[hsl(340,30%,58%)] mb-2">Для закрепления места</p>
                <p className="text-sm text-[hsl(340,12%,38%)] leading-relaxed">
                  Переведи оплату — <span className="font-semibold text-rose-custom">{form.format === "sleep" ? "5500₽" : "4000₽"}</span> — на Т-Банк по номеру:
                </p>
                <p className="font-display text-2xl text-[hsl(340,28%,28%)]">8 909 055 79 88</p>
                <p className="text-xs text-[hsl(340,10%,50%)]">Айя Васильевна Р.</p>
                <div className="h-px" style={{ background: "hsl(340 20% 90%)" }} />
                <p className="text-xs text-[hsl(340,12%,45%)] leading-relaxed">
                  В комментарии к переводу укажи <span className="font-medium text-[hsl(340,20%,35%)]">своё имя</span> — за кого перевод.
                </p>
              </div>

              <div className="rounded-2xl p-5 mb-5 text-left space-y-2"
                style={{ background: "hsl(35,45%,97%)", border: "1px solid hsl(35 30% 88%)" }}>
                <p className="text-xs uppercase tracking-widest text-[hsl(340,30%,58%)] mb-2">Важно</p>
                <p className="text-xs text-[hsl(340,12%,42%)] leading-relaxed">
                  Если в течение суток не придёт сообщение о подтверждении — напиши нам в Telegram по тому же номеру: <span className="font-medium text-[hsl(340,22%,34%)]">+7 909 055 79 88</span>
                </p>
              </div>

              <a href="https://t.me/+tJYyXO_DsdJmNDVi" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "hsl(340,48%,68%)" }}>
                Вступить в чат праздника в Telegram
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reveal rounded-3xl p-6 md:p-8 space-y-4"
              style={{ background: "rgba(255,255,255,0.9)", border: "1px solid hsl(340 25% 88%)" }}>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Имя *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Твоё имя"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Фамилия *</label>
                  <input required value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })}
                    placeholder="Фамилия"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Возраст *</label>
                <input required type="number" min="16" max="99" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                  placeholder="Возраст"
                  className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Телефон *</label>
                  <input required type="tel" value={form.phone} onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Telegram *</label>
                  <input required value={form.telegram} onChange={handleTelegramChange} onBlur={handleTelegramBlur}
                    placeholder="@username"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-2">Формат *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "no-sleep", label: "Без ночёвки", price: "4000₽" },
                    { val: "sleep", label: "С ночёвкой", price: "5500₽" },
                  ].map(opt => (
                    <label key={opt.val}
                      className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all ${form.format === opt.val ? "border-rose-custom" : "border-[hsl(340,20%,88%)]"}`}
                      style={{ background: form.format === opt.val ? "hsl(340,38%,97%)" : "transparent" }}>
                      <input type="radio" name="format" value={opt.val} checked={form.format === opt.val}
                        onChange={e => setForm({ ...form, format: e.target.value })} className="sr-only" />
                      <div className="text-sm font-medium text-[hsl(340,18%,30%)]">{opt.label}</div>
                      <div className="font-display text-lg text-rose-custom">{opt.price}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-2">Трансфер от Соборной мечети? *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ val: "yes", label: "Да" }, { val: "no", label: "Нет" }].map(opt => (
                    <label key={opt.val}
                      className={`cursor-pointer rounded-2xl py-2.5 text-center border-2 text-sm font-medium transition-all ${form.transfer === opt.val ? "border-rose-custom text-rose-custom" : "border-[hsl(340,20%,88%)] text-[hsl(340,12%,45%)]"}`}
                      style={{ background: form.transfer === opt.val ? "hsl(340,38%,97%)" : "transparent" }}>
                      <input type="radio" name="transfer" value={opt.val} checked={form.transfer === opt.val}
                        onChange={e => setForm({ ...form, transfer: e.target.value })} className="sr-only" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Адрес для приглашения *</label>
                <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Город, улица, дом, квартира, индекс"
                  rows={2}
                  className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)] resize-none" />
              </div>

              {error && (
                <div className="rounded-2xl px-4 py-3 text-sm text-center" style={{ background: "hsl(0,60%,97%)", border: "1px solid hsl(0,40%,88%)", color: "hsl(0,50%,45%)" }}>
                  Ошибка отправки. Попробуй ещё раз или напиши нам в Telegram: +7 909 055 79 88
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "hsl(340,48%,68%)" }}>
                {loading ? "Отправляем…" : "Отправить заявку"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center px-2">
            <span className="text-2xl">💌</span>
            <p className="text-sm text-[hsl(340,12%,48%)] leading-relaxed mt-2">
              После подтверждения участия тебе будет отправлено <span className="text-[hsl(340,28%,35%)] font-medium">бумажное приглашение</span>. Мы не публикуем мероприятие массово — приглашение передаётся лично, чтобы сохранить атмосферу уюта и сестринства.
            </p>
            <p className="text-xs text-[hsl(340,15%,58%)] italic font-display mt-2">Если у тебя есть подруга, которой близка такая атмосфера — ты можешь передать ей приглашение</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 text-center"
        style={{ borderTop: "1px solid hsl(340 25% 90%)" }}>
        <p className="font-display text-xl text-[hsl(340,25%,32%)] font-light tracking-widest mb-2">КУРБАН ПАТИ</p>
        <p className="text-xs text-[hsl(340,10%,55%)]">клуб Halal girl · 31 мая 2026</p>
      </footer>

    </div>
  );
}