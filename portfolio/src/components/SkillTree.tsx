import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SkillTree.css'

// ─── Data ─────────────────────────────────────────────────────────────────────

type SkillLevel = 'Advanced' | 'Intermediate' | 'Learning'

interface Skill {
  name: string
  level: SkillLevel
  value: number
}

interface Category {
  id: string
  skills: Skill[]
}

const CATEGORIES: Category[] = [
  {
    id: 'FRONTEND',
    skills: [
      { name: 'React',      level: 'Advanced',     value: 92 },
      { name: 'TypeScript', level: 'Advanced',     value: 88 },
      { name: 'Next.js',    level: 'Intermediate', value: 72 },
      { name: 'HTML / CSS', level: 'Advanced',     value: 90 },
    ],
  },
  {
    id: 'BACKEND',
    skills: [
      { name: 'Node.js',      level: 'Intermediate', value: 78 },
      { name: 'Express',      level: 'Intermediate', value: 75 },
      { name: 'ASP.NET Core', level: 'Learning',     value: 40 },
    ],
  },
  {
    id: 'DATABASES',
    skills: [
      { name: 'MongoDB',    level: 'Intermediate', value: 72 },
      { name: 'PostgreSQL', level: 'Intermediate', value: 65 },
      { name: 'MySQL',      level: 'Intermediate', value: 68 },
    ],
  },
  {
    id: 'TOOLS',
    skills: [
      { name: 'Git',    level: 'Advanced',     value: 85 },
      { name: 'Docker', level: 'Learning',     value: 45 },
      { name: 'Linux',  level: 'Intermediate', value: 70 },
      { name: 'Azure',  level: 'Learning',     value: 38 },
    ],
  },
]

const PROFILE_ROWS: Array<{ label: string; value: string; highlight?: boolean }> = [
  { label: 'NAME',            value: 'Mathew Zeus Tugab' },
  { label: 'CLASS',           value: 'Full Stack Developer' },
  { label: 'STATUS',          value: 'Available for Opportunities', highlight: true },
  { label: 'LOCATION',        value: 'Philippines' },
  { label: 'CURRENT MISSION', value: 'Building scalable web apps' },
]

const MISSIONS = [
  'TreePlotter GIS',
  'QR Tree Monitoring System',
  'Restaurant Management System',
  'Currently gaining XP in BPLO',
]

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = (delayChildren = 0, staggerChildren = 0.07) => ({
  hidden: {},
  show:   { transition: { delayChildren, staggerChildren } },
})

// ─── Main component ────────────────────────────────────────────────────────────

