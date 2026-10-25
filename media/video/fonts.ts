import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/manrope/index.css";
import { continueRender, delayRender } from "remotion";

export const display = {
  fontFamily: "'Archivo Variable', sans-serif",
  fontWeight: 800,
  fontStretch: "78%",
  fontVariationSettings: "'wdth' 78",
} as const;
export const sans = "'Manrope Variable', sans-serif";

// Block rendering until both faces are loaded, so no frame shows a fallback font.
const handle = delayRender("Loading fonts");
Promise.all([
  document.fonts.load("800 100px 'Archivo Variable'", "Tether Valid token. Wrong behavior."),
  document.fonts.load("700 40px 'Manrope Variable'", "Procurement Agent"),
  document.fonts.load("600 40px 'Manrope Variable'", "Identity"),
]).then(() => continueRender(handle));
