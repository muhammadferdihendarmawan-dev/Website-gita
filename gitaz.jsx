import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

// ─── Palette ────────────────────────────────────────────────────────────────
// Warm earth tones + dusty pastels: sage, blush sand, terracotta, warm ivory
const COLORS = {
  bg: "#F9F5F0",
  bgDeep: "#F2EBE1",
  sand: "#E8D5BC",
  blush: "#D4A99A",
  sage: "#8FA68C",
  terracotta: "#C17F6B",
  ink: "#3A2E27",
  inkLight: "#7A6860",
  gold: "#C9A96E",
  petal1: "#E8C9B8",
  petal2: "#D4B8A8",
  petal3: "#C4A898",
};

// ─── Love Things ────────────────────────────────────────────────────────────
const LOVE_THINGS = [
  { emoji: "🌿", title: "Senyummu", text: "Senyummu bisa mengubah hari terburuk menjadi hari yang paling indah. Setiap kali kamu tersenyum, rasanya waktu berhenti sejenak." },
  { emoji: "🍵", title: "Cara Kamu Peduli", text: "Kamu selalu tahu kapan aku butuh secangkir teh hangat, pelukan, atau sekadar seseorang yang mendengarkan. Kamu hadir tanpa harus diminta." },
  { emoji: "✨", title: "Matamu", text: "Di matamu ada kedalaman yang membuat aku ingin terus melihat. Ada kejujuran dan kehangatan yang selalu membuatku merasa aman." },
  { emoji: "🌙", title: "Tawamu", text: "Tawamu adalah lagu favoritku. Jujur, aku sering sengaja melawak hanya untuk mendengarnya lagi dan lagi." },
  { emoji: "📖", title: "Rasa Ingin Tahumu", text: "Kamu tidak pernah berhenti belajar. Kecintaanmu pada hal-hal baru selalu menginspirasi aku untuk menjadi versi terbaik diriku." },
  { emoji: "🌸", title: "Kelembutanmu", text: "Di dunia yang seringkali kasar, kamu adalah kelembutan yang nyata. Cara kamu berbicara, menyentuh, dan menyayangi — semuanya terasa seperti puisi." },
  { emoji: "🕊️", title: "Kejujuranmu", text: "Kamu tidak pernah takut berkata jujur, bahkan ketika itu sulit. Aku menghargai keberanianmu untuk selalu tulus." },
  { emoji: "🍂", title: "Kenyamanan Bersamamu", text: "Bersamamu adalah rumah. Tidak perlu berpura-pura, tidak perlu menjadi siapa pun selain diriku sendiri." },
  { emoji: "🎶", title: "Seleramu", text: "Musik yang kamu suka, film yang kamu tonton, buku yang kamu baca — semuanya mencerminkan betapa indahnya dunia di dalam kepalamu." },
  { emoji: "💫", title: "Kamu Secara Keseluruhan", text: "Bukan satu dua hal yang membuatku jatuh cinta — melainkan seluruh dirimu. Setiap kelebihan, setiap kekurangan kecil, semuanya membuatmu sempurna untukku." },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function useLoveCounter(startDate) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = Date.now() - new Date(startDate).getTime();
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ d, h, m, s });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [startDate]);
  return time;
}

