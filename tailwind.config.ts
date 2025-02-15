/* eslint-disable*/
import type { Config } from "tailwindcss";

const pxToRem = require("tailwindcss-preset-px-to-rem");

const config: Config = {
  presets: [pxToRem],
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "375px", // 375px 이상
      md: "744px", // 744px 이상
      lg: "1024px", // 1024px 이상
      xl: "1280px", // 1280px 이상
      xxl: "1600px", // 1600px 이상
    },
    extend: {
      colors: {
        primary: {
          50: "#F8F6FF", // 가장 연한 파스텔 보라
          100: "#F3EEFF",
          200: "#E8DDFF",
          300: "#D9CCFF",
          400: "#C4AEFF",
          500: "#A990FF", // 주 브랜드 컬러 (파스텔 보라)
          600: "#9B7EFF", // hover 상태
          700: "#8A6AFF",
          800: "#7857F7",
          900: "#6645E5",
        },
        success: {
          100: "#E9FFF0",
          200: "#E8F5E9",
          300: "#24d075",
          400: "#1DA65A",
          500: "#0FED78",
          600: "#0CC864",
        },
        warning: {
          100: "#FFF8E6",
          200: "#FFE5B2",
          300: "#FFD27F",
          400: "#FFC04C",
          500: "#FFAD19",
        },
        error: {
          100: "#FEE4E2",
          200: "#FECDCA",
          300: "#FDA29B",
          400: "#F97066",
          500: "#F04438",
        },
        info: {
          100: "#EDF1FC",
          200: "#F5F6F8",
          300: "#F3F4F6",
          400: "#EFF6FB",
          500: "#4882FA",
          600: "#3A75EA",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        black: "#000000",
        white: "#FFFFFF",
        transparent: "transparent",
        current: "currentColor",
      },
    },
    fontSize: {
      // landing
      "40-600": ["40px", { lineHeight: "38px", fontWeight: "600" }],
      "48-600": ["48px", { lineHeight: "38px", fontWeight: "600" }],
      "64-600": ["64px", { lineHeight: "38px", fontWeight: "600" }],

      // 3xl (32px)
      "32-700": ["32px", { lineHeight: "38px", fontWeight: "700" }],
      "32-600": ["32px", { lineHeight: "38px", fontWeight: "600" }],
      "32-500": ["32px", { lineHeight: "38px", fontWeight: "500" }],

      // 2.5xl (28px)
      "28-700": ["28px", { lineHeight: "38px", fontWeight: "700" }],
      "28-600": ["28px", { lineHeight: "38px", fontWeight: "600" }],
      "28-500": ["28px", { lineHeight: "38px", fontWeight: "500" }],

      // 2xl (24px)
      "24-700": ["24px", { lineHeight: "28px", fontWeight: "700" }],
      "24-600": ["24px", { lineHeight: "28px", fontWeight: "600" }],
      "24-500": ["24px", { lineHeight: "28px", fontWeight: "500" }],
      "24-400": ["24px", { lineHeight: "28px", fontWeight: "400" }],

      // xl (20px)
      "20-700": ["20px", { lineHeight: "24px", fontWeight: "700" }],
      "20-600": ["20px", { lineHeight: "24px", fontWeight: "600" }],
      "20-500": ["20px", { lineHeight: "24px", fontWeight: "500" }],
      "20-400": ["20px", { lineHeight: "24px", fontWeight: "400" }],

      // 2lg (18px)
      "18-700": ["18px", { lineHeight: "21px", fontWeight: "700" }],
      "18-600": ["18px", { lineHeight: "21px", fontWeight: "600" }],
      "18-500": ["18px", { lineHeight: "21px", fontWeight: "500" }],
      "18-400": ["18px", { lineHeight: "21px", fontWeight: "400" }],

      // lg (16px)
      "16-700": ["16px", { lineHeight: "19px", fontWeight: "700" }],
      "16-600": ["16px", { lineHeight: "19px", fontWeight: "600" }],
      "16-500": ["16px", { lineHeight: "19px", fontWeight: "500" }],
      "16-400": ["16px", { lineHeight: "19px", fontWeight: "400" }],

      // md (14px)
      "14-700": ["14px", { lineHeight: "17px", fontWeight: "700" }],
      "14-600": ["14px", { lineHeight: "17px", fontWeight: "600" }],
      "14-500": ["14px", { lineHeight: "17px", fontWeight: "500" }],
      "14-400": ["14px", { lineHeight: "17px", fontWeight: "400" }],

      // sm (13px)
      "13-600": ["13px", { lineHeight: "16px", fontWeight: "600" }],
      "13-500": ["13px", { lineHeight: "16px", fontWeight: "500" }],

      // xs (12px)
      "12-600": ["12px", { lineHeight: "14px", fontWeight: "600" }],
      "12-500": ["12px", { lineHeight: "14px", fontWeight: "500" }],
      "12-400": ["12px", { lineHeight: "14px", fontWeight: "400" }],
    },
    boxShadow: {
      custom: "0 2px 4px 0 rgba(51, 50, 54, 0.06)", // X: 0, Y: 2, Blur: 4, Spread: 0, 색상: #333236/6
    },
  },
  plugins: [],
};
export default config;
