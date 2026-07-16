import { useState, useEffect, useRef } from 'react'
import type React from 'react'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { Card, CardContent } from './ui/card'
import spriteImg from '../assets/mesprite.png'
import bb1 from '../assets/1.png'
import bb2 from '../assets/2.png'
import bb3 from '../assets/3.png'
import bb4 from '../assets/4.png'
import bb5 from '../assets/5.png'
import bb6 from '../assets/6.png'
import ojtA from '../assets/a.png'
import ojtB from '../assets/b.png'
import ojtC from '../assets/c.png'
import ojtD from '../assets/d.png'
import ojtE from '../assets/e.png'

const bbImgs  = [bb1, bb2, bb3, bb4, bb5, bb6]
const ojtImgs = [ojtE, ojtD, ojtC, ojtB, ojtA]

const SKILLS = [
  { tag: 'REACT',       w: 92 },
  { tag: 'TYPESCRIPT',  w: 88 },
  { tag: 'NODE.JS',     w: 78 },
  { tag: 'UI / UX',     w: 85 },
  { tag: 'SQL / NoSQL', w: 72 },
]

export default function MobileApp() {
  const [showProject01, setShowProject01] = useState(false)
  const [showProject02, setShowProject02] = useState(false)
  const [skillsIn, setSkillsIn]     = useState(false)
  const [projectsIn, setProjectsIn] = useState(false)
  const skillsRef  = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)

  // Lock body scroll while a modal is open
  useEffect(() => {
    document.body.style.overflow = (showProject01 || showProject02) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showProject01, showProject02])

  // ESC to close modals
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowProject01(false); setShowProject02(false) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  // Reveal skills section (bars + text) when it scrolls into view
  useEffect(() => {
    const el = skillsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSkillsIn(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Reveal projects section when it scrolls into view
  useEffect(() => {
    const el = projectsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setProjectsIn(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="m-page">
      {/* Persistent overlays */}
      <div className="noise" aria-hidden="true" />
      <div className="m-crt-grid" aria-hidden="true" />

      {/* ═══════════════════════════════════════
          SECTION 1 — LANDING
      ═══════════════════════════════════════ */}
      <section className="m-landing">
        {/* Blue ambient glow — mirrors desktop initial state */}
        <div className="m-landing-glow" aria-hidden="true" />

        <nav className="m-nav">
          <span className="m-nav-brand">MATHEW ZEUS B. TUGAB</span>
          <ul className="m-nav-links">
            <li><a href="#m-work">WORK</a></li>
            <li><a href="#m-contact">CONTACT</a></li>
          </ul>
        </nav>

        <div className="m-hero">
          <p className="m-hero-eyebrow">FULLSTACK DEVELOPER</p>
          <h1 className="m-hero-h1">
            <span className="m-hero-line">Full</span>
            <span className="m-hero-line m-hero-line--right">stack</span>
            <em className="m-hero-accent">frontend<br />Focused</em>
          </h1>
        </div>

        <div className="m-landing-footer">
          <div className="m-info-row">
            <div className="m-info-col">
              <p>WEB &amp; MOBILE / REACT</p>
              <p>/ NODE.JS / TYPESCRIPT</p>
            </div>
            <div className="m-info-col">
              <p>BASED IN</p>
              <p>PHILIPPINES</p>
            </div>
            <div className="m-info-col">
              <p>BUILDING</p>
              <p>SINCE 2024</p>
            </div>
          </div>
          <p className="m-info-muted">OPEN TO FULLTIME &amp; FREELANCE WORLDWIDE</p>
          <div className="m-scroll-cue" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — SKILLS
      ═══════════════════════════════════════ */}
      <section
        className={`m-skills${skillsIn ? ' m-skills--in' : ''}`}
        id="m-work"
        ref={skillsRef as React.RefObject<HTMLElement>}
      >
        <div className="m-skills-hud">
          <span>// PORTFOLIO.exe</span>
          <span>PLAYER_01 &gt; MATHEW_ZEUS</span>
        </div>
        <p className="m-skills-eyebrow">SELECT MISSION</p>
        <h2 className="m-skills-title">SKILL_TREE<span className="cursor">_</span></h2>

        <ul className="m-skill-list">
          {SKILLS.map(({ tag, w }) => (
            <li key={tag} className="m-skill-row">
              <span className="m-skill-tag">{tag}</span>
              <div className="m-skill-bar">
                <div
                  className="m-skill-fill"
                  style={{ width: skillsIn ? `${w}%` : '0%' }}
                />
              </div>
              <span className="m-skill-val">{w}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — PROJECTS
      ═══════════════════════════════════════ */}
      <section
        className={`m-projects${projectsIn ? ' m-projects--in' : ''}`}
        id="m-projects"
        ref={projectsRef as React.RefObject<HTMLElement>}
      >
        {/* Pixel header bar */}
        <div className="m-pix-header">
          <span className="pixel-logo">&#9632;&#9632;&#9632; MZT.EXE &#9632;&#9632;&#9632;</span>
          <span className="pixel-lives">&#9829;&#9829;&#9829; PROJECTS</span>
        </div>

        {/* Title + HUD */}
        <div className="m-pix-top">
          <p className="pixel-deco-sub">— WORLD 1-1 —</p>
          <h2 className="m-pix-title">PROJECTS<span className="pixel-deco-blink">&#9608;</span></h2>
          <div className="pixel-deco-hud">
            <div className="pixel-hud-col">
              <span className="pixel-hud-label">SCORE</span>
              <span className="pixel-hud-val">008450</span>
            </div>
            <div className="pixel-hud-col">
              <span className="pixel-hud-label">COINS</span>
              <span className="pixel-hud-val">&#9711;&nbsp;&#215;&nbsp;04</span>
            </div>
            <div className="pixel-hud-col">
              <span className="pixel-hud-label">WORLD</span>
              <span className="pixel-hud-val">1&#8209;1</span>
            </div>
          </div>
        </div>

        <p className="pixel-label m-pix-label">&gt; SELECT PROJECT_</p>

        {/* 2-column tappable card grid */}
        <div className="m-card-grid">
          <article
            className="pixel-card m-card-tap"
            onClick={() => setShowProject01(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setShowProject01(true)}
          >
            <div className="pixel-card-icon">&#127795;</div>
            <h3 className="pixel-card-title">PROJECT_01</h3>
            <p className="pixel-card-name">Bantay Bakir</p>
            <p className="pixel-card-stack">React Native · Node.js · Firebase</p>
            <div className="pixel-card-footer">
              <span className="pixel-tag">THESIS · GIS</span>
              <span className="pixel-btn">PLAY &gt;</span>
            </div>
          </article>

          <article
            className="pixel-card m-card-tap"
            onClick={() => setShowProject02(true)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setShowProject02(true)}
          >
            <div className="pixel-card-icon">&#128184;</div>
            <h3 className="pixel-card-title">PROJECT_02</h3>
            <p className="pixel-card-name">OJT Finance Tracker</p>
            <p className="pixel-card-stack">JavaScript · MongoDB · Node.js</p>
            <div className="pixel-card-footer">
              <span className="pixel-tag">OJT · FINTECH</span>
              <span className="pixel-btn">PLAY &gt;</span>
            </div>
          </article>

        </div>

        {/* Decorative sprite */}
        <div className="m-sprite-deco" aria-hidden="true">
          <img src={spriteImg} alt="" draggable={false} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROJECT 01 MODAL — Bantay Bakir
      ═══════════════════════════════════════ */}
      {showProject01 && (
        <div className="proj-page proj-page--forest" role="dialog" aria-modal="true" aria-label="Bantay Bakir project showcase">
          <div className="proj-bg-glow" aria-hidden="true" />

          <nav className="proj-nav">
            <button className="proj-back" onClick={() => setShowProject01(false)}>← Back</button>
            <span className="proj-nav-crumb">Portfolio / Project 01 / Bantay Bakir</span>
            <div className="proj-nav-tags">
              <span className="proj-nav-tag">THESIS</span>
              <span className="proj-nav-tag">GIS</span>
              <span className="proj-nav-tag">MOBILE</span>
            </div>
          </nav>

          <div className="proj-body">
            <div className="proj-info">
              <p className="proj-eyebrow">PROJECT_01 &mdash; 2024</p>
              <h1 className="proj-title">BANTAY<br />BAKIR</h1>
              <p className="proj-tagline">QR-Based Tree Tagging G.I.S.<br />for DENR Bayombong</p>
              <div className="proj-divider" />

              <p className="proj-section-label">About</p>
              <p className="proj-desc">
                A cross-platform mobile GIS built with React Native to modernize forest inventory
                for the Department of Environment and Natural Resources (DENR) in Bayombong.
                I authored the full thesis paper, conducted original field research, and led the
                entire system design — identifying critical gaps in manual workflows and architecting
                a solution that replaces paper-based processes with QR-tagged trees, automated
                data capture, and real-time cloud synchronization.
              </p>

              <p className="proj-section-label">Key Features</p>
              <ul className="proj-features">
                <li>Captures DBH, Merchantable Height &amp; tree health status on-site</li>
                <li>Real-time Firebase sync with centralized admin dashboard &amp; reporting</li>
                <li>GIS-based GPS location tracking for accurate forest mapping</li>
                <li>QR-coded tree tags replacing manual paper-based field recording</li>
                <li>Enables evidence-based conservation planning for DENR personnel</li>
              </ul>

              <div className="proj-roles">
                <span className="proj-role">THESIS AUTHOR</span>
                <span className="proj-role">LEAD RESEARCHER</span>
                <span className="proj-role">SYSTEM ARCHITECT</span>
              </div>

              <div className="proj-stack-row">
                <span className="proj-stack-tag">REACT NATIVE</span>
                <span className="proj-stack-tag">NODE.JS</span>
                <span className="proj-stack-tag">FIREBASE</span>
                <span className="proj-stack-tag">GIS</span>
                <span className="proj-stack-tag">QR</span>
              </div>
            </div>

            <div className="proj-gallery">
              <Carousel opts={{ align: 'start' }} className="w-full max-w-xs">
                <CarouselContent>
                  {bbImgs.map((src, i) => (
                    <CarouselItem key={i}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                          <img src={src} alt={`Bantay Bakir screenshot ${i + 1}`} className="proj-gallery-img w-full h-auto rounded-lg" />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          PROJECT 02 MODAL — OJT Finance Tracker
      ═══════════════════════════════════════ */}
      {showProject02 && (
        <div className="proj-page proj-page--finance" role="dialog" aria-modal="true" aria-label="OJT Finance Tracker project showcase">
          <div className="proj-bg-glow" aria-hidden="true" />

          <nav className="proj-nav">
            <button className="proj-back" onClick={() => setShowProject02(false)}>← Back</button>
            <span className="proj-nav-crumb">Portfolio / Project 02 / OJT Finance Tracker</span>
            <div className="proj-nav-tags">
              <span className="proj-nav-tag">OJT</span>
              <span className="proj-nav-tag">FINTECH</span>
              <span className="proj-nav-tag">FULLSTACK</span>
            </div>
          </nav>

          <div className="proj-body">
            <div className="proj-info">
              <p className="proj-eyebrow">PROJECT_02 &mdash; 2025</p>
              <h1 className="proj-title">OJT<br />FINANCE<br />TRACKER</h1>
              <p className="proj-tagline">Payment Tracking &amp; Follow-Up System<br />integrated with Google Forms</p>
              <div className="proj-divider" />

              <p className="proj-section-label">About</p>
              <p className="proj-desc">
                A full-stack finance web application built during my OJT that automates payment
                tracking by pulling submission data directly from Google Forms. The system
                monitors pending and completed payments, flags overdue accounts, and sends
                follow-up notifications — replacing manual spreadsheet workflows with a
                real-time dashboard backed by MongoDB Atlas.
              </p>

              <p className="proj-section-label">Key Features</p>
              <ul className="proj-features">
                <li>Ingests payment submissions from Google Forms automatically</li>
                <li>Real-time payment status dashboard with overdue flagging</li>
                <li>Automated follow-up reminders for pending payments</li>
                <li>MongoDB Atlas for scalable, cloud-hosted data storage</li>
                <li>Deployed on Vercel (frontend) and Render (backend)</li>
              </ul>

              <div className="proj-roles">
                <span className="proj-role">SOLE DEVELOPER</span>
                <span className="proj-role">OJT PROJECT</span>
              </div>

              <div className="proj-stack-row">
                <span className="proj-stack-tag">JAVASCRIPT</span>
                <span className="proj-stack-tag">NODE.JS</span>
                <span className="proj-stack-tag">MONGODB ATLAS</span>
                <span className="proj-stack-tag">GOOGLE FORMS</span>
                <span className="proj-stack-tag">VERCEL</span>
                <span className="proj-stack-tag">RENDER</span>
              </div>
            </div>

            <div className="proj-gallery proj-gallery--landscape">
              <Carousel opts={{ align: 'start' }} className="w-full max-w-2xl">
                <CarouselContent>
                  {ojtImgs.map((src, i) => (
                    <CarouselItem key={i}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                          <img src={src} alt={`OJT Finance Tracker screenshot ${i + 1}`} className="proj-gallery-img w-full h-auto rounded-lg" />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
