import type { Config } from 'tailwindcss';
import colors  from "tailwindcss/colors";

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc
      }
    },
  },
  plugins: [],
} satisfies Config;