// ─── Floating Petals ────────────────────────────────────────────────────────
function Petals() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 12 + Math.random() * 10,
    size: 6 + Math.random() * 10,
    color: [COLORS.petal1, COLORS.petal2, COLORS.petal3, COLORS.sand, COLORS.blush][Math.floor(Math.random() * 5)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: -40,
            width: p.size,
            height: p.size * 1.3,
            borderRadius: "50% 0 50% 0",
            backgroundColor: p.color,
            opacity: 0.35,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(p.id) * 60, -Math.sin(p.id) * 40, 0],
            rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            opacity: [0, 0.35, 0.35, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Section Reveal ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Counter Block ───────────────────────────────────────────────────────────
function CounterBlock({ value, label }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          color: COLORS.terracotta,
          fontWeight: 600,
          lineHeight: 1,
          minWidth: "2.5ch",
          textAlign: "center",
        }}
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", color: COLORS.inkLight, textTransform: "uppercase" }}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Swipe Cards ─────────────────────────────────────────────────────────────
function SwipeCards() {
  const [cards, setCards] = useState(LOVE_THINGS.map((_, i) => i));
  const [gone, setGone] = useState(new Set());
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleDragEnd = (e, info, index) => {
    if (Math.abs(info.offset.x) > 80) {
      setGone((prev) => new Set([...prev, index]));
    }
  };

  const reset = () => {
    setGone(new Set());
    setCards(LOVE_THINGS.map((_, i) => i));
  };

  const visibleCards = cards.filter((i) => !gone.has(i)).slice(-4);
  const allGone = cards.every((i) => gone.has(i));

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: 320, height: 400 }}>
        <AnimatePresence>
          {allGone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl"
              style={{ background: COLORS.bgDeep, border: `1.5px solid ${COLORS.sand}` }}
            >
              <span style={{ fontSize: "2.5rem" }}>🌷</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: COLORS.ink, marginTop: 12, textAlign: "center", padding: "0 24px" }}>
                Kamu sudah membaca semuanya, Gita.
              </p>
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: 20,
                  padding: "10px 28px",
                  borderRadius: 50,
                  background: COLORS.terracotta,
                  color: "#fff",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Baca Lagi
              </motion.button>
            </motion.div>
          ) : (
            visibleCards.map((index, stackPos) => {
              const item = LOVE_THINGS[index];
              const isTop = stackPos === visibleCards.length - 1;
              const offset = (visibleCards.length - 1 - stackPos) * 6;
              return (
                <motion.div
                  key={index}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => handleDragEnd(e, info, index)}
                  initial={{ scale: 1 - offset * 0.015, y: offset * 4, opacity: 0 }}
                  animate={{ scale: 1 - offset * 0.015, y: offset * 4, opacity: 1 }}
                  exit={{ x: 400, opacity: 0, rotate: 20 }}
                  whileDrag={{ rotate: 4, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    background: `linear-gradient(145deg, ${COLORS.bg}, ${COLORS.bgDeep})`,
                    border: `1.5px solid ${COLORS.sand}`,
                    padding: "36px 28px",
                    cursor: isTop ? "grab" : "default",
                    boxShadow: isTop
                      ? `0 20px 60px rgba(58,46,39,0.10), 0 2px 8px rgba(193,127,107,0.08)`
                      : `0 8px 24px rgba(58,46,39,0.06)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 16,
                    zIndex: stackPos,
                  }}
                >
                  <span style={{ fontSize: "2.4rem" }}>{item.emoji}</span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: COLORS.ink, fontWeight: 600, margin: 0 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", color: COLORS.inkLight, lineHeight: 1.8, margin: 0 }}>
                    {item.text}
                  </p>
                  {isTop && (
                    <p style={{ fontSize: "0.72rem", color: COLORS.blush, letterSpacing: "0.12em", marginTop: 8, fontFamily: "'Lato', sans-serif" }}>
                      ← geser untuk lanjut →
                    </p>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      <p style={{ marginTop: 16, fontSize: "0.75rem", color: COLORS.inkLight, fontFamily: "'Lato', sans-serif", letterSpacing: "0.1em" }}>
        {gone.size} / {LOVE_THINGS.length} dibaca
      </p>
    </div>
  );
}

// ─── Mini Audio Player ────────────────────────────────────────────────────────
function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    const onEnd = () => { setPlaying(false); setProgress(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnd); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: `rgba(249,245,240,0.92)`,
        backdropFilter: "blur(16px)",
        border: `1.5px solid ${COLORS.sand}`,
        borderRadius: 50,
        padding: "10px 18px 10px 12px",
        boxShadow: "0 8px 32px rgba(58,46,39,0.12)",
      }}
    >
      {/* Replace src with your .mp3 path */}
      <audio ref={audioRef} src="https://drive.google.com/uc?export=download&id=1bE72lT7mkyVXvBnP5OfqnB3___-axO0H" preload="auto" crossOrigin="anonymous" />

      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: playing ? COLORS.terracotta : COLORS.sage,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "0.85rem",
        }}
      >
        {playing ? "⏸" : "▶"}
      </motion.button>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.7rem", color: COLORS.ink, letterSpacing: "0.08em" }}>
          🎵 Our Song
        </span>
        <div style={{ width: 80, height: 3, borderRadius: 4, background: COLORS.sand, overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", background: COLORS.terracotta, borderRadius: 4 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: "flex", gap: 2, alignItems: "flex-end" }}
          >
            {[1, 1.5, 0.8, 1.3].map((h, i) => (
              <motion.div
                key={i}
                style={{ width: 2, borderRadius: 2, background: COLORS.terracotta }}
                animate={{ height: [4, 10 * h, 4] }}
                transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function GitaAzzahra() {
  const { d, h, m, s } = useLoveCounter("2025-08-11T00:00:00");
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);

  const sectionStyle = {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  };

  const dividerStyle = {
    width: 48,
    height: 1.5,
    background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
    margin: "24px auto",
  };

  const labelStyle = {
    fontFamily: "'Lato', sans-serif",
    fontSize: "0.68rem",
    letterSpacing: "0.24em",
    color: COLORS.sage,
    textTransform: "uppercase",
    textAlign: "center",
  };

  const h2Style = {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(2rem, 6vw, 3rem)",
    color: COLORS.ink,
    fontWeight: 500,
    textAlign: "center",
    lineHeight: 1.2,
    margin: 0,
  };

  const bodyStyle = {
    fontFamily: "'Lato', sans-serif",
    fontSize: "1rem",
    color: COLORS.inkLight,
    lineHeight: 1.9,
    textAlign: "center",
    maxWidth: 560,
    margin: "0 auto",
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;700&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: ${COLORS.sand}; color: ${COLORS.ink}; }
      `}</style>

      <Petals />
      <AudioPlayer />

      {/* ── HERO ── */}
      <motion.section
        style={{
          ...sectionStyle,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          opacity: heroOpacity,
          y: heroY,
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
          style={labelStyle}
        >
          Untuk kamu yang selalu ada
        </motion.p>

        <div style={dividerStyle} />

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(3rem, 10vw, 6rem)",
            color: COLORS.ink,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.1,
            margin: "0 0 12px",
          }}
        >
          Gita Azzahra
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.0 }}
          style={{ ...bodyStyle, fontSize: "1.05rem" }}
        >
          Ini adalah sepucuk surat cinta digital — untukmu, dari seseorang yang bersyukur setiap hari karena memilikimu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, duration: 0.8, type: "spring" }}
          style={{ marginTop: 48 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: COLORS.blush, fontSize: "1.5rem", textAlign: "center" }}
          >
            ↓
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── LETTER ── */}
      <section style={{ ...sectionStyle, paddingTop: 0 }}>
        <Reveal>
          <p style={labelStyle}>Surat untukmu</p>
          <div style={dividerStyle} />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 style={h2Style}>Hai, Gita.</h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p style={{ ...bodyStyle, marginTop: 24 }}>
            Aku membuat halaman ini bukan karena aku bisa merangkai kata-kata sempurna, tapi justru karena aku ingin mencoba. Karena kamu layak mendapatkan usaha terbaik dariku, dalam segala hal — termasuk dalam cara aku mengungkapkan rasa sayangku.
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <p style={{ ...bodyStyle, marginTop: 16 }}>
            Terima kasih sudah memilih untuk berada di sisiku. Terima kasih untuk setiap tawa, setiap jujur, dan setiap momen biasa yang terasa luar biasa karena kamu ada di dalamnya.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <p style={{ ...bodyStyle, marginTop: 16, fontStyle: "italic", color: COLORS.terracotta }}>
            — dengan sepenuh hati 🌿
          </p>
        </Reveal>
      </section>

      {/* ── LOVE COUNTER ── */}
      <section style={{ background: COLORS.bgDeep }}>
        <div style={sectionStyle}>
          <Reveal>
            <p style={labelStyle}>Kita bersama sejak 11 Agustus 2025</p>
            <div style={dividerStyle} />
            <h2 style={h2Style}>Sudah Sejauh Ini</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 5vw, 48px)", marginTop: 40 }}>
              <CounterBlock value={d} label="Hari" />
              <div style={{ width: 1, height: 60, background: COLORS.sand, alignSelf: "center" }} />
              <CounterBlock value={h} label="Jam" />
              <div style={{ width: 1, height: 60, background: COLORS.sand, alignSelf: "center" }} />
              <CounterBlock value={m} label="Menit" />
              <div style={{ width: 1, height: 60, background: COLORS.sand, alignSelf: "center" }} />
              <CounterBlock value={s} label="Detik" />
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ ...bodyStyle, marginTop: 32 }}>
              Setiap detik yang berlalu adalah detik yang aku syukuri bersamamu.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 10 THINGS ── */}
      <section style={sectionStyle}>
        <Reveal>
          <p style={labelStyle}>Hal-hal yang aku cintai</p>
          <div style={dividerStyle} />
          <h2 style={h2Style}>10 Hal tentang Kamu</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ ...bodyStyle, marginTop: 16, marginBottom: 48 }}>
            Geser kartu-kartu ini, Gita — setiap satu menyimpan sesuatu yang ingin aku katakan kepadamu.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SwipeCards />
          </div>
        </Reveal>
      </section>

      {/* ── CLOSING ── */}
      <section style={{ background: COLORS.bgDeep }}>
        <div style={{ ...sectionStyle, textAlign: "center" }}>
          <Reveal>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: "2.5rem", marginBottom: 24 }}
            >
              🌷
            </motion.div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={h2Style}>Sampai Nanti, dan Seterusnya</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ ...bodyStyle, marginTop: 20 }}>
              Aku tidak tahu apa yang ada di depan, tapi aku tahu satu hal — aku ingin menjalani semuanya bersamamu. Setiap hari biasa, setiap hal kecil, semuanya lebih berarti karena ada kamu.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <p style={{ ...bodyStyle, marginTop: 16, fontStyle: "italic", fontSize: "1.15rem", color: COLORS.terracotta }}>
              "Aku mencintaimu bukan hanya karena siapa kamu, tapi karena siapa aku ketika bersamamu."
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <div style={{ marginTop: 48 }}>
              <div style={{ ...dividerStyle, width: 80 }} />
              <p style={{ ...labelStyle, marginTop: 20 }}>
                Dibuat dengan cinta · Untuk Gita Azzahra · {new Date().getFullYear()}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
