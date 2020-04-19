const PHILIPS_HUE_MAX_VALUE = 65535;
const PHILIPS_SATURATION_MAX_VALUE = 254;
const PHILIPS_BRIGHTNESS_MAX_VALUE = 254;


// let rgbColor = this.hsvToRgb(Math.round(hue), Math.round(saturation) / 100, Math.round(brightness) / 100)

function HSBToRGB(hsb) {
    var rgb = {};
    var h = Math.round(hsb.h);
    var s = Math.round(hsb.s * 255 / 100);
    var v = Math.round(hsb.b * 255 / 100);

    if (s == 0) {

        rgb.r = rgb.g = rgb.b = v;
    } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;

        if (h == 360) h = 0;

        if (h < 60) {
            rgb.r = t1;
            rgb.b = t2;
            rgb.g = t2 + t3
        } else if (h < 120) {
            rgb.g = t1;
            rgb.b = t2;
            rgb.r = t1 - t3
        } else if (h < 180) {
            rgb.g = t1;
            rgb.r = t2;
            rgb.b = t2 + t3
        } else if (h < 240) {
            rgb.b = t1;
            rgb.r = t2;
            rgb.g = t1 - t3
        } else if (h < 300) {
            rgb.b = t1;
            rgb.g = t2;
            rgb.r = t2 + t3
        } else if (h < 360) {
            rgb.r = t1;
            rgb.g = t2;
            rgb.b = t1 - t3
        } else {
            rgb.r = 0;
            rgb.g = 0;
            rgb.b = 0
        }
    }

    return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
}

function rgbToHsvString(rgb){ 
    
    const {r,g,b} = rgb.rgba;
    const result = rgbToHsv(r, g, b);
    const currentHSB = {
        hue: parseInt(result[0], 10),
        sat: parseInt(result[1], 10),
        bri: parseInt(result[2], 10)
    };
    return currentHSB;
}

function rgbToHsv(r, g, b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [
    Math.round(h * 360) * (PHILIPS_HUE_MAX_VALUE / 360),
    Math.round(s * 100) * (PHILIPS_SATURATION_MAX_VALUE / 100),
    Math.round(v * 100) * (PHILIPS_BRIGHTNESS_MAX_VALUE / 100)
  ];
}

export { rgbToHsv, HSBToRGB, rgbToHsvString };