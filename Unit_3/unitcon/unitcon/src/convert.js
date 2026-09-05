import { converters } from './data/converters.js'

function celsiusToUnit(c, unit) {
  if (unit === 'celsius') return c
  if (unit === 'fahrenheit') return (c * 9) / 5 + 32
  if (unit === 'kelvin') return c + 273.15
}

function unitToCelsius(value, unit) {
  if (unit === 'celsius') return value
  if (unit === 'fahrenheit') return ((value - 32) * 5) / 9
  if (unit === 'kelvin') return value - 273.15
}

export function convert(converterKey, value, fromUnit, toUnit) {
  const num = Number(value)
  if (Number.isNaN(num)) return null

  const conv = converters[converterKey]
  if (!conv) return null

  if (conv.special === 'temperature') {
    const c = unitToCelsius(num, fromUnit)
    return celsiusToUnit(c, toUnit)
  }

  const fromFactor = conv.units[fromUnit]?.factor
  const toFactor = conv.units[toUnit]?.factor
  if (fromFactor === undefined || toFactor === undefined) return null

  const base = num * fromFactor
  return base / toFactor
}

export function formatResult(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(4)
  }
  const rounded = Math.round(n * 1e6) / 1e6
  return rounded.toString()
}
