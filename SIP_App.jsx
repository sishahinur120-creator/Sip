import { useState, useEffect, useRef } from "react";

const PAGES = ["home", "photo", "video", "influencer", "audio"];

const NAV_ICONS = {
  home: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  photo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="15" rx="2"/>
      <circle cx="12" cy="12.5" r="3.5"/>
      <path d="M8 5l1.5-2h5L16 5"/>
    </svg>
  ),
  video: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="5" width="15" height="14" rx="2"/>
      <path d="M17 9l5-3v12l-5-3V9z"/>
    </svg>
  ),
  influencer: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      <path d="M18 3l1.5 3 3 .5-2.2 2.1.5 3L18 10.5 15.2 12l.5-3L13.5 6.5l3-.5L18 3z"/>
    </svg>
  ),
  audio: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
};

const PHOTO_SECTIONS = [
  { id: "face", label: "Face", icon: "👤", desc: "Skin, eyes, expression" },
  { id: "body", label: "Body", icon: "🧍", desc: "Proportions, pose fix" },
  { id: "hair", label: "Hair / Hijab", icon: "💇", desc: "Style, color, texture" },
  { id: "shoes", label: "Shoes", icon: "👟", desc: "Footwear swap" },
  { id: "dress", label: "Outfit", icon: "👗", desc: "Full clothing change" },
  { id: "pose", label: "Pose", icon: "🕺", desc: "Body angle, stance" },
  { id: "bg", label: "Background", icon: "🌆", desc: "Scene replacement" },
  { id: "elements", label: "Elements", icon: "✨", desc: "Props, accessories" },
  { id: "sunglass", label: "Sunglasses", icon: "🕶️", desc: "Eyewear overlay" },
  { id: "lighting", label: "Lighting", icon: "💡", desc: "Cinematic grade" },
];

const VIDEO_SECTIONS = [
  { id: "orig", label: "Source Video", icon: "🎬", desc: "Upload your clip" },
  { id: "photo", label: "Face Swap", icon: "🪞", desc: "Identity transfer" },
  { id: "bg_v", label: "Background", icon: "🌃", desc: "Environment replace" },
  { id: "outfit_v", label: "Outfit", icon: "👔", desc: "Style transform" },
  { id: "audio_v", label: "Audio Sync", icon: "🎵", desc: "Voice & music" },
];

const ETHNICITY_OPTIONS = ["South Asian", "East Asian", "Middle Eastern", "African", "European", "Latin", "Mixed"];
const BEAUTY_OPTIONS = ["Cinematic", "Editorial", "Natural", "Glam", "Street", "Luxury"];
const COUNTRY_OPTIONS = ["Pakistan", "Bangladesh", "India", "UAE", "Turkey", "Korea", "Brazil", "France"];

// Particle component
function Particles() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 3 === 0 ? 2 : 1,
          height: i % 3 === 0 ? 2 : 1,
          borderRadius: "50%",
          background: i % 4 === 0 ? "rgba(180,120,255,0.6)" : i % 4 === 1 ? "rgba(255,180,80,0.5)" : "rgba(255,255,255,0.25)",
          left: `${(i * 37 + 11) % 100}%`,
          top: `${(i * 53 + 7) % 100}%`,
          animation: `float-particle ${8 + (i % 5) * 2}s ease-in-out infinite`,
          animationDelay: `${i * 0.7}s`,
        }} />
      ))}
    </div>
  );
}

function GlowOrb({ x, y, color, size = 300, opacity = 0.12 }) {
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: `blur(${size * 0.4}px)`,
      opacity,
      pointerEvents: "none",
    }} />
  );
}

