import { useState, useEffect } from "react";
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

interface FormData {
  name: string;
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
    name: "", age: "", phone: "", telegram: "", format: "no-sleep", transfer: "no", address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://functions.poehali.dev/4423475b-7db5-4f71-b78a-b95904974adb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (_e) {
      // ignore
    } finally {
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" }), 50);
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
          <p className="animate-fade-up opacity-0-init delay-400 text-[hsl(340,14%,44%)] md:text-base max-w-sm mx-auto leading-relaxed mb-10 text-lg">Приглашаем тебя на закрытый халяльный вечер для девушек-мусульманок 💗</p>

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
          <div className="reveal text-center">
            <p className="font-display text-lg md:text-xl text-[hsl(340,18%,32%)] leading-relaxed italic font-light mb-4">Мы создаём пространство, где мусульманки смогут провести Курбан-байрам в атмосфере сестринства, красоты и халяльного отдыха.

«КУРБАН ПАТИ» — это возможность вместе вспомнить смысл праздника, поговорить о покорности Аллаху, щедрости, искренности и ценности жертвенности ради Него.</p>
            <p className="text-sm text-[hsl(340,10%,52%)]">
              Это не массовая вечеринка, а тёплый закрытый вечер для своих.
            </p>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="py-16 md:py-20 px-5" id="activities"
        style={{ background: "linear-gradient(160deg, hsl(340,30%,97%), hsl(35,40%,97%))" }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Тебя ждёт</SectionTitle>
          <div className="reveal grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
            {[
              "Халяльный фуршет",
              "Игры и конкурсы",
              "Интерактивные зоны",
              "Аукцион",
              "Королева вечера",
              "Задувание свечей на торте",
              "Шуточные выступления",
              "Призы и подарки",
              "Фотограф",
              "Хна",
              "Полароид",
              "Атмосфера сестринства",
            ].map((t, i) => (
              <div key={i} className="rounded-2xl px-3 py-3 text-center text-sm text-[hsl(340,14%,38%)]"
                style={{ background: "rgba(255,255,255,0.8)", border: "1px solid hsl(340 20% 90%)" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="py-16 md:py-20 px-5" id="info">
        <div className="max-w-2xl mx-auto">
          <SectionTitle>Место и время</SectionTitle>

          <div className="reveal mb-8 rounded-3xl overflow-hidden" style={{ border: "1px solid hsl(340 20% 88%)" }}>
            <img src={HOUSE_IMG} alt="Место проведения" className="w-full h-48 md:h-60 object-cover" />
            <div className="p-5" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="MapPin" size={15} className="text-rose-custom flex-shrink-0" />
                <span className="text-sm font-medium text-[hsl(340,20%,28%)]">с. Юськи, ул. Октябрьская, 50</span>
              </div>
              <p className="text-xs text-[hsl(340,10%,52%)] ml-5">Двухэтажный дом · Возможен трансфер от Соборной мечети</p>
            </div>
          </div>

          <div className="reveal grid grid-cols-3 gap-3 mb-8">
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

          {/* Map */}
          <div className="reveal rounded-3xl overflow-hidden" style={{ border: "1px solid hsl(340 20% 88%)" }}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=52.971&pt=52.971,56.820&z=15&l=map&text=%D1%81.%20%D0%AE%D1%81%D1%8C%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%2C%2050"
              width="100%" height="260" style={{ border: "none", display: "block" }}
              allowFullScreen title="Карта" />
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.95)" }}>
              <p className="text-xs text-[hsl(340,10%,50%)]">с. Юськи, ул. Октябрьская, 50</p>
              <a href="https://yandex.ru/maps/?text=%D1%81.%20%D0%AE%D1%81%D1%8C%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%2C%2050"
                target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium px-3 py-1.5 rounded-full text-white"
                style={{ background: "hsl(340,48%,68%)" }}>
                Открыть карту
              </a>
            </div>
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
                { time: "18:00", text: "Открытие вечера" },
                { time: "19:00", text: "Выступления, интерактивные зоны" },
                { time: "20:00", text: "Аукцион, королева вечера" },
                { time: "до 22:00", text: "Выезд участниц без ночёвки" },
                { time: "22:00", text: "Сосиски у мангала, бенгальские огни", night: true },
                { time: "24:00", text: "Баня, душевные разговоры", night: true },
              ].map((item, i) => (
                <div key={i} className="flex items-baseline gap-4 py-3"
                  style={{ borderBottom: "1px solid hsl(340 20% 91%)" }}>
                  <span className="text-xs font-medium text-rose-custom w-16 flex-shrink-0 tabular-nums">{item.time}</span>
                  <span className="text-sm text-[hsl(340,12%,38%)] flex-1">{item.text}</span>
                  {item.night && (
                    <span className="text-[10px] text-[hsl(340,30%,62%)] border rounded-full px-2 py-0.5 flex-shrink-0"
                      style={{ borderColor: "hsl(340,30%,82%)" }}>с ночёвкой</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,62%)] mb-4 font-medium">1 июня · с ночёвкой</p>
            <div className="space-y-0">
              {[
                { time: "10:00", text: "Завтрак" },
                { time: "11:00", text: "Выезд" },
              ].map((item, i) => (
                <div key={i} className="flex items-baseline gap-4 py-3"
                  style={{ borderBottom: "1px solid hsl(340 20% 91%)" }}>
                  <span className="text-xs font-medium text-rose-custom w-16 flex-shrink-0 tabular-nums">{item.time}</span>
                  <span className="text-sm text-[hsl(340,12%,38%)]">{item.text}</span>
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
                <p className="text-sm text-[hsl(340,12%,40%)] leading-relaxed mb-3">
                  Вечерние платья и праздничные причёски. Мероприятие полностью женское, без присутствия мужчин — поэтому можно снять хиджабы.
                </p>
                <div className="h-px" style={{ background: "hsl(340 25% 90%)" }} />
              </div>
              <div className="rounded-2xl p-4" style={{ background: "hsl(340,35%,97%)", border: "1px solid hsl(340 30% 88%)" }}>
                <p className="text-xs text-[hsl(340,20%,50%)] uppercase tracking-wider mb-1">Важно</p>
                <p className="text-sm text-[hsl(340,22%,32%)] font-medium leading-relaxed">
                  Платья должны закрывать аурат от пупка до колен.
                </p>
              </div>
            </div>
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
                  <p className="font-display text-3xl text-rose-custom font-light">1500₽</p>
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
              <div className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full text-white"
                style={{ background: "hsl(340,48%,68%)" }}>Популярный</div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[hsl(340,35%,60%)] mb-1">С ночёвкой</p>
                  <p className="font-display text-3xl text-rose-custom font-light">2500₽</p>
                </div>
                <span className="text-xs text-[hsl(340,12%,55%)] mt-1">18+</span>
              </div>
              <div className="h-px mb-4" style={{ background: "hsl(340 25% 87%)" }} />
              <ul className="space-y-1.5 text-xs text-[hsl(340,12%,45%)]">
                <li>Выезд 1 июня в 11:00</li>
                <li>Двухместные комнаты</li>
                <li>Мангал, баня, завтрак</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INVITATION */}
      <section className="py-14 px-5">
        <div className="max-w-xl mx-auto">
          <div className="reveal text-center rounded-3xl p-8 md:p-10"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid hsl(340 25% 88%)" }}>
            <p className="text-sm text-[hsl(340,12%,42%)] leading-relaxed mb-4">
              После подтверждения участия тебе будет отправлено <span className="text-[hsl(340,28%,35%)] font-medium">бумажное приглашение</span>. Мы не публикуем мероприятие массово — приглашение передаётся лично, чтобы сохранить атмосферу уюта и сестринства.
            </p>
            <p className="text-xs text-[hsl(340,18%,55%)] italic font-display text-base">Если у тебя есть подруга, которой близка такая атмосфера — ты можешь передать ей приглашение</p>
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
                  Переведи оплату — <span className="font-semibold text-rose-custom">{form.format === "sleep" ? "2500₽" : "1500₽"}</span> — на Т-Банк по номеру:
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
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Имя</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Твоё имя"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Возраст</label>
                  <input required type="number" min="16" max="99" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                    placeholder="Возраст"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Телефон</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Telegram</label>
                  <input required value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })}
                    placeholder="@username"
                    className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-2">Формат</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "no-sleep", label: "Без ночёвки", price: "1500₽" },
                    { val: "sleep", label: "С ночёвкой", price: "2500₽" },
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
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-2">Трансфер от Соборной мечети?</label>
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
                <label className="block text-[10px] uppercase tracking-widest text-[hsl(340,18%,58%)] mb-1.5">Адрес для приглашения</label>
                <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Город, улица, дом, квартира, индекс"
                  rows={2}
                  className="input-rose w-full px-3.5 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,72%)] resize-none" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: "hsl(340,48%,68%)" }}>
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 text-center" style={{ background: "hsl(340,28%,20%)" }}>
        <p className="font-display text-xl text-white/80 font-light tracking-widest mb-2">КУРБАН ПАТИ</p>
        <p className="text-white/40 text-xs mb-3">31 мая 2026 · с. Юськи</p>
        <p className="text-white/30 text-xs italic max-w-xs mx-auto leading-relaxed">
          Это закрытый вечер для своих. Передай приглашение подруге, которой близка такая атмосфера.
        </p>
      </footer>
    </div>
  );
}