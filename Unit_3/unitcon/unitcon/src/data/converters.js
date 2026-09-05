// categoryGroups: the 9 top-level groups shown as tabs (Common, Engineering, Heat, Fluids, Light, Electricity, Magnetism, Radiology, Other)
// Each group contains a list of converters (sub-categories). Each converter has units with a factor to its base unit.
// Temperature-like non-linear converters use `special: 'temperature'`.

export const categoryGroups = [
  {
    key: 'common',
    label: 'Common Converters',
    converters: ['length', 'weight', 'volume', 'temperature', 'speed', 'area', 'time', 'digital'],
  },
  {
    key: 'engineering',
    label: 'Engineering Converters',
    converters: ['pressure', 'force', 'power', 'torque', 'density', 'flowRate'],
  },
  {
    key: 'heat',
    label: 'Heat Converters',
    converters: ['energy', 'temperature', 'thermalConductivity', 'specificHeat'],
  },
  {
    key: 'fluids',
    label: 'Fluids Converters',
    converters: ['volume', 'flowRate', 'viscosity', 'density'],
  },
  {
    key: 'light',
    label: 'Light Converters',
    converters: ['illuminance', 'luminance', 'luminousIntensity'],
  },
  {
    key: 'electricity',
    label: 'Electricity Converters',
    converters: ['voltage', 'current', 'resistance', 'charge', 'capacitance'],
  },
  {
    key: 'magnetism',
    label: 'Magnetism Converters',
    converters: ['magneticFlux', 'magneticField'],
  },
  {
    key: 'radiology',
    label: 'Radiology Converters',
    converters: ['radiationDose', 'radioactivity'],
  },
  {
    key: 'other',
    label: 'Other Converters',
    converters: ['angle', 'fuelConsumption', 'dataTransferRate'],
  },
]

