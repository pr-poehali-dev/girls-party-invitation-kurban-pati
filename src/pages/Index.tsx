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

function Bow({ className = "" }: { className?: string }) {
  return <span className={`inline-block text-2xl animate-float-bow ${className}`}>🎀</span>;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-box flex flex-col items-center justify-center px-3 py-3 min-w-[64px] md:min-w-[80px]">
      <span className="font-display text-3xl md:text-5xl text-rose-custom font-light leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] md:text-xs mt-1 text-[hsl(340,12%,55%)] uppercase tracking-widest font-medium">
        {label}
      </span>
    </div>
  );
}

const activities = [
  { emoji: "🍽️", text: "Халяльный фуршет" },
  { emoji: "🎮", text: "Игры и конкурсы" },
  { emoji: "✨", text: "Интерактивные зоны" },
  { emoji: "🏺", text: "Аукцион" },
  { emoji: "👑", text: "Королева вечера" },
  { emoji: "🎂", text: "Задувание свечей" },
  { emoji: "🎭", text: "Шуточные выступления" },
  { emoji: "🎁", text: "Призы и подарки" },
  { emoji: "📷", text: "Фотограф" },
  { emoji: "🌿", text: "Хна" },
  { emoji: "📸", text: "Полароид" },
  { emoji: "💗", text: "Атмосфера сестринства" },
];

const schedule31 = [
  { time: "17:00", text: "Заезд, знакомство с локацией", icon: "🏡" },
  { time: "18:00", text: "Открытие вечера", icon: "🌸" },
  { time: "19:00", text: "Выступления спикеров, работа интерактивных зон", icon: "🎤" },
  { time: "20:00", text: "Аукцион, объявление королевы вечера", icon: "👑" },
  { time: "до 22:00", text: "Выезд участниц без ночёвки", icon: "🚗" },
  { time: "22:00", text: "Сосиски у мангала, бенгальские огни 🎇", icon: "🔥" },
  { time: "24:00", text: "Баня, душевные разговоры", icon: "🧖‍♀️" },
];