function UploadZone({ label, icon, desc, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active
          ? "linear-gradient(135deg, rgba(150,80,255,0.18), rgba(255,140,50,0.12))"
          : "rgba(255,255,255,0.03)",
        border: active ? "1px solid rgba(160,90,255,0.5)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "16px 14px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: active ? "scale(1.02)" : "scale(1)",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {active && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(150,80,255,0.08), transparent)",
          borderRadius: 16,
        }} />
      )}
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        color: active ? "#d4aaff" : "rgba(255,255,255,0.8)",
        marginBottom: 3,
        letterSpacing: 0.3,
      }}>{label}</div>
      <div style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.35)",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: 0.2,
      }}>{desc}</div>
      {active && (
        <div style={{
          position: "absolute",
          top: 8, right: 8,
          width: 8, height: 8,
          borderRadius: "50%",
          background: "#a050ff",
          boxShadow: "0 0 8px #a050ff",
          animation: "pulse-dot 2s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}

function GenerateButton({ label = "Generate", loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        padding: "18px 24px",
        background: loading
          ? "rgba(255,255,255,0.05)"
          : "linear-gradient(135deg, #8040e8 0%, #c060ff 50%, #ff8040 100%)",
        border: "none",
        borderRadius: 16,
        color: "#fff",
        fontFamily: "'Sora', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 0.8,
        cursor: loading ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: loading ? "none" : "0 8px 32px rgba(128,64,232,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        transform: loading ? "none" : "translateY(0)",
      }}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{
            width: 16, height: 16, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.2)",
            borderTopColor: "#fff",
            animation: "spin 0.8s linear infinite",
            display: "inline-block",
          }} />
          Processing Realism...
        </span>
      ) : (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 0 6px #fff",
            animation: "pulse-dot 1.5s ease-in-out infinite",
          }} />
          {label}
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 0 6px #fff",
            animation: "pulse-dot 1.5s ease-in-out infinite 0.5s",
          }} />
        </span>
      )}
    </button>
  );
}

function HomePage({ setPage }) {
  const [hovered, setHovered] = useState(null);
  const features = [
    { id: "photo", label: "Photo AI", sub: "Hyperrealistic photo generation", icon: "📸", color: "#7040d8" },
    { id: "video", label: "Video AI", sub: "Cinematic motion synthesis", icon: "🎬", color: "#c050a0" },
    { id: "influencer", label: "AI Influencer", sub: "Create your digital identity", icon: "✦", color: "#e06030" },
    { id: "audio", label: "Audio AI", sub: "Human-quality voice synthesis", icon: "🎙", color: "#3090c0" },
  ];

  return (
    <div style={{ padding: "0 20px 100px", position: "relative" }}>
      {/* Hero */}
      <div style={{
        textAlign: "center",
        padding: "60px 0 40px",
        position: "relative",
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11,
          letterSpacing: 6,
          color: "rgba(160,100,255,0.8)",
          textTransform: "uppercase",
          marginBottom: 20,
          animation: "fade-up 0.8s ease forwards",
        }}>
          The Future of Creation
        </div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 68,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 0.9,
          animation: "fade-up 0.8s ease 0.1s both forwards",
          opacity: 0,
        }}>
          <span style={{
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>SIP</span>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: "rgba(255,255,255,0.35)",
          marginTop: 16,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          animation: "fade-up 0.8s ease 0.2s both forwards",
          opacity: 0,
        }}>
          Synthetic Intelligence Platform
        </div>

        {/* Cinematic preview strip */}
        <div style={{
          display: "flex",
          gap: 8,
          marginTop: 36,
          justifyContent: "center",
          animation: "fade-up 0.8s ease 0.3s both forwards",
          opacity: 0,
        }}>
          {["Portrait", "Fashion", "Cinematic", "Street"].map((tag, i) => (
            <div key={tag} style={{
              padding: "6px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 0.5,
            }}>{tag}</div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        {features.map((f, i) => (
          <div
            key={f.id}
            onClick={() => setPage(f.id)}
            onMouseEnter={() => setHovered(f.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === f.id
                ? `linear-gradient(135deg, ${f.color}22, ${f.color}11)`
                : "rgba(255,255,255,0.03)",
              border: hovered === f.id
                ? `1px solid ${f.color}60`
                : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "24px 18px",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: hovered === f.id ? "translateY(-4px) scale(1.01)" : "none",
              backdropFilter: "blur(12px)",
              animation: `fade-up 0.6s ease ${0.1 * i + 0.4}s both forwards`,
              opacity: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: -20, right: -20,
              width: 80, height: 80,
              borderRadius: "50%",
              background: f.color,
              opacity: 0.06,
              filter: "blur(20px)",
            }} />
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 6,
            }}>{f.label}</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              lineHeight: 1.5,
            }}>{f.sub}</div>
            <div style={{
              marginTop: 16,
              width: 28,
              height: 2,
              background: `linear-gradient(90deg, ${f.color}, transparent)`,
              borderRadius: 2,
              transition: "width 0.3s ease",
              ...(hovered === f.id ? { width: 48 } : {}),
            }} />
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{
        marginTop: 24,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        animation: "fade-up 0.6s ease 0.8s both forwards",
        opacity: 0,
      }}>
        {[["4K", "Output Quality"], ["0.1s", "Response Time"], ["∞", "Possibilities"]].map(([val, lab]) => (
          <div key={lab} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 20,
              fontWeight: 800,
              background: "linear-gradient(135deg, #fff, rgba(160,100,255,0.8))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{val}</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              marginTop: 2,
              letterSpacing: 0.5,
            }}>{lab}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoPage() {
  const [active, setActive] = useState("face");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleGen = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ padding: "32px 0 24px" }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11,
          letterSpacing: 5,
          color: "rgba(160,100,255,0.7)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>Photo Studio</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -0.5,
        }}>AI Photo Realism</div>
      </div>

      {/* Upload main photo */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1.5px dashed rgba(160,100,255,0.3)",
        borderRadius: 20,
        height: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(128,60,220,0.08) 0%, transparent 70%)",
        }} />
        <div style={{ fontSize: 32, marginBottom: 10 }}>📷</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: "rgba(255,255,255,0.7)",
        }}>Upload Reference Photo</div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          color: "rgba(255,255,255,0.25)",
          marginTop: 4,
        }}>JPG, PNG, HEIC • Max 50MB</div>
      </div>

      {/* Section grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginBottom: 20,
      }}>
        {PHOTO_SECTIONS.map(s => (
          <UploadZone
            key={s.id}
            label={s.label}
            icon={s.icon}
            desc={s.desc}
            active={active === s.id}
            onClick={() => setActive(active === s.id ? null : s.id)}
          />
        ))}
      </div>

      {/* Prompt */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
      }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your vision... cinematic portrait, golden hour, natural skin texture..."
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            padding: "14px 16px",
            resize: "none",
            minHeight: 80,
            lineHeight: 1.6,
            letterSpacing: 0.2,
          }}
        />
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 12px 10px",
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
          }}>{prompt.length} / 500</div>
        </div>
      </div>

      <GenerateButton label="Generate Cinematic Photo" loading={loading} onClick={handleGen} />
    </div>
  );
}

