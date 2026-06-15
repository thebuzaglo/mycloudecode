import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { loadFont as loadHeebo } from "@remotion/google-fonts/Heebo";

// Display face for big kinetic headlines, body face for secondary lines.
export const { fontFamily: display } = loadRubik("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["hebrew", "latin"],
});

export const { fontFamily: body } = loadHeebo("normal", {
  weights: ["400", "600", "800"],
  subsets: ["hebrew", "latin"],
});

// Brand palette derived from the Prop Firm Payless logo (navy + gold on white).
export const COLORS = {
  bg: "#FFFFFF",
  bgPanel: "#F4F6F8",
  navy: "#22384A",
  navyDeep: "#16242F",
  gold: "#E2B24F",
  goldLight: "#F0C96B",
  danger: "#CF4148",
  ink: "#22384A",
  muted: "#7C8B97",
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// A crisp multi-directional white/gold outline + soft shadow for kinetic text.
export const outline = (stroke: string, shadow = "rgba(34,56,74,0.18)") =>
  [
    `-2px -2px 0 ${stroke}`,
    `2px -2px 0 ${stroke}`,
    `-2px 2px 0 ${stroke}`,
    `2px 2px 0 ${stroke}`,
    `0 3px 0 ${stroke}`,
    `0 10px 22px ${shadow}`,
  ].join(", ");