const schedule1 = [
  { time: "10:00", text: "Завтрак", icon: "☕" },
  { time: "11:00", text: "Выезд", icon: "🌅" },
];

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
      const res = await fetch("https://functions.poehali.dev/4423475b-7db5-4f71-b78a-b95904974adb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
      else setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "hsl(35, 50%, 98%)" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(255,250,247,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid hsl(340 30% 92%)" }}>
        <span className="font-display text-xl text-rose-custom font-light tracking-widest">КУРБАН ПАТИ</span>
        <button onClick={scrollToForm}
          className="btn-shine text-sm font-medium px-4 py-2 rounded-full text-white"
          style={{ background: "linear-gradient(135deg, hsl(340,50%,72%), hsl(340,55%,65%))" }}>
          Подать заявку
        </button>
      </nav>

      {/* HERO */}
      <section className="hero-gradient noise-overlay min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-12 px-5 relative overflow-hidden">
        <div className="absolute top-20 left-6 animate-float-bow opacity-30 text-4xl">🎀</div>
        <div className="absolute top-36 right-8 animate-float-bow opacity-25 text-3xl" style={{ animationDelay: "1s" }}>🌸</div>
        <div className="absolute bottom-24 left-10 opacity-20 text-4xl animate-float-bow" style={{ animationDelay: "2s" }}>🌷</div>
        <div className="absolute bottom-36 right-6 opacity-25 text-3xl animate-float-bow" style={{ animationDelay: "0.5s" }}>🎀</div>
        <div className="absolute top-1/2 left-2 opacity-10 text-5xl">✨</div>
        <div className="absolute top-1/3 right-2 opacity-10 text-5xl">✨</div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="animate-fade-up opacity-0-init delay-100 text-xs md:text-sm uppercase tracking-[0.3em] text-[hsl(340,40%,65%)] mb-4 font-medium">
            31 мая 2026 · с. Юськи
          </p>
          <h1 className="animate-fade-up opacity-0-init delay-200 font-display text-6xl md:text-9xl font-light tracking-widest text-[hsl(340,25%,22%)] leading-tight mb-0">
            КУРБАН
          </h1>
          <h1 className="animate-fade-up opacity-0-init delay-300 font-display text-6xl md:text-9xl font-light tracking-widest text-rose-custom leading-tight mb-6">
            ПАТИ
          </h1>
          <p className="animate-fade-up opacity-0-init delay-400 text-[hsl(340,15%,40%)] text-sm md:text-lg max-w-lg mx-auto leading-relaxed mb-10">
            Закрытый халяльный вечер для девушек-мусульманок<br />в честь Курбан-байрама
          </p>

          <div className="animate-fade-up opacity-0-init delay-500 flex gap-2 md:gap-3 justify-center mb-10">
            <CountdownBox value={countdown.days} label="дней" />
            <CountdownBox value={countdown.hours} label="часов" />
            <CountdownBox value={countdown.minutes} label="минут" />
            <CountdownBox value={countdown.seconds} label="секунд" />
          </div>

          <div className="animate-fade-up opacity-0-init delay-600 flex flex-col items-center gap-3">
            <button onClick={scrollToForm}
              className="btn-shine text-white font-medium text-base md:text-lg px-8 md:px-10 py-3 md:py-4 rounded-full shadow-lg transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, hsl(340,50%,72%), hsl(340,55%,62%))", boxShadow: "0 8px 32px hsl(340 50% 72% / 0.4)" }}>
              Подать заявку ✨
            </button>
            <span className="text-xs md:text-sm text-[hsl(340,20%,58%)]">Количество мест ограничено</span>
          </div>
        </div>
      </section>

      {/* PARTY IMAGE BANNER */}
      <section className="overflow-hidden">
        <div className="relative h-56 md:h-80 overflow-hidden">
          <img src={PARTY_IMG} alt="Декор вечера" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(35,50%,98%) 0%, transparent 55%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(35,50%,98%) 0%, transparent 30%)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 md:py-20 px-5" id="about">
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <Bow />
            <h2 className="font-display text-3xl md:text-5xl text-[hsl(340,25%,22%)] font-light mt-3 mb-4">О мероприятии</h2>
            <hr className="divider-rose max-w-xs mx-auto" />
          </div>

          <div className="reveal rounded-3xl p-6 md:p-10 mb-6"
            style={{ background: "rgba(255,255,255,0.75)", border: "1px solid hsl(340 30% 90%)", backdropFilter: "blur(8px)" }}>
            <p className="text-[hsl(340,15%,35%)] text-sm md:text-base leading-relaxed">
              <span className="font-semibold text-rose-custom">«КУРБАН ПАТИ»</span> — это закрытый халяльный вечер для девушек-мусульманок, посвящённый празднику Курбан-байрам. Мы создаём безопасное и красивое пространство, где можно отдохнуть, пообщаться, почувствовать атмосферу сестринства и вспомнить смысл праздника.
            </p>
          </div>

          <div className="reveal grid md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-3xl p-6 card-hover"
              style={{ background: "linear-gradient(135deg, hsl(340,40%,97%), hsl(340,30%,93%))", border: "1px solid hsl(340 30% 88%)" }}>
              <div className="text-3xl mb-3">💭</div>
              <h3 className="font-display text-xl text-[hsl(340,25%,22%)] font-medium mb-2">Проблема</h3>
              <p className="text-[hsl(340,12%,42%)] text-sm leading-relaxed">
                Сейчас почти нет халяльных праздничных мероприятий для девушек-мусульманок — чаще всего такие форматы делают только для детей. Мы хотим создать современный, красивый и дозволенный формат отдыха.
              </p>
            </div>
            <div className="rounded-3xl p-6 card-hover"
              style={{ background: "linear-gradient(135deg, hsl(35,50%,97%), hsl(35,40%,93%))", border: "1px solid hsl(35 30% 88%)" }}>
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-display text-xl text-[hsl(340,25%,22%)] font-medium mb-2">Цель</h3>
              <p className="text-[hsl(340,12%,42%)] text-sm leading-relaxed">
                Сформировать у девушек представление о роли и значении праздника Курбан-байрам через красивый, современный и полностью халяльный формат вечера.
              </p>
            </div>
          </div>

          <div className="reveal rounded-3xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.65)", border: "1px solid hsl(340 30% 90%)" }}>
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-display text-xl text-[hsl(340,25%,22%)] font-medium mb-4">Задачи вечера</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "Создать возможность для халяльного отдыха",
                "Укрепить сестринство между девушками",
                "Напомнить историю праздника",
                "Обсудить темы покорности Аллаху и щедрости",
                "Показать, что праздник может быть красивым и халяльным",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-rose-custom mt-0.5 text-sm">✦</span>
                  <span className="text-sm text-[hsl(340,12%,40%)]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="py-16 md:py-20 px-5" id="info"
        style={{ background: "linear-gradient(160deg, hsl(340,40%,97%), hsl(35,50%,97%))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <Bow />
            <h2 className="font-display text-3xl md:text-5xl text-[hsl(340,25%,22%)] font-light mt-3 mb-4">Информация</h2>
            <hr className="divider-rose max-w-xs mx-auto" />
          </div>

          <div className="reveal mb-8 rounded-3xl overflow-hidden shadow-lg">
            <img src={HOUSE_IMG} alt="Место проведения" className="w-full h-48 md:h-64 object-cover" />
            <div className="p-4 md:p-5" style={{ background: "rgba(255,255,255,0.9)" }}>
              <div className="flex items-center gap-2 text-[hsl(340,25%,30%)]">
                <Icon name="MapPin" size={16} className="text-rose-custom flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">с. Юськи, ул. Октябрьская, 50</span>
              </div>
              <p className="text-xs text-[hsl(340,12%,50%)] mt-1 ml-6">Двухэтажный дом · Возможен трансфер от Соборной мечети</p>
            </div>
          </div>

          {/* Yandex Map */}
          <div className="reveal mb-8 rounded-3xl overflow-hidden shadow-lg" style={{ border: "1px solid hsl(340 25% 88%)" }}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=52.971&pt=52.971,56.820&z=15&l=map&text=%D1%81.%20%D0%AE%D1%81%D1%8C%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%2C%2050"
              width="100%"
              height="300"
              style={{ border: "none", display: "block" }}
              allowFullScreen
              title="Карта проведения мероприятия"
            />
            <div className="p-4 flex items-center justify-between flex-wrap gap-3"
              style={{ background: "rgba(255,255,255,0.95)" }}>
              <div>
                <p className="text-sm font-medium text-[hsl(340,20%,28%)]">🗺️ Как добраться</p>
                <p className="text-xs text-[hsl(340,12%,50%)] mt-0.5">с. Юськи, ул. Октябрьская, 50 · трансфер от Соборной мечети</p>
              </div>
              <a
                href="https://yandex.ru/maps/?text=%D1%81.%20%D0%AE%D1%81%D1%8C%D0%BA%D0%B8%2C%20%D1%83%D0%BB.%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%2C%2050"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium px-4 py-2 rounded-full text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(340,50%,72%), hsl(340,55%,62%))" }}>
                Открыть в Яндекс Картах
              </a>
            </div>
          </div>

          <div className="reveal grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "Calendar", val: "31 мая", sub: "2026 года" },
              { icon: "Clock", val: "17:00", sub: "Начало заезда" },
              { icon: "Users", val: "20–40", sub: "Участниц" },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-4 text-center card-hover"
                style={{ background: "rgba(255,255,255,0.85)", border: "1px solid hsl(340 25% 88%)" }}>
                <Icon name={item.icon} size={20} className="text-rose-custom mx-auto mb-2" />
                <div className="font-display text-lg md:text-2xl text-[hsl(340,25%,22%)]">{item.val}</div>
                <div className="text-[10px] md:text-xs text-[hsl(340,12%,50%)] mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="reveal grid md:grid-cols-2 gap-4">
            <div className="rounded-3xl p-6 card-hover"
              style={{ background: "rgba(255,255,255,0.85)", border: "2px solid hsl(340 35% 87%)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[hsl(340,40%,60%)] font-medium">Без ночёвки</span>
                <span className="font-display text-3xl text-rose-custom font-light">1500₽</span>
              </div>
              <ul className="space-y-1.5 text-sm text-[hsl(340,12%,40%)]">
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Возраст 16+</li>
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Выезд до 22:00</li>
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Полная программа</li>
              </ul>
            </div>
            <div className="rounded-3xl p-6 card-hover relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(340,40%,96%), hsl(35,40%,96%))", border: "2px solid hsl(340 40% 78%)" }}>
              <div className="absolute top-3 right-3 text-xs bg-rose-custom text-white px-2.5 py-0.5 rounded-full font-medium">
                Популярный
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-[hsl(340,40%,60%)] font-medium">С ночёвкой</span>
                <span className="font-display text-3xl text-rose-custom font-light">2500₽</span>
              </div>
              <ul className="space-y-1.5 text-sm text-[hsl(340,12%,40%)]">
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Возраст 18+</li>
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Выезд 1 июня в 11:00</li>
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Двухместные комнаты</li>
                <li className="flex items-center gap-2"><span className="text-rose-custom text-xs">✦</span> Ночная программа + завтрак</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DRESSCODE */}
      <section className="py-16 md:py-20 px-5" id="dresscode">
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <Bow />
            <h2 className="font-display text-3xl md:text-5xl text-[hsl(340,25%,22%)] font-light mt-3 mb-4">Дресс-код</h2>
            <hr className="divider-rose max-w-xs mx-auto" />
          </div>

          <div className="reveal grid md:grid-cols-2 gap-6 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src={DRESS_IMG} alt="Вечерние платья" className="w-full h-64 md:h-80 object-cover" />
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.85)", border: "1px solid hsl(340 25% 88%)" }}>
                <div className="text-2xl mb-2">👗</div>
                <h3 className="font-display text-xl text-[hsl(340,25%,22%)] mb-2">Вечерний образ</h3>
                <p className="text-sm text-[hsl(340,12%,42%)] leading-relaxed">
                  Вечерние платья и праздничные причёски. Мероприятие полностью женское, без присутствия мужчин — поэтому можно будет снять хиджабы.
                </p>
              </div>
              <div className="rounded-2xl p-5 border-l-4"
                style={{ background: "hsl(340,40%,97%)", borderLeftColor: "hsl(340,45%,72%)" }}>
                <div className="text-2xl mb-2">📌</div>
                <h3 className="font-display text-xl text-[hsl(340,25%,22%)] mb-2">Важно</h3>
                <p className="text-sm text-[hsl(340,25%,38%)] leading-relaxed font-medium">
                  Платья должны закрывать аурат от пупка до колен.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="py-16 md:py-20 px-5" id="activities"
        style={{ background: "linear-gradient(160deg, hsl(35,50%,97%), hsl(340,40%,97%))" }}>
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <Bow />
            <h2 className="font-display text-3xl md:text-5xl text-[hsl(340,25%,22%)] font-light mt-3 mb-4">Что будет на вечере</h2>
            <hr className="divider-rose max-w-xs mx-auto" />
          </div>

          <div className="reveal grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {activities.map((a, i) => (
              <div key={i} className="rounded-2xl p-3 md:p-4 text-center card-hover"
                style={{ background: "rgba(255,255,255,0.8)", border: "1px solid hsl(340 25% 90%)" }}>
                <div className="text-2xl md:text-3xl mb-2">{a.emoji}</div>
                <p className="text-xs md:text-sm text-[hsl(340,15%,38%)] font-medium leading-tight">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="py-16 md:py-20 px-5" id="program">
        <div className="max-w-3xl mx-auto">
          <div className="reveal text-center mb-12">
            <Bow />
            <h2 className="font-display text-3xl md:text-5xl text-[hsl(340,25%,22%)] font-light mt-3 mb-4">Программа</h2>
            <hr className="divider-rose max-w-xs mx-auto" />
          </div>

          <div className="reveal mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: "linear-gradient(135deg, hsl(340,50%,72%), hsl(340,55%,62%))" }}>31</div>
              <h3 className="font-display text-2xl text-[hsl(340,25%,22%)]">31 мая</h3>
            </div>
            <div className="relative ml-4">
              <div className="absolute left-1 top-2 bottom-2 w-px" style={{ background: "hsl(340 35% 85%)" }} />
              <div className="space-y-3">
                {schedule31.map((item, i) => (
                  <div key={i} className="flex gap-4 pl-8 relative">
                    <div className="absolute left-[-3px] top-3 w-[9px] h-[9px] rounded-full border-2"
                      style={{ borderColor: "hsl(340,45%,72%)", background: "hsl(35,50%,98%)" }} />
                    <div className="flex-1 rounded-2xl p-3 md:p-4 card-hover"
                      style={{ background: "rgba(255,255,255,0.75)", border: "1px solid hsl(340 25% 90%)" }}>
                      <div className="flex items-start gap-2 md:gap-3">
                        <span className="text-lg md:text-xl">{item.icon}</span>
                        <div>
                          <span className="text-rose-custom font-semibold text-xs md:text-sm">{item.time}</span>
                          <p className="text-xs md:text-sm text-[hsl(340,12%,38%)] mt-0.5">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: "linear-gradient(135deg, hsl(38,55%,65%), hsl(38,60%,55%))" }}>1</div>
              <h3 className="font-display text-2xl text-[hsl(340,25%,22%)]">1 июня · С ночёвкой</h3>
            </div>
            <div className="relative ml-4">
              <div className="absolute left-1 top-2 bottom-2 w-px" style={{ background: "hsl(38 35% 82%)" }} />
              <div className="space-y-3">
                {schedule1.map((item, i) => (
                  <div key={i} className="flex gap-4 pl-8 relative">
                    <div className="absolute left-[-3px] top-3 w-[9px] h-[9px] rounded-full border-2"
                      style={{ borderColor: "hsl(38,55%,65%)", background: "hsl(35,50%,98%)" }} />
                    <div className="flex-1 rounded-2xl p-3 md:p-4 card-hover"
                      style={{ background: "rgba(255,255,255,0.75)", border: "1px solid hsl(38 25% 90%)" }}>
                      <div className="flex items-start gap-2 md:gap-3">
                        <span className="text-lg md:text-xl">{item.icon}</span>
                        <div>
                          <span className="font-semibold text-xs md:text-sm" style={{ color: "hsl(38,50%,50%)" }}>{item.time}</span>
                          <p className="text-xs md:text-sm text-[hsl(340,12%,38%)] mt-0.5">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal rounded-3xl p-6 md:p-8 text-center"
            style={{ background: "linear-gradient(135deg, hsl(250,30%,20%), hsl(290,30%,18%))", border: "1px solid hsl(340 30% 35%)" }}>
            <div className="text-4xl mb-3">🌙</div>
            <h3 className="font-display text-2xl text-white font-light mb-3">Ночная программа</h3>
            <p className="text-white/50 text-sm mb-5">Для тех, кто остаётся с ночёвкой</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["🎇 Бенгальские огни", "🔥 Сосиски на мангале", "🧖‍♀️ Баня", "💬 Душевные посиделки", "🛏️ Двухместные комнаты", "☕ Завтрак утром"].map((t, i) => (
                <div key={i} className="text-xs md:text-sm text-white/80 rounded-xl py-2 px-2"
                  style={{ background: "rgba(255,255,255,0.08)" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INVITATION */}
      <section className="py-14 px-5" style={{ background: "linear-gradient(160deg, hsl(340,40%,96%), hsl(35,45%,96%))" }}>
        <div className="max-w-2xl mx-auto">
          <div className="reveal text-center rounded-3xl p-7 md:p-12"
            style={{ background: "rgba(255,255,255,0.75)", border: "1px solid hsl(340 30% 88%)", backdropFilter: "blur(8px)" }}>
            <div className="text-4xl mb-4">💌</div>
            <h3 className="font-display text-2xl md:text-3xl text-[hsl(340,25%,22%)] font-light mb-4">Личное приглашение</h3>
            <p className="text-[hsl(340,12%,42%)] text-sm md:text-base leading-relaxed mb-5">
              После подтверждения участия тебе будет отправлено <strong className="text-[hsl(340,30%,35%)]">бумажное приглашение</strong>. Мы не публикуем это мероприятие массово — приглашение передаётся лично, чтобы сохранить атмосферу уюта, безопасности и сестринства.
            </p>
            <p className="text-sm text-[hsl(340,25%,50%)] italic font-display text-base md:text-lg">
              «Это закрытый вечер для своих. Если у тебя есть подруга, которой близка такая атмосфера, ты можешь передать приглашение ей»
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 md:py-20 px-5" id="form">
        <div className="max-w-xl mx-auto">
          <div className="reveal text-center mb-10">
            <Bow />
            <h2 className="font-display text-3xl md:text-5xl text-[hsl(340,25%,22%)] font-light mt-3 mb-4">Подать заявку</h2>
            <hr className="divider-rose max-w-xs mx-auto" />
          </div>

          {submitted ? (
            <div className="reveal rounded-3xl p-7 md:p-12 text-center"
              style={{ background: "rgba(255,255,255,0.9)", border: "2px solid hsl(340 40% 82%)", backdropFilter: "blur(8px)" }}>
              <div className="text-5xl mb-4">✨</div>
              <h3 className="font-display text-2xl md:text-3xl text-[hsl(340,25%,22%)] font-light mb-4">Заявка отправлена!</h3>
              <p className="text-[hsl(340,12%,38%)] text-sm leading-relaxed mb-5">
                Для подтверждения участия необходимо внести оплату:
              </p>
              <div className="rounded-2xl p-4 mb-5 space-y-1" style={{ background: "hsl(340,40%,97%)", border: "1px solid hsl(340 30% 88%)" }}>
                <p className="text-rose-custom font-semibold text-sm">1500₽ — без ночёвки</p>
                <p className="text-rose-custom font-semibold text-sm">2500₽ — с ночёвкой</p>
              </div>
              <p className="text-sm text-[hsl(340,12%,40%)] mb-1">
                Оплата на <strong>Т-Банк</strong> по номеру телефона:
              </p>
              <p className="font-display text-2xl text-[hsl(340,30%,30%)] mb-5">+7 909 715 5294</p>
              <p className="text-xs md:text-sm text-[hsl(340,12%,42%)] leading-relaxed">
                После оплаты отправь чек организаторам в Telegram. После подтверждения тебе будет отправлено бумажное приглашение ✨
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reveal rounded-3xl p-6 md:p-10 space-y-4"
              style={{ background: "rgba(255,255,255,0.88)", border: "1px solid hsl(340 30% 88%)", backdropFilter: "blur(8px)" }}>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-1.5 font-medium">Имя</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Твоё имя"
                    className="input-rose w-full px-4 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,70%)]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-1.5 font-medium">Возраст</label>
                  <input required type="number" min="16" max="99" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}
                    placeholder="Твой возраст"
                    className="input-rose w-full px-4 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,70%)]" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-1.5 font-medium">Телефон</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="input-rose w-full px-4 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,70%)]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-1.5 font-medium">Telegram</label>
                  <input required value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })}
                    placeholder="@username"
                    className="input-rose w-full px-4 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,70%)]" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-2 font-medium">Формат участия</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "no-sleep", label: "Без ночёвки", price: "1500₽", age: "16+" },
                    { val: "sleep", label: "С ночёвкой", price: "2500₽", age: "18+" },
                  ].map(opt => (
                    <label key={opt.val} className={`cursor-pointer rounded-2xl p-3 border-2 transition-all ${form.format === opt.val ? "border-rose-custom" : "border-[hsl(340,25%,88%)]"}`}
                      style={{ background: form.format === opt.val ? "hsl(340,40%,96%)" : "rgba(255,255,255,0.6)" }}>
                      <input type="radio" name="format" value={opt.val} checked={form.format === opt.val} onChange={e => setForm({ ...form, format: e.target.value })} className="sr-only" />
                      <div className="font-medium text-sm text-[hsl(340,20%,30%)]">{opt.label}</div>
                      <div className="text-rose-custom font-display text-xl">{opt.price}</div>
                      <div className="text-xs text-[hsl(340,12%,55%)]">{opt.age}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-2 font-medium">Нужен трансфер от Соборной мечети?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ val: "yes", label: "Да" }, { val: "no", label: "Нет" }].map(opt => (
                    <label key={opt.val} className={`cursor-pointer rounded-2xl p-3 border-2 text-center transition-all ${form.transfer === opt.val ? "border-rose-custom" : "border-[hsl(340,25%,88%)]"}`}
                      style={{ background: form.transfer === opt.val ? "hsl(340,40%,96%)" : "rgba(255,255,255,0.6)" }}>
                      <input type="radio" name="transfer" value={opt.val} checked={form.transfer === opt.val} onChange={e => setForm({ ...form, transfer: e.target.value })} className="sr-only" />
                      <span className="text-sm font-medium text-[hsl(340,20%,30%)]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(340,20%,55%)] mb-1.5 font-medium">Адрес для бумажного приглашения</label>
                <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Город, улица, дом, квартира, индекс"
                  rows={2}
                  className="input-rose w-full px-4 py-2.5 text-sm text-[hsl(340,15%,30%)] placeholder:text-[hsl(340,10%,70%)] resize-none" />
              </div>

              <button type="submit" disabled={loading}
                className="btn-shine w-full py-3.5 rounded-2xl text-white font-semibold text-base transition-transform hover:scale-[1.02] disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, hsl(340,50%,72%), hsl(340,55%,62%))", boxShadow: "0 6px 24px hsl(340 50% 72% / 0.4)" }}>
                {loading ? "Отправляем..." : "Отправить заявку ✨"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-5 text-center" style={{ background: "hsl(340,30%,22%)" }}>
        <Bow className="opacity-60" />
        <p className="font-display text-2xl text-white/90 font-light mt-3 mb-2 tracking-widest">КУРБАН ПАТИ</p>
        <p className="text-white/50 text-sm mb-4">31 мая 2026 · с. Юськи</p>
        <p className="text-white/35 text-xs italic leading-relaxed max-w-sm mx-auto">
          Это закрытый вечер для своих. Если у тебя есть подруга, которой близка такая атмосфера — передай ей приглашение.
        </p>
      </footer>
    </div>
  );
}