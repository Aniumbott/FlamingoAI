import type { Config } from "tailwindcss";

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          'custom-gradient': 'linear-gradient(201deg, #08523F 0%, #052727 60%)',
      },
      transitionProperty: {
        'background': 'background-color',
      },
      boxShadow: {
        'top-right': '6px -6px 15px #21EFB8',
        'custom': '0 0 10px 0 rgba(0, 0, 0, 0.11)',
      },
      fontFamily: {
        'plex-sans': ['"IBM Plex Sans"', 'sans-serif'],
        'plex-mono': ['"IBM Plex Mono"', 'sans-serif'],
      },
      alignItems: {
        'normal': 'normal',
      },
      keyframes: {
        draww: {
          to: { 'stroke-dashoffset': '0' },
        },
        draw: {
          to: { strokeDashoffset: '0' }
        },
        dash: {
          '0%': { strokeDasharray: '0 1500' },
          '100%': { strokeDasharray: '1500 1500' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'text-slide-2-smooth': {
          '0%, 50%': {
            transform: 'translateY(0%)',
          },
          '50.1%, 100%': {
            transform: 'translateY(-50%)',
          },
        },
        numberSlide: {
          '0%, 50%': { transform: 'translateY(0)' },
          '50.01%, 100%': { transform: 'translateY(-100%)' },
        },
        textSlide: {
          '0%, 50%': { transform: 'translateY(0)' },
          '50.01%, 100%': { transform: 'translateY(-100%)' },
        },
        'text-slide': {
          '0%, 40%': {
              transform: 'translateY(0%)',
          },
          '50%, 90%': {
              transform: 'translateY(-50%)',
          }
        }                
      },
      animation: {
        dash: 'dash 1.2s linear forwards',
        fadeIn: 'fadeIn 1.2s ease-out forwards',
        draw: 'draw 1.5s ease forwards',
        fadeInUp: 'fadeInUp 1s ease-out',
        fadeInDown: 'fadeInDown 1s ease-out',
        'draww': 'draw 2s ease-in-out forwards',
        'text-slide': 'text-slide 12.5s cubic-bezier(0.83, 0, 0.17, 1) infinite',
        'text-slide-2-smooth': 'text-slide-2-smooth 6s linear infinite',
        'number-slide': 'numberSlide 6s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