function VideoPage() {
  const [active, setActive] = useState("orig");
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ padding: "32px 0 24px" }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11,
          letterSpacing: 5,
          color: "rgba(200,80,160,0.7)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>Video Studio</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -0.5,
        }}>Cinematic Motion</div>
      </div>

      {/* Timeline preview */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: 3,
          color: "rgba(255,255,255,0.25)",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>Timeline</div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: 32,
              borderRadius: 4,
              background: i < 4
                ? `linear-gradient(180deg, rgba(160,80,255,${0.3 + i * 0.05}), rgba(80,40,180,0.2))`
                : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.05)",
            }} />
          ))}
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}>
          {["0:00", "0:05", "0:10", "0:15", "0:20"].map(t => (
            <div key={t} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.2)",
            }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {VIDEO_SECTIONS.map(s => (
          <UploadZone
            key={s.id}
            label={s.label}
            icon={s.icon}
            desc={s.desc}
            active={active === s.id}
            onClick={() => setActive(active === s.id ? null : s.id)}
          />
        ))}
      </div>

      {/* Quality selector */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
      }}>
        {["720p", "1080p", "4K"].map((q, i) => (
          <button
            key={q}
            style={{
              flex: 1,
              padding: "10px 0",
              background: i === 1 ? "linear-gradient(135deg, rgba(200,80,160,0.25), rgba(160,60,200,0.2))" : "rgba(255,255,255,0.04)",
              border: i === 1 ? "1px solid rgba(200,80,160,0.4)" : "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              color: i === 1 ? "#e080c0" : "rgba(255,255,255,0.35)",
              fontFamily: "'Sora', sans-serif",
              fontSize: 12,
              fontWeight: i === 1 ? 700 : 400,
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >{q}</button>
        ))}
      </div>

      <GenerateButton
        label="Synthesize Cinematic Video"
        loading={loading}
        onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 3000); }}
      />
    </div>
  );
}

