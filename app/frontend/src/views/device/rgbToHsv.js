const PHILIPS_HUE_MAX_VALUE = 65535
const PHILIPS_SATURATION_MAX_VALUE = 254
const PHILIPS_BRIGHTNESS_MAX_VALUE = 254

// let rgbColor = this.hsvToRgb(Math.round(hue), Math.round(saturation) / 100, Math.round(brightness) / 100)

var colorNormalizedToEightBit = function (value) {
  return Math.round(value * 255)
}

var hsbToRgb = function (hue, sat, value) {
  var satNormal = sat / 255
    var valueNormal = value / 255
    var hueNormal = (hue / 65535) * 360
    var c = valueNormal * satNormal
    var x = c * (1 - Math.abs(((hueNormal / 60) % 2) - 1))
    var m = valueNormal - c
    var red = 0
    var green = 0
    var blue = 0
  if (hueNormal >= 0 && hueNormal < 60) {
    red = c
    green = x
    blue = 0
  } else if (hueNormal >= 60 && hueNormal < 120) {
    red = x
    green = c
    blue = 0
  } else if (hueNormal >= 120 && hueNormal < 180) {
    red = 0
    green = c
    blue = x
  } else if (hueNormal >= 180 && hueNormal < 240) {
    red = 0
    green = x
    blue = c
  } else if (hueNormal >= 240 && hueNormal < 300) {
    red = x
    green = 0
    blue = c
  } else {
    red = c
    green = 0
    blue = x
  }
  return [
    colorNormalizedToEightBit(red + m),
    colorNormalizedToEightBit(green + m),
    colorNormalizedToEightBit(blue + m),
  ]
}

function rgbToHsvString (rgb) {
  const { r, g, b } = rgb.rgba
  const result = rgbToHsv(r, g, b)
  const currentHSB = {
    hue: parseInt(result[0], 10),
    sat: parseInt(result[1], 10),
    bri: parseInt(result[2], 10),
  }
  return currentHSB
}

function rgbToHsv (r, g, b) {
  r = r / 255
  g = g / 255
  b = b / 255

  const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
  let h

    const v = max

  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [
    Math.round(h * 360) * (PHILIPS_HUE_MAX_VALUE / 360),
    Math.round(s * 100) * (PHILIPS_SATURATION_MAX_VALUE / 100),
    Math.round(v * 100) * (PHILIPS_BRIGHTNESS_MAX_VALUE / 100),
  ]
}

export { rgbToHsv, hsbToRgb, rgbToHsvString }
