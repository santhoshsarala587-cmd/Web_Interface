import { useEffect, useMemo, useRef, useState, useId } from 'react'

/**
 * Dependency-free responsive SVG chart (line/area, bar, range).
 * - points: [{ label, tip, values: { [seriesKey]: number | null } }]
 * - series: [{ key, label, color, format(v) }]   (range kind uses keys `lo` and `hi`)
 * Interactive via pointer and keyboard (←/→), with a hidden data table for screen readers.
 */
const PAD = { t: 14, r: 14, b: 28, l: 44 }

function niceTicks(min, max, count = 4) {
  if (min === max) { min -= 1; max += 1 }
  const raw = (max - min) / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || raw
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step
  const ticks = []
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(6))
  return ticks
}

export default function Chart({ kind = 'line', points, series, height = 240, yLabel, title, description, zeroBase = false, maxLabels = 8, yMax }) {
  const wrap = useRef(null)
  const [w, setW] = useState(600)
  const [active, setActive] = useState(null)
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    if (!wrap.current) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, e.contentRect.width)))
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])

  const keys = kind === 'range' ? ['lo', 'hi'] : series.map((s) => s.key)
  const { ticks, y, x, bw } = useMemo(() => {
    const vals = points.flatMap((p) => keys.map((k) => p.values[k])).filter((v) => v != null && !Number.isNaN(v))
    let mn = vals.length ? Math.min(...vals) : 0
    let mx = vals.length ? Math.max(...vals) : 1
    if (zeroBase || kind === 'bar') mn = Math.min(0, mn)
    if (yMax != null) mx = Math.max(mx, yMax)
    const ticks = niceTicks(mn, mx)
    const dMin = ticks[0], dMax = ticks[ticks.length - 1]
    const iw = w - PAD.l - PAD.r, ih = height - PAD.t - PAD.b
    const n = points.length
    const slot = iw / Math.max(1, n)
    const x = (i) => (kind === 'line' ? PAD.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw) : PAD.l + slot * (i + 0.5))
    const y = (v) => PAD.t + ih - ((v - dMin) / (dMax - dMin || 1)) * ih
    return { ticks, y, x, bw: Math.min(34, slot * 0.6) }
  }, [points, w, height, kind, zeroBase, yMax]) // eslint-disable-line react-hooks/exhaustive-deps

  const n = points.length
  const labelEvery = Math.ceil(n / maxLabels)
  const fmt = (s, v) => (v == null ? '—' : s.format ? s.format(v) : v)

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = e.clientX - rect.left
    let best = 0, bd = Infinity
    for (let i = 0; i < n; i++) { const d = Math.abs(x(i) - px); if (d < bd) { bd = d; best = i } }
    setActive(best)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive((a) => Math.min(n - 1, (a ?? -1) + 1)) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive((a) => Math.max(0, (a ?? n) - 1)) }
    else if (e.key === 'Escape') setActive(null)
  }

  const linePath = (key) => {
    let d = '', pen = false
    points.forEach((p, i) => {
      const v = p.values[key]
      if (v == null) { pen = false; return }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`
      pen = true
    })
    return d
  }
  const base = y(Math.max(ticks[0], 0))
  const ap = active != null ? points[active] : null
  const tipLeft = active != null ? Math.min(Math.max(x(active), 90), w - 90) : 0

  return (
    <figure className="chart" ref={wrap}>
      {title && <figcaption className="chart-title">{title}</figcaption>}
      <div className="chart-body" style={{ height }}>
        <svg
          width={w} height={height} role="img" tabIndex={0}
          aria-label={`${title || 'Chart'}. ${description || ''} Use left and right arrow keys to inspect values.`}
          onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setActive(null)}
          onKeyDown={onKey} onBlur={() => setActive(null)}
        >
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.l} x2={w - PAD.r} y1={y(t)} y2={y(t)} className="chart-grid" />
              <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" className="chart-axis">{series[0]?.axisFormat ? series[0].axisFormat(t) : t}</text>
            </g>
          ))}
          {yLabel && <text x={12} y={PAD.t - 2} className="chart-axis chart-ylabel">{yLabel}</text>}
          {points.map((p, i) => (i % labelEvery === 0 ? <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="chart-axis">{p.label}</text> : null))}

          {kind === 'line' && series.map((s, si) => (
            <g key={s.key}>
              {si === 0 && <path d={`${linePath(s.key)} L${x(n - 1)} ${base} L${x(0)} ${base}Z`} fill={`url(#${uid}-${s.key})`} />}
              <path d={linePath(s.key)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          ))}
          {kind === 'bar' && series.map((s) => points.map((p, i) => {
            const v = p.values[s.key]; if (v == null) return null
            return <rect key={`${s.key}${i}`} x={x(i) - bw / 2} y={Math.min(y(v), base)} width={bw} height={Math.max(2, Math.abs(base - y(v)))} rx="5" fill={s.color} opacity={active == null || active === i ? 1 : 0.45} />
          }))}
          {kind === 'range' && points.map((p, i) => {
            const { lo, hi } = p.values; if (lo == null || hi == null) return null
            return <rect key={i} x={x(i) - bw / 2} y={y(hi)} width={bw} height={Math.max(6, y(lo) - y(hi))} rx={bw / 2} fill={`url(#${uid}-range)`} opacity={active == null || active === i ? 1 : 0.5} />
          })}
          {kind === 'range' && (
            <defs><linearGradient id={`${uid}-range`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--warm)" /><stop offset="100%" stopColor="var(--cool)" /></linearGradient></defs>
          )}

          {ap && <line x1={x(active)} x2={x(active)} y1={PAD.t} y2={height - PAD.b} className="chart-cursor" />}
          {ap && kind === 'line' && series.map((s) => ap.values[s.key] != null && <circle key={s.key} cx={x(active)} cy={y(ap.values[s.key])} r="5" fill={s.color} stroke="var(--surface-solid)" strokeWidth="2" />)}
        </svg>
        {ap && (
          <div className="chart-tip" style={{ left: tipLeft }} role="status">
            <strong>{ap.tip || ap.label}</strong>
            {kind === 'range'
              ? <>
                  <span><i style={{ background: 'var(--warm)' }} />{series[1].label}: {fmt(series[1], ap.values.hi)}</span>
                  <span><i style={{ background: 'var(--cool)' }} />{series[0].label}: {fmt(series[0], ap.values.lo)}</span>
                </>
              : series.map((s) => <span key={s.key}><i style={{ background: s.color }} />{s.label}: {fmt(s, ap.values[s.key])}</span>)}
          </div>
        )}
      </div>
      <div className="sr-only"><table>
        <caption>{title}. {description}</caption>
        <thead><tr><th>Time</th>{series.map((s) => <th key={s.key}>{s.label}</th>)}</tr></thead>
        <tbody>{points.map((p, i) => <tr key={i}><td>{p.tip || p.label}</td>{series.map((s) => <td key={s.key}>{fmt(s, p.values[s.key])}</td>)}</tr>)}</tbody>
      </table></div>
    </figure>
  )
}
