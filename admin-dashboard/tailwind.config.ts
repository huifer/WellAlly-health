import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: false, // Disabled - single theme only
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ========================================
         WARM GREEN HEALTHCARE PALETTE
         温暖的黄绿色调，更柔和舒适
         Hue: 90-100° (介于黄绿之间)
         ======================================== */
        primary: {
          50: '#F7FEE7',   // 极浅的黄绿色
          100: '#ECFCCB',  // 浅黄绿
          200: '#D9F99D',  // 柔和黄绿
          300: '#BEF264',  // 明亮黄绿
          400: '#A3E635',  // 鲜艳黄绿
          500: '#84CC16',  // 主色调 - 温暖的草绿
          600: '#65A30D',  // 深草绿 - 主要使用
          700: '#4D7C0F',  // 深绿
          800: '#3F6212',  // 暗绿
          900: '#365314',  // 深暗绿
          950: '#1A2E05',  // 极深绿
        },

        /* Semantic color aliases for better code readability */
        success: {
          DEFAULT: '#65A30D',  // Same as primary-600
          light: '#84CC16',    // Same as primary-500
          dark: '#4D7C0F',     // Same as primary-700
        },

        warning: {
          DEFAULT: '#F59E0B',  // Amber 500
          light: '#FBBF24',    // Amber 400
          dark: '#D97706',     // Amber 600
        },

        info: {
          DEFAULT: '#06B6D4',  // Cyan 500
          light: '#22D3EE',    // Cyan 400
          dark: '#0891B2',     // Cyan 600
        },

        danger: {
          DEFAULT: '#EF4444',  // Red 500
          light: '#F87171',    // Red 400
          dark: '#DC2626',     // Red 600
        },

        /* Neutral grays with proper contrast */
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },

      /* Spacing scale for consistency */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      /* Border radius variants */
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      /* Animation utilities */
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-in': 'slideIn 300ms ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
