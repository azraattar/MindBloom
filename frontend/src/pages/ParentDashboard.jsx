import { useEffect } from "react";

/* ── Palette & tokens ────────────────────────────────────────────── */
const C = {
    deepOlive: "#3A4D2F",
    olive: "#556B2F",
    lightOlive: "#6B8E23",
    paleOlive: "#8FAF5A",
    tint: "#EEF2E6",
    tintDark: "#E2EDD0",
    bg: "#F5F4F0",
    surface: "#FAFAF7",
    border: "#D8DECE",
    muted: "#8A9180",
    text: "#2C2E28",
    textSub: "#5A5E52",
};

const s = (obj) => obj;

/* ── Global Styles ──────────────────────────────────────────────── */
const GlobalStyles = () => {
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
            
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            
            body {
                font-family: 'DM Sans', sans-serif;
                background: ${C.bg};
                color: ${C.text};
                -webkit-font-smoothing: antialiased;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    return null;
};

/* ── Navbar ─────────────────────────────────────────────────────── */
const Navbar = () => (
    <nav style={s({
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 0 rgba(58,77,47,0.06)"
    })}>
        <div style={s({ display: "flex", alignItems: "center", gap: 10 })}>
            <div style={s({
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${C.olive}, ${C.lightOlive})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            })}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-3-8-7-8z" fill="white" opacity=".9" />
                    <circle cx="12" cy="10" r="3" fill="white" />
                </svg>
            </div>
            <span style={s({
                fontFamily: "'DM Serif Display', serif",
                fontSize: 20,
                color: C.deepOlive,
                letterSpacing: "-0.3px"
            })}>
                MindBloom
            </span>
        </div>
        <span style={s({ fontSize: 13, color: C.muted })}>Parent Dashboard</span>
    </nav>
);

/* ── Hero ───────────────────────────────────────────────────────── */
const Hero = ({ scores = [] }) => {
    const completedDays = Array.isArray(scores) ? scores.length : 0;
    const pct = (completedDays / 7) * 100;

    return (
        <div style={s({ padding: "52px 48px 40px" })}>
            <div style={s({
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: C.tint,
                borderRadius: 20,
                padding: "4px 12px",
                marginBottom: 14
            })}>
                <div style={s({
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.lightOlive
                })} />
                <span style={s({
                    fontSize: 12,
                    color: C.olive,
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                })}>
                    Active Screening
                </span>
            </div>

            <h1 style={s({
                fontFamily: "'DM Serif Display', serif",
                fontSize: 32,
                color: C.deepOlive,
                lineHeight: 1.2,
                marginBottom: 10,
                letterSpacing: "-0.5px",
                maxWidth: 520
            })}>
                Early Learning Risk<br />Screening Dashboard
            </h1>

            <p style={s({
                fontSize: 14,
                color: C.textSub,
                maxWidth: 460,
                lineHeight: 1.7,
                marginBottom: 24
            })}>
                This tool provides an evidence-based screening overview of early learning patterns.
                Results are indicative only and do not constitute a clinical diagnosis.
            </p>

            <div style={s({
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: "20px 28px",
                maxWidth: 280
            })}>
                <div style={s({
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10
                })}>
                    <span style={s({ fontSize: 13, color: C.textSub })}>
                        Screening Progress
                    </span>
                    <span style={s({ fontSize: 13, color: C.olive, fontWeight: 600 })}>
                        Day {completedDays} of 7
                    </span>
                </div>
                <div style={s({
                    height: 8,
                    background: C.tintDark,
                    borderRadius: 99,
                    overflow: "hidden"
                })}>
                    <div style={s({
                        width: `${pct}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${C.olive}, ${C.lightOlive})`,
                        borderRadius: 99,
                        transition: "width 0.5s ease"
                    })} />
                </div>
                <p style={s({ fontSize: 12, color: C.muted, marginTop: 8 })}>
                    {7 - completedDays} session{7 - completedDays !== 1 ? 's' : ''} remaining
                </p>
            </div>
        </div>
    );
};

