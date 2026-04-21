import { useEffect, useState } from 'react'
import './App.css'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const vh = window.innerHeight || 800
  const progress = Math.min(1, Math.max(0, scrollY / vh))
  const gameProgress = Math.min(1, Math.max(0, (scrollY - vh * 0.6) / (vh * 0.9)))
  // boot loading screen: starts after game section (3.2vh), runs 1.5 viewports
  const bootProgress = Math.min(1, Math.max(0, (scrollY - vh * 3.2) / (vh * 1.4)))
  // pixel section starts after boot (3.2 + 1.5 = 4.7vh)
  const pixelProgress = Math.min(1, Math.max(0, (scrollY - vh * 4.7) / (vh * 0.8)))

  // Glow: deep blue → neon cyan
  const g1 = `rgba(${Math.round(lerp(22, 0, progress))},${Math.round(lerp(68, 220, progress))},${Math.round(lerp(148, 80, progress))},${lerp(0.82, 0.65, progress).toFixed(2)})`
  const g2 = `rgba(${Math.round(lerp(10, 0, progress))},${Math.round(lerp(32, 160, progress))},${Math.round(lerp(80, 50, progress))},${lerp(0.35, 0.45, progress).toFixed(2)})`

  // Background: dark navy → near black
  const bg = `rgb(${Math.round(lerp(6, 1, progress))},${Math.round(lerp(10, 3, progress))},${Math.round(lerp(19, 8, progress))})`

  // Accent: orange → neon green
  const accent = `rgb(${Math.round(lerp(245, 0, progress))},${Math.round(lerp(160, 255, progress))},${Math.round(lerp(32, 100, progress))})`

  const cssVars = {
    '--glow-1': g1,
    '--glow-2': g2,
    '--bg-color': bg,
    '--accent-color': accent,
    '--grid-opacity': progress.toFixed(3),
    '--scanline-opacity': (progress * 0.45).toFixed(3),
    '--nav-glow': `rgba(0,255,120,${(progress * 0.18).toFixed(3)})`,
    '--game-p': gameProgress.toFixed(4),
    '--boot-p': bootProgress.toFixed(4),
    '--pixel-p': pixelProgress.toFixed(4),
  } as React.CSSProperties

  return (
    <div className="page" style={cssVars}>
      {/* Persistent overlays */}
      <div className="noise" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* Screen 1 — Portfolio landing */}
      <section className="screen screen-landing">
        <nav className="nav">
          <span className="nav-brand">MATHEW ZEUS B. TUGAB</span>
          <ul className="nav-links">
            <li><a href="#work">WORK</a></li>
            <li><a href="#socials">SOCIALS</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
        </nav>

        <main className="hero">
          <h1 className="hero-title">
            <span className="line line-2">Fullstack</span>
            <span className="line line-3">developer</span>
            <span className="line line-1"><em className="accent">frontend Focused</em></span>
          </h1>
        </main>

        <footer className="footer">
          <div className="footer-info">
            <div className="info-col">
              <p>WEB &amp; MOBILE / REACT</p>
              <p>/ NODE.JS / TYPESCRIPT</p>
              <p className="info-muted">OPEN TO FULLTIME &amp;</p>
              <p className="info-muted">FREELANCE WORLDWIDE</p>
            </div>
            <div className="info-col">
              <p>BASED</p>
              <p>IN PHILIPPINES</p>
            </div>
            <div className="info-col">
              <p>BUILDING</p>
              <p>SINCE 2022</p>
            </div>
          </div>
          <div className="scroll-btn" role="button" aria-label="Scroll down">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </footer>
      </section>

      {/* Screen 2 — Game theme: tall container keeps viewport sticky while game-p drives the reveal */}
      <section className="screen screen-game" id="work">
        <div className="game-sticky-frame">
          <div className="game-hud">
            <span className="hud-tag">// PORTFOLIO.exe</span>
            <span className="hud-tag">PLAYER_01 &gt; MATHEW_ZEUS</span>
          </div>

          <div className="game-content">
            <p className="game-eyebrow">SELECT MISSION</p>
            <h2 className="game-title">SKILL_TREE<span className="cursor">_</span></h2>
            <ul className="skill-list">
              <li>
                <span className="skill-tag">REACT</span>
                <span className="skill-bar"><span className="skill-fill" style={{ '--w': '0.92' } as React.CSSProperties} /></span>
                <span className="skill-val">92</span>
              </li>
              <li>
                <span className="skill-tag">TYPESCRIPT</span>
                <span className="skill-bar"><span className="skill-fill" style={{ '--w': '0.88' } as React.CSSProperties} /></span>
                <span className="skill-val">88</span>
              </li>
              <li>
                <span className="skill-tag">NODE.JS</span>
                <span className="skill-bar"><span className="skill-fill" style={{ '--w': '0.78' } as React.CSSProperties} /></span>
                <span className="skill-val">78</span>
              </li>
              <li>
                <span className="skill-tag">UI / UX</span>
                <span className="skill-bar"><span className="skill-fill" style={{ '--w': '0.85' } as React.CSSProperties} /></span>
                <span className="skill-val">85</span>
              </li>
              <li>
                <span className="skill-tag">SQL / NoSQL</span>
                <span className="skill-bar"><span className="skill-fill" style={{ '--w': '0.72' } as React.CSSProperties} /></span>
                <span className="skill-val">72</span>
              </li>
            </ul>
            <p className="game-prompt">[ SCROLL TO CONTINUE ]</p>
          </div>
        </div>
      </section>
      {/* Boot transition: scroll-driven 8-bit loading sequence */}
      <section className="screen screen-boot">
        <div className="boot-sticky-frame">
          <div className="pixel-scanline" aria-hidden="true" />

          <div className="boot-terminal">
            <p className="boot-line" style={{ '--bl': '0' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> Starting MZT.PORTFOLIO.service
            </p>
            <p className="boot-line" style={{ '--bl': '1' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> Reached target FRONTEND.CORE
            </p>
            <p className="boot-line" style={{ '--bl': '2' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> Mounting PROJECT.FILESYSTEM
            </p>
            <p className="boot-line" style={{ '--bl': '3' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> Started RENDER.ENGINE v4.2.1
            </p>
            <p className="boot-line" style={{ '--bl': '4' } as React.CSSProperties}>
              <span className="boot-warn">[ WARN ]</span> Skills above average — proceed with caution
            </p>
            <p className="boot-line" style={{ '--bl': '5' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> Loading PROJECTS.DB ...
            </p>

            <div className="boot-bar-wrap" style={{ '--bl': '6' } as React.CSSProperties}>
              <span className="boot-bar-label">LOADING</span>
              <div className="boot-bar">
                <div className="boot-bar-fill" />
              </div>
              <span className="boot-bar-pct" />
            </div>

            <p className="boot-line boot-complete" style={{ '--bl': '7' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> BOOT COMPLETE &mdash; LAUNCHING PROJECTS_
            </p>
          </div>

          {/* Wipe overlay fades to black then 8-bit green kicks in */}
          <div className="boot-wipe" aria-hidden="true" />
        </div>
      </section>

      {/* Screen 3 — 8-bit Projects */}
      <section className="screen screen-pixel" id="projects">
        <div className="pixel-sticky-frame">
          <div className="pixel-scanline" aria-hidden="true" />

          <header className="pixel-header">
            <span className="pixel-logo">&#9632;&#9632;&#9632; MZT.EXE &#9632;&#9632;&#9632;</span>
            <span className="pixel-lives">&#9829;&#9829;&#9829; PROJECTS</span>
          </header>

          <div className="pixel-content">
            <p className="pixel-label">&gt; SELECT PROJECT_</p>

            <div className="pixel-grid">
              <article className="pixel-card" style={{ '--delay': '0' } as React.CSSProperties}>
                <div className="pixel-card-icon">&#128187;</div>
                <h3 className="pixel-card-title">PROJECT_01</h3>
                <p className="pixel-card-name">Portfolio Site</p>
                <p className="pixel-card-stack">React · TS · Vite</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">FRONTEND</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>

              <article className="pixel-card" style={{ '--delay': '1' } as React.CSSProperties}>
                <div className="pixel-card-icon">&#128202;</div>
                <h3 className="pixel-card-title">PROJECT_02</h3>
                <p className="pixel-card-name">Dashboard App</p>
                <p className="pixel-card-stack">React · Node · SQL</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">FULLSTACK</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>

              <article className="pixel-card" style={{ '--delay': '2' } as React.CSSProperties}>
                <div className="pixel-card-icon">&#128241;</div>
                <h3 className="pixel-card-title">PROJECT_03</h3>
                <p className="pixel-card-name">Mobile UI Kit</p>
                <p className="pixel-card-stack">React Native · TS</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">MOBILE</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>

              <article className="pixel-card" style={{ '--delay': '3' } as React.CSSProperties}>
                <div className="pixel-card-icon">&#128274;</div>
                <h3 className="pixel-card-title">PROJECT_04</h3>
                <p className="pixel-card-name">Auth Service</p>
                <p className="pixel-card-stack">Node · JWT · MongoDB</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">BACKEND</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>
            </div>

            <p className="pixel-insert">INSERT COIN TO SEE MORE</p>
          </div>
        </div>
      </section>

      </div>
  )
}
