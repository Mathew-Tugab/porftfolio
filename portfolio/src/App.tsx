import { useEffect, useRef, useState } from 'react'
import './App.css'
import MobileApp from './components/MobileApp'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './components/ui/carousel'
import { Card, CardContent } from './components/ui/card'
import spriteImg from './assets/mesprite.png'
import bb1 from './assets/1.png'
import bb2 from './assets/2.png'
import bb3 from './assets/3.png'
import bb4 from './assets/4.png'
import bb5 from './assets/5.png'
import bb6 from './assets/6.png'
import ojtA from './assets/a.png'
import ojtB from './assets/b.png'
import ojtC from './assets/c.png'
import ojtD from './assets/d.png'
import ojtE from './assets/e.png'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

const bbImgs = [bb1, bb2, bb3, bb4, bb5, bb6]
const ojtImgs = [ojtE, ojtD, ojtC, ojtB, ojtA]

export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  const [scrollY, setScrollY] = useState(0)
  const [pipeState, setPipeState] = useState<'idle' | 'running' | 'done'>('idle')
  const [pipeAnim, setPipeAnim] = useState(0)     // 0 → 1 over ~2.2 s
  const pipeRafRef = useRef<number | null>(null)
  const [bootState, setBootState] = useState<'idle' | 'running' | 'done'>('idle')
  const [bootAnim, setBootAnim] = useState(0)
  const rafRef = useRef<number | null>(null)

  // Sprite
  const [hitCardIdx, setHitCardIdx] = useState<number | null>(null)
  const [showProject01, setShowProject01] = useState(false)
  const [showProject02, setShowProject02] = useState(false)
  const keysRef       = useRef<Set<string>>(new Set())
  const pixelFrameRef = useRef<HTMLDivElement>(null)
  const cardRefs      = useRef<(HTMLElement | null)[]>([null, null, null, null])
  const spriteRef     = useRef<HTMLDivElement>(null)
  const pixelGridRef  = useRef<HTMLDivElement>(null)
  const spriteGameRef = useRef<number | null>(null)
  const spriteActiveRef  = useRef(false)
  const spriteControlled = useRef(false)
  const [isControlled, setIsControlled] = useState(false)

  // Detect mobile / respond to resize (e.g. DevTools responsive mode)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Trigger pipe cutscene when user scrolls into the transition zone
  useEffect(() => {
    if (isMobile) return
    const pipeStart = (window.innerHeight || 800) * 3.2
    if (pipeState === 'idle' && scrollY >= pipeStart) {
      if (scrollY > pipeStart + (window.innerHeight || 800) * 0.5) {
        // Already past — skip everything
        setPipeState('done')
        setPipeAnim(1)
        setBootState('done')
        setBootAnim(1)
      } else {
        setPipeState('running')
      }
    }
  }, [scrollY, pipeState, isMobile])

  // Pipe cutscene animation — locks scroll, runs ~2.2s, then kicks off boot
  useEffect(() => {
    if (isMobile || pipeState !== 'running') return

    const lockedY = window.scrollY
    const prevent = (e: Event) => e.preventDefault()
    const snapBack = () => window.scrollTo(0, lockedY)
    const preventKeys = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End']
      if (scrollKeys.includes(e.code)) e.preventDefault()
    }
    window.addEventListener('wheel', prevent, { passive: false })
    window.addEventListener('touchmove', prevent, { passive: false })
    window.addEventListener('scroll', snapBack)
    window.addEventListener('keydown', preventKeys)

    const cleanupPipe = () => {
      if (pipeRafRef.current !== null) cancelAnimationFrame(pipeRafRef.current)
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('touchmove', prevent)
      window.removeEventListener('scroll', snapBack)
      window.removeEventListener('keydown', preventKeys)
    }

    const duration = 2200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setPipeAnim(t)
      if (t < 1) {
        pipeRafRef.current = requestAnimationFrame(tick)
      } else {
        cleanupPipe()
        setPipeState('done')
        setBootState('running')
      }
    }
    pipeRafRef.current = requestAnimationFrame(tick)
    return cleanupPipe
  }, [pipeState, isMobile])

  // Run animation, lock scroll on ALL input methods, then auto-scroll to projects
  useEffect(() => {
    if (isMobile || bootState !== 'running') return

    // Capture the scroll position to lock to
    const lockedY = window.scrollY

    const prevent = (e: Event) => e.preventDefault()

    // Snap back immediately if anything moves the scroll (scrollbar drag, keyboard, etc.)
    const snapBack = () => window.scrollTo(0, lockedY)

    // Block keyboard scroll keys
    const preventKeys = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End']
      if (scrollKeys.includes(e.code)) e.preventDefault()
    }

    window.addEventListener('wheel', prevent, { passive: false })
    window.addEventListener('touchmove', prevent, { passive: false })
    window.addEventListener('scroll', snapBack)
    window.addEventListener('keydown', preventKeys)

    const cleanup = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('touchmove', prevent)
      window.removeEventListener('scroll', snapBack)
      window.removeEventListener('keydown', preventKeys)
    }

    const duration = 3200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setBootAnim(t)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        cleanup()
        setBootState('done')
        setTimeout(() => {
          // scroll to pixelProgress=1 so all cards are revealed and sprite is active
          window.scrollTo({ top: (window.innerHeight || 800) * 5.0, behavior: 'smooth' })
        }, 350)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return cleanup
  }, [bootState, isMobile])

  // Close project page on ESC; navigate gallery with arrow keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowProject01(false); setShowProject02(false); return }
      if (!showProject01) return
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [showProject01, showProject02])

  // Arrow-key + Space listener — only active when sprite is controlled
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const isArrow = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
      const isSpace = e.code === 'Space'
      if ((isArrow || isSpace) && spriteControlled.current) {
        e.preventDefault()
        keysRef.current.add(isSpace ? 'Space' : e.key)
      }
    }
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key)
      if (e.code === 'Space') keysRef.current.delete('Space')
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  // Lock scroll while controlling sprite so arrow keys / space don't move the page
  useEffect(() => {
    if (isMobile || !isControlled) return
    const prevent = (e: Event) => e.preventDefault()
    const preventKeys = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault()
    }
    window.addEventListener('wheel', prevent, { passive: false })
    window.addEventListener('touchmove', prevent, { passive: false })
    window.addEventListener('keydown', preventKeys, { capture: true })
    return () => {
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('touchmove', prevent)
      window.removeEventListener('keydown', preventKeys, { capture: true })
    }
  }, [isControlled, isMobile])

  // RAF game loop — Mario-style platformer physics (desktop only)
  useEffect(() => {
    if (isMobile) return
    const s = { posX: -1, posY: -1, velX: 0, velY: 0, onGround: false, faceLeft: false, lastHitTime: 0, jumpHeld: false, camX: 0 }
    const GRAVITY = 0.7, JUMP_VEL = -20, WALK = 5, SW = 200, SH = 200
    // Head hitbox: top-centre of 200x200 sprite container
    const HX = 50, HY = 10, HW = 100, HH = 55

    const loop = () => {
      spriteGameRef.current = requestAnimationFrame(loop)
      const frame    = pixelFrameRef.current
      const spriteEl = spriteRef.current
      const gridEl   = pixelGridRef.current
      if (!frame || !spriteEl) return

      const fb = frame.getBoundingClientRect()
      const FLOOR_Y = fb.height - SH - 6

      // World width: extends beyond visible frame when grid overflows (small screens with big gaps)
      const WORLD_W = gridEl
        ? Math.max(fb.width, gridEl.offsetLeft + gridEl.offsetWidth + gridEl.offsetLeft)
        : fb.width

      // Spawn at floor as soon as frame is available - visible before click
      if (s.posX === -1) {
        s.posX = 48
        s.posY = FLOOR_Y
        s.camX = 0
        s.onGround = true
        spriteEl.style.transform = `translate(48px, ${Math.round(FLOOR_Y)}px)`
        return
      }

      // Idle: apply gravity only so sprite falls to floor if released mid-air
      if (!spriteControlled.current) {
        s.velY += GRAVITY
        s.posY += s.velY
        if (s.posY >= FLOOR_Y) { s.posY = FLOOR_Y; s.velY = 0; s.onGround = true }
        spriteEl.style.transform = `translate(${Math.round(s.posX - s.camX)}px, ${Math.round(s.posY)}px)`
        return
      }

      const keys = keysRef.current

      // Horizontal
      s.velX = 0
      if (keys.has('ArrowLeft'))  { s.velX = -WALK; s.faceLeft = true }
      if (keys.has('ArrowRight')) { s.velX =  WALK; s.faceLeft = false }

      // Jump — only trigger on fresh press (not hold)
      const jumpPressed = keys.has('ArrowUp') || keys.has('Space')
      if (jumpPressed && !s.jumpHeld && s.onGround) {
        s.velY = JUMP_VEL
        s.onGround = false
      }
      s.jumpHeld = jumpPressed

      // Gravity
      s.velY += GRAVITY

      // Move
      s.posX += s.velX
      s.posY += s.velY

      // Floor
      if (s.posY >= FLOOR_Y) {
        s.posY = FLOOR_Y
        s.velY = 0
        s.onGround = true
      }

      // Walls — use world width so sprite can scroll past the visible frame edge
      s.posX = Math.max(0, Math.min(WORLD_W - SW, s.posX))

      // Camera: follows sprite when world is wider than frame
      const CAM_MAX = Math.max(0, WORLD_W - fb.width)
      s.camX = Math.max(0, Math.min(CAM_MAX, s.posX - fb.width * 0.45))
      if (gridEl) gridEl.style.transform = `translateX(${-Math.round(s.camX)}px)`

      // Head-bump detection — only while moving UPWARD (like Mario hitting a block from below)
      const now = Date.now()
      if (s.velY < 0 && now - s.lastHitTime > 600) {
        const hx1 = fb.left + (s.posX - s.camX) + HX
        const hy1 = fb.top  + s.posY + HY
        const hx2 = hx1 + HW
        const hy2 = hy1 + HH
        for (let idx = 0; idx < cardRefs.current.length; idx++) {
          const card = cardRefs.current[idx]
          if (!card) continue
          const cr = card.getBoundingClientRect()
          if (hx1 < cr.right && hx2 > cr.left && hy1 < cr.bottom && hy2 > cr.top) {
            // Bounce sprite back down; push below card bottom so no repeated triggers
            s.velY = 8
            s.posY = cr.bottom - fb.top - HY + 4
            s.lastHitTime = now
            setHitCardIdx(idx)
            setTimeout(() => setHitCardIdx(prev => (prev === idx ? null : prev)), 700)
            if (idx === 0) {
              setShowProject01(true)
              spriteControlled.current = false
              setIsControlled(false)
              keysRef.current.clear()
            } else if (idx === 1) {
              setShowProject02(true)
              spriteControlled.current = false
              setIsControlled(false)
              keysRef.current.clear()
            } else {
              const href = (card as HTMLElement).dataset.href
              if (href && href !== '#') window.open(href, '_blank', 'noopener,noreferrer')
            }
            break  // only hit one card per jump — no double-opens
          }
        }
      }

      // Update DOM every frame
      const bob = (s.velX !== 0 && s.onGround) ? (Math.floor(now / 120) % 2) * 2 : 0
      spriteEl.style.transform = `translate(${Math.round(s.posX - s.camX)}px, ${Math.round(s.posY + bob)}px)`
      const img = spriteEl.querySelector('img') as HTMLImageElement | null
      if (img) img.style.transform = s.faceLeft ? 'scaleX(-1)' : ''
    }

    spriteGameRef.current = requestAnimationFrame(loop)
    return () => { if (spriteGameRef.current) cancelAnimationFrame(spriteGameRef.current) }
  }, [])

  // Mobile layout — rendered after all hooks so no rules-of-hooks violation
  if (isMobile) return <MobileApp />

  const vh = window.innerHeight || 800
  const progress = Math.min(1, Math.max(0, scrollY / vh))
  const gameProgress = Math.min(1, Math.max(0, (scrollY - vh * 0.6) / (vh * 0.9)))
  // fade game section to black over the last 40vh before boot triggers at 3.2×vh
  const gameExit = Math.min(1, Math.max(0, (scrollY - vh * 2.8) / (vh * 0.4)))
  // pixel section: game(220vh) + boot(100vh) = 420vh = 4.2×vh
  const pixelProgress = Math.min(1, Math.max(0, (scrollY - vh * 4.2) / (vh * 0.8)))
  // sprite activates (shows pointer events) once pixel content is on screen
  spriteActiveRef.current = pixelProgress > 0.5

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
    '--game-exit': gameExit.toFixed(4),
    '--pipe-p': pipeAnim.toFixed(4),
    '--boot-p': bootAnim.toFixed(4),
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
              <p>SINCE 2024
              </p>
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
      {/* Pipe cutscene overlay — always in DOM so assets are preloaded;
           hidden via CSS until pipeState is 'running' */}
      <div
        className={`pipe-cutscene${pipeState === 'running' ? ' pipe-cutscene--active' : ''}`}
        aria-hidden="true"
        style={{ '--pipe-p': pipeAnim.toFixed(4) } as React.CSSProperties}
      >
        {/* Sky / ground backdrop */}
        <div className="pipe-scene">
          {/* Ground strip */}
          <div className="pipe-ground" />
          {/* Pipe structure */}
          <div className="pipe-body">
            <div className="pipe-cap" />
            <div className="pipe-shaft" />
          </div>
          {/* Sprite walking then descending */}
          <div className="pipe-sprite">
            <img src={spriteImg} alt="" draggable={false} />
          </div>
          {/* "ENTERING PIPE..." caption */}
          <p className="pipe-caption">ENTERING NEXT AREA<span className="pipe-dots">...</span></p>
        </div>
      </div>

      {/* Boot transition: timer-driven 8-bit loading sequence — unmounted once done */}
      {bootState !== 'done' && (
      <section className="screen screen-boot">
        <div className="boot-sticky-frame">
          <div className="pixel-scanline" aria-hidden="true" />

          <div className={`boot-terminal${bootAnim >= 0.88 ? ' boot-terminal--done' : ''}`}>
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
          
            <p className="boot-line" style={{ '--bl': '5' } as React.CSSProperties}>
              <span className="boot-ok">[  OK  ]</span> Loading PROJECTS.DB ...
            </p>

            <div className="boot-bar-wrap">
              <span className="boot-bar-label">LOADING</span>
              <div className="boot-bar">
                <div className="boot-bar-fill" />
              </div>
              <span className="boot-bar-pct">
                {Math.round(Math.min(1, Math.max(0, (bootAnim - 0.50) / 0.33)) * 100)}%
              </span>
            </div>

            <p className="boot-line boot-complete">
              <span className="boot-ok">[  OK  ]</span> BOOT COMPLETE &mdash; LAUNCHING PROJECTS_
            </p>
          </div>
        </div>
      </section>
      )}

      {/* Screen 3 — 8-bit Projects */}
      <section className="screen screen-pixel" id="projects">
        <div className="pixel-sticky-frame" ref={pixelFrameRef}>
          <div className="pixel-scanline" aria-hidden="true" />

          <header className="pixel-header">
            <span className="pixel-logo">&#9632;&#9632;&#9632; MZT.EXE &#9632;&#9632;&#9632;</span>
            <span className="pixel-lives">&#9829;&#9829;&#9829; PROJECTS</span>
          </header>

          <div className="pixel-content">

            {/* ── Decorative top area ── */}
            <div className="pixel-top-deco">
              <p className="pixel-deco-sub">— WORLD 1-1 —</p>
              <h2 className="pixel-deco-title">PROJECTS<span className="pixel-deco-blink">█</span></h2>
              <div className="pixel-deco-hud">
                <div className="pixel-hud-col">
                  <span className="pixel-hud-label">SCORE</span>
                  <span className="pixel-hud-val">008450</span>
                </div>
                <div className="pixel-hud-col">
                  <span className="pixel-hud-label">COINS</span>
                  <span className="pixel-hud-val">&#9711;&nbsp;&times;&nbsp;04</span>
                </div>
                <div className="pixel-hud-col">
                  <span className="pixel-hud-label">WORLD</span>
                  <span className="pixel-hud-val">1 &#8209; 1</span>
                </div>
                <div className="pixel-hud-col">
                  <span className="pixel-hud-label">TIME</span>
                  <span className="pixel-hud-val pixel-hud-time">388</span>
                </div>
              </div>

              {/* Floating ? blocks + platform — purely decorative */}
              <div className="pixel-deco-scene" aria-hidden="true">
                <div className="pixel-deco-row">
                  <div className="pixel-q-block" style={{ '--bob-delay': '0s' } as React.CSSProperties}>?</div>
                </div>
                <div className="pixel-deco-platform" />
                <div className="pixel-deco-row">
                  <div className="pixel-q-block" style={{ '--bob-delay': '0.3s' } as React.CSSProperties}>?</div>
                  <div className="pixel-q-block pixel-q-block--coin" style={{ '--bob-delay': '0.15s' } as React.CSSProperties}>&#9711;</div>
                  <div className="pixel-q-block" style={{ '--bob-delay': '0.45s' } as React.CSSProperties}>?</div>
                </div>
              </div>
            </div>

            <p className="pixel-label">&gt; SELECT PROJECT_</p>

            <div className="pixel-grid" ref={pixelGridRef}>
              <article
                className={`pixel-card${hitCardIdx === 0 ? ' pixel-card--hit' : ''}`}
                style={{ '--delay': '0' } as React.CSSProperties}
                ref={(el) => { cardRefs.current[0] = el }}
                data-href="#"
              >
                <div className="pixel-card-icon">&#127795;</div>
                <h3 className="pixel-card-title">PROJECT_01</h3>
                <p className="pixel-card-name">Bantay Bakir</p>
                <p className="pixel-card-stack">React Native · Node.js · Firebase</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">THESIS · GIS</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>

              <article
                className={`pixel-card${hitCardIdx === 1 ? ' pixel-card--hit' : ''}`}
                style={{ '--delay': '1' } as React.CSSProperties}
                ref={(el) => { cardRefs.current[1] = el }}
                data-href="#proj02"
              >
                <div className="pixel-card-icon">&#128184;</div>
                <h3 className="pixel-card-title">PROJECT_02</h3>
                <p className="pixel-card-name">OJT Finance Tracker</p>
                <p className="pixel-card-stack">JavaScript · MongoDB · Node.js</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">OJT · FINTECH</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>

              <article
                className={`pixel-card${hitCardIdx === 2 ? ' pixel-card--hit' : ''}`}
                style={{ '--delay': '2' } as React.CSSProperties}
                ref={(el) => { cardRefs.current[2] = el }}
                data-href="#"
              >
                <div className="pixel-card-icon">&#128241;</div>
                <h3 className="pixel-card-title">PROJECT_03</h3>
                <p className="pixel-card-name">Mobile UI Kit</p>
                <p className="pixel-card-stack">React Native · TS</p>
                <div className="pixel-card-footer">
                  <span className="pixel-tag">MOBILE</span>
                  <a href="#" className="pixel-btn">PLAY &gt;</a>
                </div>
              </article>

              <article
                className={`pixel-card${hitCardIdx === 3 ? ' pixel-card--hit' : ''}`}
                style={{ '--delay': '3' } as React.CSSProperties}
                ref={(el) => { cardRefs.current[3] = el }}
                data-href="#"
              >
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

          </div>

          {/* Sprite — click to take control, click again to release */}
          <div
            ref={spriteRef}
            className={`sprite${isControlled ? ' sprite--active' : ''}`}
            style={{ pointerEvents: spriteActiveRef.current ? 'auto' : 'none', cursor: isControlled ? 'crosshair' : 'pointer' }}
            onClick={() => {
              const next = !spriteControlled.current
              spriteControlled.current = next
              setIsControlled(next)
              keysRef.current.clear()
            }}
            aria-label={isControlled ? 'Click to release sprite control' : 'Click to control sprite'}
          >
            <img src={spriteImg} alt="" draggable={false} />
            {!isControlled && (
              <div className="sprite-click-bubble">
                CLICK ME!
                <span className="sprite-click-arrow">&#9660;</span>
              </div>
            )}
          </div>
          <p className="sprite-hint">
            {isControlled
              ? <>&larr; &rarr;&nbsp; WALK &nbsp;&middot;&nbsp; &uarr; / SPACE&nbsp; JUMP &nbsp;&middot;&nbsp; HEADBUTT A PROJECT BLOCK FROM BELOW TO OPEN IT &nbsp;&middot;&nbsp; CLICK TO RELEASE</>
              : <>&#9664; TAKE CONTROL &mdash; WALK UNDER A PROJECT CARD &amp; JUMP TO HEADBUTT IT OPEN &#9654;</>}
          </p>
        </div>
      </section>

      {/* Bantay Bakir — full-page project showcase */}
      {showProject02 && (
        <div className="proj-page proj-page--finance" role="dialog" aria-modal="true" aria-label="OJT Finance Tracker project showcase">
          <div className="proj-bg-glow" aria-hidden="true" />

          <nav className="proj-nav">
            <button className="proj-back" onClick={() => setShowProject02(false)}>
              ← Back
            </button>
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

            {/* Right — image gallery */}
            <div className="proj-gallery proj-gallery--landscape">
              <Carousel opts={{ align: 'start' }} className="w-full max-w-2xl">
                <CarouselContent>
                  {ojtImgs.map((src, i) => (
                    <CarouselItem key={i}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                          <img
                            src={src}
                            alt={`OJT Finance Tracker screenshot ${i + 1}`}
                            className="proj-gallery-img w-full h-auto rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      )}

      {showProject01 && (
        <div className="proj-page proj-page--forest" role="dialog" aria-modal="true" aria-label="Bantay Bakir project showcase">
          <div className="proj-bg-glow" aria-hidden="true" />

          {/* Navigation bar */}
          <nav className="proj-nav">
            <button className="proj-back" onClick={() => setShowProject01(false)}>
              ← Back
            </button>
            <span className="proj-nav-crumb">Portfolio / Project 01 / Bantay Bakir</span>
            <div className="proj-nav-tags">
              <span className="proj-nav-tag">THESIS</span>
              <span className="proj-nav-tag">GIS</span>
              <span className="proj-nav-tag">MOBILE</span>
            </div>
          </nav>

          {/* Two-column body */}
          <div className="proj-body">

            {/* Left — text */}
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

            {/* Right — image gallery */}
            <div className="proj-gallery">
              <Carousel opts={{ align: 'start' }} className="w-full max-w-xs">
                <CarouselContent>
                  {bbImgs.map((src, i) => (
                    <CarouselItem key={i}>
                      <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                          <img
                            src={src}
                            alt={`Bantay Bakir screenshot ${i + 1}`}
                            className="proj-gallery-img w-full h-auto rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

          </div>
        </div>
      )}

      </div>
  )
}