/* ── Risk Arc ───────────────────────────────────────────────────── */
const RiskArc = ({ pct = 0 }) => {
    const riskLevel = pct < 40 ? "Low" : pct < 70 ? "Moderate" : "High";
    const riskColor = pct < 40 ? C.lightOlive : pct < 70 ? C.olive : "#9A6A50";

    return (
        <div style={s({ padding: "0 48px 40px", display: "flex", justifyContent: "center" })}>
            <div style={s({
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 24,
                padding: "40px 48px",
                maxWidth: 640,
                width: "100%",
                boxShadow: "0 4px 24px rgba(58,77,47,0.07)"
            })}>
                <div style={s({
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                    flexWrap: "wrap",
                    justifyContent: "center"
                })}>
                    {/* Risk score display */}
                    <div style={s({ textAlign: "center" })}>
                        <div style={s({
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            background: `conic-gradient(${riskColor} ${pct * 3.6}deg, ${C.tintDark} ${pct * 3.6}deg)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        })}>
                            <div style={s({
                                width: 110,
                                height: 110,
                                borderRadius: "50%",
                                background: C.surface,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            })}>
                                <span style={s({
                                    fontFamily: "'DM Serif Display', serif",
                                    fontSize: 32,
                                    color: C.deepOlive,
                                    lineHeight: 1
                                })}>
                                    {pct}%
                                </span>
                                <span style={s({
                                    fontSize: 10,
                                    color: C.muted,
                                    letterSpacing: "0.5px",
                                    marginTop: 4
                                })}>
                                    RISK SCORE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Risk level info */}
                    <div style={s({ flex: 1, minWidth: 240 })}>
                        <div style={s({
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: `linear-gradient(90deg, ${C.tint}, transparent)`,
                            border: `1px solid ${C.tintDark}`,
                            borderLeft: `3px solid ${riskColor}`,
                            borderRadius: 8,
                            padding: "6px 14px",
                            marginBottom: 14
                        })}>
                            <span style={s({
                                fontSize: 12,
                                color: C.textSub,
                                fontWeight: 500,
                                letterSpacing: "0.5px",
                                textTransform: "uppercase"
                            })}>
                                Risk Level
                            </span>
                            <span style={s({
                                fontSize: 14,
                                color: riskColor,
                                fontWeight: 600
                            })}>
                                {riskLevel}
                            </span>
                        </div>

                        <h2 style={s({
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: 20,
                            color: C.deepOlive,
                            lineHeight: 1.3,
                            marginBottom: 10
                        })}>
                            {pct === 0
                                ? "Complete sessions to generate risk profile"
                                : "Early learning pattern analysis"
                            }
                        </h2>

                        <p style={s({
                            fontSize: 13,
                            color: C.textSub,
                            lineHeight: 1.7
                        })}>
                            {pct === 0
                                ? "Risk assessment will be available after the first screening session is completed."
                                : "This screening provides preliminary insights. Continue daily sessions for a comprehensive profile."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Skill Card ─────────────────────────────────────────────────── */
const SkillCard = ({ label, pct = 0, color }) => {
    const isImproving = pct >= 65;

    return (
        <div style={s({
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 24,
            transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            cursor: "default"
        })}>
            <div style={s({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 18
            })}>
                <div>
                    <p style={s({
                        fontSize: 11,
                        color: C.muted,
                        letterSpacing: "0.6px",
                        textTransform: "uppercase",
                        marginBottom: 4
                    })}>
                        Skill Area
                    </p>
                    <h3 style={s({
                        fontSize: 15,
                        color: C.text,
                        fontWeight: 500,
                        lineHeight: 1.3
                    })}>
                        {label}
                    </h3>
                </div>
                <div style={s({
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: isImproving ? C.tint : "#F5F0EE",
                    borderRadius: 20,
                    padding: "4px 10px"
                })}>
                    <span style={s({
                        fontSize: 14,
                        color: isImproving ? C.lightOlive : "#B08060"
                    })}>
                        {isImproving ? "↑" : "↓"}
                    </span>
                    <span style={s({
                        fontSize: 12,
                        color: isImproving ? C.olive : "#9A6A50",
                        fontWeight: 500
                    })}>
                        {isImproving ? "Improving" : "Focus"}
                    </span>
                </div>
            </div>

            <div style={s({
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginBottom: 12
            })}>
                <span style={s({
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 36,
                    color: C.deepOlive,
                    lineHeight: 1
                })}>
                    {pct}
                </span>
                <span style={s({ fontSize: 14, color: C.muted })}>
                    /100
                </span>
            </div>

            <div style={s({
                height: 6,
                background: C.tintDark,
                borderRadius: 99,
                overflow: "hidden"
            })}>
                <div style={s({
                    width: `${pct}%`,
                    height: "100%",
                    background: color || `linear-gradient(90deg, ${C.olive}, ${C.lightOlive})`,
                    borderRadius: 99,
                    transition: "width 0.5s ease"
                })} />
            </div>
        </div>
    );
};

/* ── Skills Section ─────────────────────────────────────────────── */
const SkillsSection = ({ latestScore }) => {
    if (!latestScore) {
        return null;
    }

    const skills = [
        {
            label: "Phonological Awareness",
            pct: latestScore.phonological_score || 0,
            color: C.olive
        },
        {
            label: "Visual Processing",
            pct: latestScore.visual_score || 0,
            color: C.lightOlive
        },
        {
            label: "Working Memory",
            pct: latestScore.memory_score || 0,
            color: C.olive
        },
        {
            label: "Processing Speed",
            pct: latestScore.processing_speed || 0,
            color: C.lightOlive
        }
    ];

    return (
        <section style={s({ padding: "0 48px 40px" })}>
            <div style={s({ marginBottom: 24 })}>
                <h2 style={s({
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 22,
                    color: C.deepOlive,
                    marginBottom: 4
                })}>
                    Skill Breakdown
                </h2>
                <p style={s({ fontSize: 13, color: C.muted })}>
                    Performance across core cognitive domains
                </p>
            </div>

            <div style={s({
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 18
            })}>
                {skills.map((sk) => (
                    <SkillCard key={sk.label} {...sk} />
                ))}
            </div>
        </section>
    );
};

/* ── Day Bar ────────────────────────────────────────────────────── */
const DayBar = ({ scores = [] }) => {
    const completedDays = Array.isArray(scores) ? scores.length : 0;
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <section style={s({ padding: "0 48px 40px" })}>
            <div style={s({ marginBottom: 20 })}>
                <h2 style={s({
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 22,
                    color: C.deepOlive,
                    marginBottom: 4
                })}>
                    7-Day Screening Track
                </h2>
                <p style={s({ fontSize: 13, color: C.muted })}>
                    {completedDays} session{completedDays !== 1 ? 's' : ''} completed · {7 - completedDays} remaining
                </p>
            </div>

            <div style={s({ display: "flex", gap: 12, flexWrap: "wrap" })}>
                {days.map((day, i) => {
                    const isDone = i < completedDays;
                    return (
                        <div
                            key={i}
                            style={s({
                                flex: 1,
                                minWidth: 72,
                                maxWidth: 100,
                                background: isDone
                                    ? `linear-gradient(135deg, ${C.olive}, ${C.lightOlive})`
                                    : C.surface,
                                border: `1px solid ${isDone ? "transparent" : C.border}`,
                                padding: "18px 12px",
                                textAlign: "center",
                                borderRadius: 10,
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                cursor: "default"
                            })}
                        >
                            <p style={s({
                                fontSize: 11,
                                fontWeight: 500,
                                letterSpacing: "0.7px",
                                textTransform: "uppercase",
                                marginBottom: 8,
                                color: isDone ? "rgba(255,255,255,0.7)" : C.muted
                            })}>
                                {day}
                            </p>

                            {isDone ? (
                                <div style={s({
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.25)",
                                    margin: "0 auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                })}>
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M3 8l3.5 3.5L13 5"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <div style={s({
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: C.tint,
                                    margin: "0 auto",
                                    border: `1px dashed ${C.border}`
                                })} />
                            )}

                            <p style={s({
                                fontSize: 11,
                                marginTop: 8,
                                color: isDone ? "rgba(255,255,255,0.85)" : C.muted
                            })}>
                                Day {i + 1}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

/* ── Parent Dashboard (Main Export) ─────────────────────────────── */
export default function ParentDashboard({
    scores = [],
    latestScore = null,
    loading = false
}) {
    // Validate scores is an array
    const validScores = Array.isArray(scores) ? scores : [];

    if (loading) {
        return (
            <div style={s({
                minHeight: "100vh",
                background: C.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            })}>
                <div style={s({
                    textAlign: "center",
                    padding: 40
                })}>
                    <div style={s({
                        width: 48,
                        height: 48,
                        border: `3px solid ${C.tintDark}`,
                        borderTop: `3px solid ${C.olive}`,
                        borderRadius: "50%",
                        margin: "0 auto 16px",
                        animation: "spin 0.8s linear infinite"
                    })} />
                    <p style={s({ fontSize: 14, color: C.muted })}>
                        Loading dashboard...
                    </p>
                    <style>
                        {`@keyframes spin { to { transform: rotate(360deg); } }`}
                    </style>
                </div>
            </div>
        );
    }

    return (
        <>
            <GlobalStyles />
            <div style={s({ minHeight: "100vh", background: C.bg })}>
                <Navbar />
                <main style={s({ maxWidth: 1160, margin: "0 auto" })}>
                    <Hero scores={validScores} />
                    <RiskArc pct={latestScore?.overall_score || 0} />
                    {latestScore && <SkillsSection latestScore={latestScore} />}
                    <DayBar scores={validScores} />
                </main>
            </div>
        </>
    );
}