export default function SkillTree({ gameP }: { gameP: number }) {
  const [active, setActive] = useState(false)

  // Fire once when game section is visible enough
  useEffect(() => {
    if (gameP > 0.3 && !active) setActive(true)
  }, [gameP, active])

  return (
    <div className="st-root">
      <ParticlesCanvas active={active} />

      {/* ── Left column ── */}
      <motion.div
        className="st-left"
        variants={stagger(0, 0.08)}
        initial="hidden"
        animate={active ? 'show' : 'hidden'}
      >
        {/* Header */}
        <motion.div className="st-header" variants={fadeUp}>
          <p className="st-eyebrow">SELECT MISSION</p>
          <h2 className="st-title">
            SKILL_TREE<span className="st-cursor">_</span>
          </h2>
        </motion.div>

        {/* Bio */}
        <motion.div className="st-bio-panel" variants={fadeUp}>
          <span className="st-section-tag">PROFILE</span>
          <p className="st-bio">
            Full Stack Developer passionate about building modern web applications
            that solve real-world problems. Experienced with React, Node.js,
            TypeScript, and database technologies, with a strong interest in
            clean UI, scalable systems, and continuous learning.
          </p>
        </motion.div>

        {/* Skill categories 2×2 grid */}
        <motion.div className="st-cats-grid" variants={stagger(0.15, 0.07)}>
          {CATEGORIES.map((cat, ci) => (
            <motion.div key={cat.id} className="st-category" variants={fadeUp}>
              <p className="st-cat-label">{cat.id}</p>
              {cat.skills.map((skill, si) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  active={active}
                  barDelay={0.45 + ci * 0.12 + si * 0.08}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right column ── */}
      <motion.div
        className="st-right"
        variants={stagger(0.1, 0.1)}
        initial="hidden"
        animate={active ? 'show' : 'hidden'}
      >
        {/* Player profile glass panel */}
        <motion.div className="st-panel" variants={fadeUp}>
          <div className="st-panel-head">
            <span className="st-panel-title">PLAYER PROFILE</span>
            <span className="st-panel-dot" />
          </div>

          <motion.div className="st-profile-body" variants={stagger(0.05, 0.06)}>
            {PROFILE_ROWS.map(({ label, value, highlight }) => (
              <motion.div key={label} className="st-prow" variants={fadeUp}>
                <span className="st-prow-label">{label}</span>
                <span className={`st-prow-value${highlight ? ' st-prow-value--status' : ''}`}>
                  {value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="st-stats-row">
            <StatBox num="24"     label="LEVEL" active={active} delay={0.55} />
            <div className="st-stat-sep" />
            <StatBox num="12,840" label="XP"    active={active} delay={0.63} />
          </div>
        </motion.div>

        {/* Mission log */}
        <MissionLog active={active} />
      </motion.div>
    </div>
  )
}

// ─── SkillRow ──────────────────────────────────────────────────────────────────

function SkillRow({
  skill,
  active,
  barDelay,
}: {
  skill: Skill
  active: boolean
  barDelay: number
}) {
  const badgeClass =
    skill.level === 'Advanced'
      ? 'st-lvl-adv'
      : skill.level === 'Intermediate'
      ? 'st-lvl-mid'
      : 'st-lvl-learn'

  return (
    <motion.div className="st-skill" variants={fadeUp}>
      <span className="st-skill-name">{skill.name}</span>
      <div className="st-bar-track">
        <div
          className={`st-bar-fill${active ? ' st-bar-go' : ''}`}
          style={
            {
              '--fill-w':    `${skill.value}%`,
              '--fill-delay': `${barDelay}s`,
            } as React.CSSProperties
          }
        />
      </div>
      <span className={`st-skill-badge ${badgeClass}`}>{skill.level}</span>
    </motion.div>
  )
}

// ─── StatBox ──────────────────────────────────────────────────────────────────

function StatBox({
  num,
  label,
  active,
  delay,
}: {
  num: string
  label: string
  active: boolean
  delay: number
}) {
  return (
    <motion.div
      className="st-stat-box"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <span className="st-stat-num">{num}</span>
      <span className="st-stat-lbl">{label}</span>
    </motion.div>
  )
}

// ─── MissionLog ───────────────────────────────────────────────────────────────

function MissionLog({ active }: { active: boolean }) {
  const [done, setDone]     = useState<string[]>([])
  const [typing, setTyping] = useState('')
  const idxRef    = useRef(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!active || startedRef.current) return
    startedRef.current = true

    let cancelled = false

    const typeNext = () => {
      const idx = idxRef.current
      if (idx >= MISSIONS.length || cancelled) return

      const mission = MISSIONS[idx]
      let ci = 0

      const typeChar = () => {
        if (cancelled) return
        ci++
        setTyping(mission.slice(0, ci))
        if (ci < mission.length) {
          setTimeout(typeChar, 42)
        } else {
          setTimeout(() => {
            if (cancelled) return
            setDone(prev => [...prev, mission])
            setTyping('')
            idxRef.current = idx + 1
            setTimeout(typeNext, 280)
          }, 120)
        }
      }

      setTimeout(typeChar, idx === 0 ? 750 : 180)
    }

    typeNext()
    return () => { cancelled = true }
  }, [active])

  return (
    <motion.div className="st-panel st-mission-panel" variants={fadeUp}>
      <div className="st-panel-head">
        <span className="st-panel-title">MISSION LOG</span>
        <span className="st-panel-dot" />
      </div>

      <div className="st-mission-list">
        <AnimatePresence initial={false}>
          {done.map((m, i) => (
            <motion.p
              key={`done-${i}`}
              className="st-mission-item st-mission-complete"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <span className="st-check">✔</span>
              <span>{m}</span>
            </motion.p>
          ))}
        </AnimatePresence>

        {typing && (
          <p className="st-mission-item st-mission-typing">
            <span className="st-check">▸</span>
            <span>
              {typing}
              <span className="st-cursor">_</span>
            </span>
          </p>
        )}

        {done.length === 0 && !typing && (
          <p className="st-mission-pending">
            <span className="st-cursor">_</span>
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Particles canvas ─────────────────────────────────────────────────────────

function ParticlesCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const COUNT = 28
    let rafId: number

    // Normalised coords (0-1) so resize doesn't need to reset positions
    const pts = Array.from({ length: COUNT }, () => ({
      nx:  Math.random(),
      ny:  Math.random(),
      vx:  (Math.random() - 0.5) * 0.00025,
      vy:  -(Math.random() * 0.00035 + 0.00008),
      r:   Math.random() * 1.4 + 0.4,
      a:   Math.random() * 0.32 + 0.06,
    }))

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.nx * w, p.ny * h, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,255,136,${p.a})`
        ctx.fill()
        p.nx += p.vx
        p.ny += p.vy
        if (p.ny < 0)            { p.ny = 1;              p.nx = Math.random() }
        if (p.nx < 0 || p.nx > 1) p.vx *= -1
      }
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="st-particles"
      aria-hidden="true"
    />
  )
}
