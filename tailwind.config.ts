// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cor de ação/acento do projeto — VERDE
        accent: { DEFAULT: '#10b981', fg: '#ffffff' }, // emerald-500

        // Tokens da paleta exigida
        brand: {
          black: '#0a0a0a',
          green: '#10b981',
        },
      },

      // Mantém coerência com sua variável :root { --radius: 1rem; }
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