export const converters = {
  length: {
    label: 'Length', icon: '📏', base: 'meter',
    units: {
      meter: { label: 'Meter', symbol: 'm', factor: 1 },
      kilometer: { label: 'Kilometer', symbol: 'km', factor: 1000 },
      centimeter: { label: 'Centimeter', symbol: 'cm', factor: 0.01 },
      millimeter: { label: 'Millimeter', symbol: 'mm', factor: 0.001 },
      micrometer: { label: 'Micrometer', symbol: 'µm', factor: 1e-6 },
      mile: { label: 'Mile', symbol: 'mi', factor: 1609.344 },
      yard: { label: 'Yard', symbol: 'yd', factor: 0.9144 },
      foot: { label: 'Foot', symbol: 'ft', factor: 0.3048 },
      inch: { label: 'Inch', symbol: 'in', factor: 0.0254 },
      nauticalMile: { label: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
    },
  },
  weight: {
    label: 'Weight', icon: '⚖️', base: 'kilogram',
    units: {
      kilogram: { label: 'Kilogram', symbol: 'kg', factor: 1 },
      gram: { label: 'Gram', symbol: 'g', factor: 0.001 },
      milligram: { label: 'Milligram', symbol: 'mg', factor: 0.000001 },
      tonne: { label: 'Metric Tonne', symbol: 't', factor: 1000 },
      pound: { label: 'Pound', symbol: 'lb', factor: 0.45359237 },
      ounce: { label: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
      stone: { label: 'Stone', symbol: 'st', factor: 6.35029318 },
    },
  },
  volume: {
    label: 'Volume', icon: '🧪', base: 'liter',
    units: {
      liter: { label: 'Liter', symbol: 'L', factor: 1 },
      milliliter: { label: 'Milliliter', symbol: 'mL', factor: 0.001 },
      cubicMeter: { label: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      cubicCentimeter: { label: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001 },
      gallon: { label: 'Gallon (US)', symbol: 'gal', factor: 3.785411784 },
      quart: { label: 'Quart (US)', symbol: 'qt', factor: 0.946352946 },
      pint: { label: 'Pint (US)', symbol: 'pt', factor: 0.473176473 },
      cup: { label: 'Cup (US)', symbol: 'cup', factor: 0.2365882365 },
      fluidOunce: { label: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735296 },
    },
  },
  temperature: {
    label: 'Temperature', icon: '🌡️', base: 'celsius', special: 'temperature',
    units: {
      celsius: { label: 'Celsius', symbol: '°C' },
      fahrenheit: { label: 'Fahrenheit', symbol: '°F' },
      kelvin: { label: 'Kelvin', symbol: 'K' },
    },
  },
  speed: {
    label: 'Speed', icon: '🚗', base: 'mps',
    units: {
      mps: { label: 'Meters/sec', symbol: 'm/s', factor: 1 },
      kph: { label: 'Kilometers/hr', symbol: 'km/h', factor: 0.277778 },
      mph: { label: 'Miles/hr', symbol: 'mph', factor: 0.44704 },
      knot: { label: 'Knot', symbol: 'kt', factor: 0.514444 },
      fps: { label: 'Feet/sec', symbol: 'ft/s', factor: 0.3048 },
    },
  },
  area: {
    label: 'Area', icon: '▦', base: 'sqMeter',
    units: {
      sqMeter: { label: 'Square Meter', symbol: 'm²', factor: 1 },
      sqKilometer: { label: 'Square Kilometer', symbol: 'km²', factor: 1e6 },
      sqCentimeter: { label: 'Square Centimeter', symbol: 'cm²', factor: 1e-4 },
      hectare: { label: 'Hectare', symbol: 'ha', factor: 10000 },
      acre: { label: 'Acre', symbol: 'ac', factor: 4046.8564224 },
      sqMile: { label: 'Square Mile', symbol: 'mi²', factor: 2589988.110336 },
      sqFoot: { label: 'Square Foot', symbol: 'ft²', factor: 0.09290304 },
      sqYard: { label: 'Square Yard', symbol: 'yd²', factor: 0.83612736 },
    },
  },
  time: {
    label: 'Time', icon: '⏱️', base: 'second',
    units: {
      second: { label: 'Second', symbol: 's', factor: 1 },
      millisecond: { label: 'Millisecond', symbol: 'ms', factor: 0.001 },
      minute: { label: 'Minute', symbol: 'min', factor: 60 },
      hour: { label: 'Hour', symbol: 'hr', factor: 3600 },
      day: { label: 'Day', symbol: 'day', factor: 86400 },
      week: { label: 'Week', symbol: 'wk', factor: 604800 },
      month: { label: 'Month (30d)', symbol: 'mo', factor: 2592000 },
      year: { label: 'Year (365d)', symbol: 'yr', factor: 31536000 },
    },
  },
  digital: {
    label: 'Digital Storage', icon: '💾', base: 'byte',
    units: {
      bit: { label: 'Bit', symbol: 'b', factor: 0.125 },
      byte: { label: 'Byte', symbol: 'B', factor: 1 },
      kilobyte: { label: 'Kilobyte', symbol: 'KB', factor: 1024 },
      megabyte: { label: 'Megabyte', symbol: 'MB', factor: 1024 ** 2 },
      gigabyte: { label: 'Gigabyte', symbol: 'GB', factor: 1024 ** 3 },
      terabyte: { label: 'Terabyte', symbol: 'TB', factor: 1024 ** 4 },
    },
  },
  pressure: {
    label: 'Pressure', icon: '🔧', base: 'pascal',
    units: {
      pascal: { label: 'Pascal', symbol: 'Pa', factor: 1 },
      kilopascal: { label: 'Kilopascal', symbol: 'kPa', factor: 1000 },
      bar: { label: 'Bar', symbol: 'bar', factor: 100000 },
      atmosphere: { label: 'Atmosphere', symbol: 'atm', factor: 101325 },
      psi: { label: 'PSI', symbol: 'psi', factor: 6894.757293168 },
      torr: { label: 'Torr', symbol: 'Torr', factor: 133.322368421 },
    },
  },
  force: {
    label: 'Force', icon: '➡️', base: 'newton',
    units: {
      newton: { label: 'Newton', symbol: 'N', factor: 1 },
      kilonewton: { label: 'Kilonewton', symbol: 'kN', factor: 1000 },
      poundForce: { label: 'Pound-force', symbol: 'lbf', factor: 4.4482216153 },
      dyne: { label: 'Dyne', symbol: 'dyn', factor: 0.00001 },
      kilogramForce: { label: 'Kilogram-force', symbol: 'kgf', factor: 9.80665 },
    },
  },
  power: {
    label: 'Power', icon: '⚡', base: 'watt',
    units: {
      watt: { label: 'Watt', symbol: 'W', factor: 1 },
      kilowatt: { label: 'Kilowatt', symbol: 'kW', factor: 1000 },
      megawatt: { label: 'Megawatt', symbol: 'MW', factor: 1e6 },
      horsepower: { label: 'Horsepower', symbol: 'hp', factor: 745.699872 },
      btuPerHour: { label: 'BTU/hour', symbol: 'BTU/h', factor: 0.29307107 },
    },
  },
  torque: {
    label: 'Torque', icon: '🔩', base: 'newtonMeter',
    units: {
      newtonMeter: { label: 'Newton-meter', symbol: 'N·m', factor: 1 },
      poundFoot: { label: 'Pound-foot', symbol: 'lb·ft', factor: 1.35581795 },
      poundInch: { label: 'Pound-inch', symbol: 'lb·in', factor: 0.112984829 },
      kilogramMeter: { label: 'Kilogram-force meter', symbol: 'kgf·m', factor: 9.80665 },
    },
  },
  density: {
    label: 'Density', icon: '🧱', base: 'kgPerM3',
    units: {
      kgPerM3: { label: 'kg/m³', symbol: 'kg/m³', factor: 1 },
      gPerCm3: { label: 'g/cm³', symbol: 'g/cm³', factor: 1000 },
      kgPerL: { label: 'kg/L', symbol: 'kg/L', factor: 1000 },
      lbPerFt3: { label: 'lb/ft³', symbol: 'lb/ft³', factor: 16.018463374 },
      lbPerGal: { label: 'lb/gal (US)', symbol: 'lb/gal', factor: 119.826427 },
    },
  },
  flowRate: {
    label: 'Flow Rate', icon: '🌊', base: 'litersPerMin',
    units: {
      litersPerMin: { label: 'Liters/min', symbol: 'L/min', factor: 1 },
      litersPerSec: { label: 'Liters/sec', symbol: 'L/s', factor: 60 },
      gallonsPerMin: { label: 'Gallons/min (US)', symbol: 'gpm', factor: 3.785411784 },
      cubicMetersPerHour: { label: 'Cubic meters/hr', symbol: 'm³/h', factor: 16.6666667 },
    },
  },
  energy: {
    label: 'Energy', icon: '🔥', base: 'joule',
    units: {
      joule: { label: 'Joule', symbol: 'J', factor: 1 },
      kilojoule: { label: 'Kilojoule', symbol: 'kJ', factor: 1000 },
      calorie: { label: 'Calorie', symbol: 'cal', factor: 4.184 },
      kilocalorie: { label: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
      btu: { label: 'BTU', symbol: 'BTU', factor: 1055.05585 },
      kilowattHour: { label: 'Kilowatt-hour', symbol: 'kWh', factor: 3600000 },
      electronvolt: { label: 'Electronvolt', symbol: 'eV', factor: 1.602176634e-19 },
    },
  },
  thermalConductivity: {
    label: 'Thermal Conductivity', icon: '♨️', base: 'wPerMK',
    units: {
      wPerMK: { label: 'W/(m·K)', symbol: 'W/(m·K)', factor: 1 },
      btuPerHrFtF: { label: 'BTU/(hr·ft·°F)', symbol: 'BTU/(hr·ft·°F)', factor: 1.730734666 },
      calPerSecCmC: { label: 'cal/(s·cm·°C)', symbol: 'cal/(s·cm·°C)', factor: 418.4 },
    },
  },
  specificHeat: {
    label: 'Specific Heat', icon: '🌡️', base: 'jPerKgK',
    units: {
      jPerKgK: { label: 'J/(kg·K)', symbol: 'J/(kg·K)', factor: 1 },
      calPerGC: { label: 'cal/(g·°C)', symbol: 'cal/(g·°C)', factor: 4184 },
      btuPerLbF: { label: 'BTU/(lb·°F)', symbol: 'BTU/(lb·°F)', factor: 4186.8 },
    },
  },
  viscosity: {
    label: 'Viscosity', icon: '🍯', base: 'pascalSecond',
    units: {
      pascalSecond: { label: 'Pascal-second', symbol: 'Pa·s', factor: 1 },
      poise: { label: 'Poise', symbol: 'P', factor: 0.1 },
      centipoise: { label: 'Centipoise', symbol: 'cP', factor: 0.001 },
    },
  },
  illuminance: {
    label: 'Illuminance', icon: '💡', base: 'lux',
    units: {
      lux: { label: 'Lux', symbol: 'lx', factor: 1 },
      footCandle: { label: 'Foot-candle', symbol: 'fc', factor: 10.76391 },
      phot: { label: 'Phot', symbol: 'ph', factor: 10000 },
    },
  },
  luminance: {
    label: 'Luminance', icon: '🔆', base: 'candelaPerM2',
    units: {
      candelaPerM2: { label: 'Candela/m²', symbol: 'cd/m²', factor: 1 },
      nit: { label: 'Nit', symbol: 'nt', factor: 1 },
      stilb: { label: 'Stilb', symbol: 'sb', factor: 10000 },
    },
  },
  luminousIntensity: {
    label: 'Luminous Intensity', icon: '🕯️', base: 'candela',
    units: {
      candela: { label: 'Candela', symbol: 'cd', factor: 1 },
      millicandela: { label: 'Millicandela', symbol: 'mcd', factor: 0.001 },
    },
  },
  voltage: {
    label: 'Voltage', icon: '🔋', base: 'volt',
    units: {
      volt: { label: 'Volt', symbol: 'V', factor: 1 },
      millivolt: { label: 'Millivolt', symbol: 'mV', factor: 0.001 },
      kilovolt: { label: 'Kilovolt', symbol: 'kV', factor: 1000 },
      microvolt: { label: 'Microvolt', symbol: 'µV', factor: 0.000001 },
    },
  },
  current: {
    label: 'Current', icon: '🔌', base: 'ampere',
    units: {
      ampere: { label: 'Ampere', symbol: 'A', factor: 1 },
      milliampere: { label: 'Milliampere', symbol: 'mA', factor: 0.001 },
      kiloampere: { label: 'Kiloampere', symbol: 'kA', factor: 1000 },
      microampere: { label: 'Microampere', symbol: 'µA', factor: 0.000001 },
    },
  },
  resistance: {
    label: 'Resistance', icon: '🧲', base: 'ohm',
    units: {
      ohm: { label: 'Ohm', symbol: 'Ω', factor: 1 },
      kiloohm: { label: 'Kiloohm', symbol: 'kΩ', factor: 1000 },
      megaohm: { label: 'Megaohm', symbol: 'MΩ', factor: 1e6 },
      milliohm: { label: 'Milliohm', symbol: 'mΩ', factor: 0.001 },
    },
  },
  charge: {
    label: 'Electric Charge', icon: '⚡', base: 'coulomb',
    units: {
      coulomb: { label: 'Coulomb', symbol: 'C', factor: 1 },
      milliampereHour: { label: 'Milliamp-hour', symbol: 'mAh', factor: 3.6 },
      ampereHour: { label: 'Amp-hour', symbol: 'Ah', factor: 3600 },
    },
  },
  capacitance: {
    label: 'Capacitance', icon: '🔋', base: 'farad',
    units: {
      farad: { label: 'Farad', symbol: 'F', factor: 1 },
      microfarad: { label: 'Microfarad', symbol: 'µF', factor: 1e-6 },
      nanofarad: { label: 'Nanofarad', symbol: 'nF', factor: 1e-9 },
      picofarad: { label: 'Picofarad', symbol: 'pF', factor: 1e-12 },
    },
  },
  magneticFlux: {
    label: 'Magnetic Flux', icon: '🧭', base: 'weber',
    units: {
      weber: { label: 'Weber', symbol: 'Wb', factor: 1 },
      maxwell: { label: 'Maxwell', symbol: 'Mx', factor: 1e-8 },
    },
  },
  magneticField: {
    label: 'Magnetic Field', icon: '🧲', base: 'tesla',
    units: {
      tesla: { label: 'Tesla', symbol: 'T', factor: 1 },
      gauss: { label: 'Gauss', symbol: 'G', factor: 0.0001 },
      milliTesla: { label: 'Millitesla', symbol: 'mT', factor: 0.001 },
    },
  },
  radiationDose: {
    label: 'Radiation Dose', icon: '☢️', base: 'sievert',
    units: {
      sievert: { label: 'Sievert', symbol: 'Sv', factor: 1 },
      millisievert: { label: 'Millisievert', symbol: 'mSv', factor: 0.001 },
      rem: { label: 'Rem', symbol: 'rem', factor: 0.01 },
      gray: { label: 'Gray', symbol: 'Gy', factor: 1 },
    },
  },
  radioactivity: {
    label: 'Radioactivity', icon: '☢️', base: 'becquerel',
    units: {
      becquerel: { label: 'Becquerel', symbol: 'Bq', factor: 1 },
      curie: { label: 'Curie', symbol: 'Ci', factor: 3.7e10 },
      kilobecquerel: { label: 'Kilobecquerel', symbol: 'kBq', factor: 1000 },
    },
  },
  angle: {
    label: 'Angle', icon: '📐', base: 'degree',
    units: {
      degree: { label: 'Degree', symbol: '°', factor: 1 },
      radian: { label: 'Radian', symbol: 'rad', factor: 57.29577951 },
      gradian: { label: 'Gradian', symbol: 'gon', factor: 0.9 },
      arcminute: { label: 'Arcminute', symbol: "'", factor: 0.0166666667 },
    },
  },
  fuelConsumption: {
    label: 'Fuel Consumption', icon: '⛽', base: 'kmPerLiter',
    units: {
      kmPerLiter: { label: 'km/L', symbol: 'km/L', factor: 1 },
      mpgUS: { label: 'MPG (US)', symbol: 'mpg', factor: 0.42514286 },
    },
  },
  dataTransferRate: {
    label: 'Data Transfer Rate', icon: '📡', base: 'mbps',
    units: {
      bps: { label: 'Bits/sec', symbol: 'bps', factor: 0.000001 },
      kbps: { label: 'Kilobits/sec', symbol: 'kbps', factor: 0.001 },
      mbps: { label: 'Megabits/sec', symbol: 'Mbps', factor: 1 },
      gbps: { label: 'Gigabits/sec', symbol: 'Gbps', factor: 1000 },
    },
  },
}

export function getConverterCount() {
  return Object.keys(converters).length
}

export function getUnitCount() {
  return Object.values(converters).reduce((sum, c) => sum + Object.keys(c.units).length, 0)
}
