import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { converters } from '../data/converters.js'
import { convert, formatResult } from '../convert.js'

const QUICK_MULTIPLIERS = [1, 10, 100, 1000]

export default function Converter() {
  const { key } = useParams()
  const conv = converters[key]

  const unitKeysInitial = conv ? Object.keys(conv.units) : []
  const [fromUnit, setFromUnit] = useState(unitKeysInitial[0])
  const [toUnit, setToUnit] = useState(unitKeysInitial[1])
  const [inputValue, setInputValue] = useState('1')
  const [copied, setCopied] = useState(false)

  const unitKeys = useMemo(() => (conv ? Object.keys(conv.units) : []), [conv])

  if (!conv) {
    return <Navigate to="/all-units" replace />
  }

  function swapUnits() {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  function resetValues() {
    setInputValue('1')
    setFromUnit(unitKeys[0])
    setToUnit(unitKeys[1])
  }

  const result = convert(key, inputValue, fromUnit, toUnit)
  const formattedResult = formatResult(result)

  const quickConversions = QUICK_MULTIPLIERS.map((m) => ({
    input: m,
    output: formatResult(convert(key, m, fromUnit, toUnit)),
  }))

  const tableRows = unitKeys
    .filter((u) => u !== fromUnit)
    .map((u) => ({
      key: u,
      label: conv.units[u].label,
      symbol: conv.units[u].symbol,
      value: formatResult(convert(key, inputValue, fromUnit, u)),
    }))

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(String(formattedResult))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="page-wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/all-units">All Converters</Link> /{' '}
        <span>{conv.label}</span>
      </div>

      <header className="header">
        <h1>{conv.icon} {conv.label} Converter</h1>
        <p>Convert between {Object.keys(conv.units).length} {conv.label.toLowerCase()} units instantly.</p>
      </header>

      <section className="converter-grid">
        <div className="convert-from card">
          <h3>Convert From</h3>

          <label className="field-label">Enter Value</label>
          <input
            className="value-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0"
          />

          <label className="field-label">From Unit</label>
          <select className="unit-select" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
            {unitKeys.map((u) => (
              <option key={u} value={u}>{conv.units[u].label} ({conv.units[u].symbol})</option>
            ))}
          </select>

          <button className="swap-btn" onClick={swapUnits} aria-label="Swap units">⇅</button>

          <label className="field-label">To Unit</label>
          <select className="unit-select" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
            {unitKeys.map((u) => (
              <option key={u} value={u}>{conv.units[u].label} ({conv.units[u].symbol})</option>
            ))}
          </select>
        </div>

        <div className="right-column">
          <div className="result-card">
            <span className="result-label">Conversion Result</span>
            <span className="result-value">{formattedResult}</span>
            <span className="result-unit">{conv.units[toUnit].label}</span>
            <span className="result-equation">
              1 {conv.units[fromUnit].label} = {formatResult(convert(key, 1, fromUnit, toUnit))} {conv.units[toUnit].label}
            </span>
          </div>

          <div className="card quick-conversions">
            <h3>Quick Conversions</h3>
            <div className="quick-grid">
              {quickConversions.map((q) => (
                <div className="quick-item" key={q.input}>
                  <span className="quick-input">{q.input} {conv.units[fromUnit].symbol}</span>
                  <span className="quick-eq">=</span>
                  <span className="quick-output">{q.output} {conv.units[toUnit].symbol}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card conversion-table">
            <h3>Conversion Table</h3>
            <table>
              <thead>
                <tr><th>Input</th><th>From</th><th>To</th><th>Result</th></tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.key}>
                    <td>{inputValue || 0}</td>
                    <td>{conv.units[fromUnit].label}</td>
                    <td>{row.label}</td>
                    <td className="table-result">{row.value} {row.symbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions-row">
            <button className="btn btn-secondary" onClick={resetValues}>Reset Values</button>
            <button className="btn btn-primary" onClick={copyResult}>{copied ? 'Copied!' : 'Copy Result'}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