function InfluencerPage() {
  const [ethnicity, setEthnicity] = useState("South Asian");
  const [beauty, setBeauty] = useState("Cinematic");
  const [country, setCountry] = useState("Pakistan");
  const [age, setAge] = useState(24);
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState({ jaw: 50, cheek: 45, eyes: 55, nose: 48, lip: 52 });

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ padding: "32px 0 24px" }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11,
          letterSpacing: 5,
          color: "rgba(255,140,60,0.7)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>Influencer Lab</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -0.5,
        }}>AI Identity Studio</div>
      </div>

      {/* Avatar preview */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,140,60,0.08), rgba(160,80,255,0.08))",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24,
        height: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,140,60,0.1) 0%, transparent 60%)",
        }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✦</div>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>Your AI Identity</div>
        </div>
        {/* Scanning rings */}
        {[1, 2, 3].map(n => (
          <div key={n} style={{
            position: "absolute",
            width: 60 + n * 50,
            height: 60 + n * 50,
            borderRadius: "50%",
            border: `1px solid rgba(255,140,60,${0.15 / n})`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            animation: `scan-ring ${2 + n * 0.5}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* Ethnicity */}
      <SectionLabel label="Ethnicity" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {ETHNICITY_OPTIONS.map(e => (
          <Chip key={e} label={e} active={ethnicity === e} color="#e06030" onClick={() => setEthnicity(e)} />
        ))}
      </div>

      {/* Beauty style */}
      <SectionLabel label="Beauty Style" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {BEAUTY_OPTIONS.map(b => (
          <Chip key={b} label={b} active={beauty === b} color="#a050ff" onClick={() => setBeauty(b)} />
        ))}
      </div>

      {/* Country */}
      <SectionLabel label="Country" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {COUNTRY_OPTIONS.map(c => (
          <Chip key={c} label={c} active={country === c} color="#50a0e0" onClick={() => setCountry(c)} />
        ))}
      </div>

      {/* Age */}
      <SectionLabel label={`Age: ${age}`} />
      <div style={{ marginBottom: 20, padding: "0 4px" }}>
        <input
          type="range" min={18} max={45} value={age}
          onChange={e => setAge(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#e06030" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>18</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>45</span>
        </div>
      </div>

      {/* Facial structure */}
      <SectionLabel label="Facial Structure" />
      <div style={{ marginBottom: 20 }}>
        {Object.entries(sliders).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.45)",
                textTransform: "capitalize",
              }}>{key}</span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
              }}>{val}</span>
            </div>
            <div style={{
              height: 4,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 2,
              position: "relative",
            }}>
              <div style={{
                height: "100%",
                width: `${val}%`,
                background: "linear-gradient(90deg, #8040e8, #e06030)",
                borderRadius: 2,
                transition: "width 0.2s ease",
              }} />
              <input
                type="range" min={0} max={100} value={val}
                onChange={e => setSliders(s => ({ ...s, [key]: Number(e.target.value) }))}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  margin: 0,
                  height: "100%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <GenerateButton
        label="Create AI Influencer"
        loading={loading}
        onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 4000); }}
      />
    </div>
  );
}

function AudioPage() {
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [style, setStyle] = useState("Natural");

  const styles = ["Natural", "Warm", "Emotional", "Cinematic", "Luxury", "Studio"];

  return (
    <div style={{ padding: "0 20px 100px" }}>
      <div style={{ padding: "32px 0 24px" }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 11,
          letterSpacing: 5,
          color: "rgba(48,144,192,0.7)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>Audio Studio</div>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -0.5,
        }}>Voice Synthesis</div>
      </div>

      {/* Waveform visualizer */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(48,144,192,0.15)",
        borderRadius: 20,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        gap: 3,
        padding: "0 20px",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(48,144,192,0.05) 0%, transparent 70%)",
        }} />
        {[...Array(48)].map((_, i) => {
          const h = recording
            ? Math.random() * 60 + 10
            : 4 + Math.abs(Math.sin(i * 0.4)) * 40 + Math.abs(Math.cos(i * 0.7)) * 20;
          return (
            <div key={i} style={{
              width: 3,
              height: h,
              borderRadius: 2,
              background: `linear-gradient(180deg, rgba(48,144,192,${0.3 + Math.abs(Math.sin(i * 0.4)) * 0.5}), rgba(160,80,255,0.3))`,
              transition: "height 0.1s ease",
              animation: recording ? `wave-bar 0.3s ease-in-out infinite ${i * 20}ms` : "none",
            }} />
          );
        })}
      </div>

      {/* Record button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <button
          onClick={() => setRecording(!recording)}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: recording
              ? "linear-gradient(135deg, #e04040, #a02020)"
              : "linear-gradient(135deg, rgba(48,144,192,0.3), rgba(48,144,192,0.15))",
            border: recording ? "2px solid rgba(255,80,80,0.5)" : "2px solid rgba(48,144,192,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: recording ? "0 0 30px rgba(224,64,64,0.4)" : "0 0 20px rgba(48,144,192,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{
            width: recording ? 20 : 24,
            height: recording ? 20 : 24,
            borderRadius: recording ? 4 : "50%",
            background: "#fff",
            transition: "all 0.3s ease",
          }} />
        </button>
      </div>

      {/* Text input */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
      }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or speak your script... The voice will capture natural human emotion, breath, and warmth."
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            padding: "16px",
            resize: "none",
            minHeight: 100,
            lineHeight: 1.7,
            boxSizing: "border-box",
          }}
        />
      </div>

      <SectionLabel label="Voice Style" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {styles.map(s => (
          <Chip key={s} label={s} active={style === s} color="#3090c0" onClick={() => setStyle(s)} />
        ))}
      </div>

      <GenerateButton
        label="Synthesize Voice"
        loading={loading}
        onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2500); }}
      />
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 10,
      letterSpacing: 3,
      color: "rgba(255,255,255,0.3)",
      textTransform: "uppercase",
      marginBottom: 10,
    }}>{label}</div>
  );
}

function Chip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        background: active ? `${color}22` : "rgba(255,255,255,0.04)",
        border: active ? `1px solid ${color}60` : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 100,
        color: active ? color : "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.2s ease",
        letterSpacing: 0.3,
      }}
    >{label}</button>
  );
}

function BottomNav({ page, setPage }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      background: "rgba(8,4,20,0.85)",
      backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      padding: "12px 8px 20px",
      zIndex: 100,
    }}>
      {PAGES.map(p => (
        <button
          key={p}
          onClick={() => setPage(p)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 0",
            transition: "all 0.2s ease",
            opacity: page === p ? 1 : 0.35,
          }}
        >
          <div style={{
            color: page === p
              ? p === "home" ? "#a050ff"
              : p === "photo" ? "#a050ff"
              : p === "video" ? "#c050a0"
              : p === "influencer" ? "#e06030"
              : "#3090c0"
              : "rgba(255,255,255,0.5)",
            transition: "all 0.2s ease",
            transform: page === p ? "scale(1.1)" : "scale(1)",
          }}>
            {NAV_ICONS[p]}
          </div>
          {page === p && (
            <div style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: p === "home" || p === "photo" ? "#a050ff"
                : p === "video" ? "#c050a0"
                : p === "influencer" ? "#e06030"
                : "#3090c0",
              boxShadow: `0 0 6px ${p === "home" || p === "photo" ? "#a050ff" : p === "video" ? "#c050a0" : p === "influencer" ? "#e06030" : "#3090c0"}`,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}

export default function SIPApp() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono&display=swap');
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { background: #050210; }
      
      @keyframes fade-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes float-particle {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        50% { transform: translateY(-20px) translateX(8px); opacity: 0.8; }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
      @keyframes scan-ring {
        0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
      }
      @keyframes wave-bar {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.5); }
      }
      
      input[type="range"] {
        -webkit-appearance: none;
        background: transparent;
      }
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: linear-gradient(135deg, #a050ff, #e06030);
        cursor: pointer;
        box-shadow: 0 0 8px rgba(160,80,255,0.5);
      }
      input[type="range"]::-webkit-slider-runnable-track {
        height: 4px;
        background: rgba(255,255,255,0.08);
        border-radius: 2px;
      }
      
      ::-webkit-scrollbar { width: 0; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} />;
      case "photo": return <PhotoPage />;
      case "video": return <VideoPage />;
      case "influencer": return <InfluencerPage />;
      case "audio": return <AudioPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050210",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background atmosphere */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <GlowOrb x="-10%" y="-5%" color="radial-gradient(circle, #4020a0, transparent)" size={400} opacity={0.15} />
        <GlowOrb x="60%" y="20%" color="radial-gradient(circle, #a04020, transparent)" size={300} opacity={0.08} />
        <GlowOrb x="10%" y="60%" color="radial-gradient(circle, #2040a0, transparent)" size={350} opacity={0.07} />
        {/* Film grain */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }} />
      </div>
      <Particles />

      {/* Status bar accent */}
      <div style={{
        position: "fixed",
        top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(160,80,255,0.4), rgba(255,140,60,0.3), transparent)",
        zIndex: 200,
      }} />

      {/* Page header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(5,2,16,0.8)",
        backdropFilter: "blur(20px)",
        padding: "16px 20px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: -0.5,
            background: "linear-gradient(135deg, #fff 0%, rgba(160,80,255,0.9) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>SIP</div>
          <div style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}>
            <div style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: "#40e080",
              boxShadow: "0 0 8px #40e080",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: "rgba(64,224,128,0.7)",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}>Live</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {renderPage()}
      </div>

      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}
