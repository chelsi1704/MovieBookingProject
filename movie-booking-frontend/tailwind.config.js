
/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Primary brand red — Netflix signature color
        primary: {
          DEFAULT: '#e50914',
          light: '#ff6b6b',
          dark: '#b20710',
        },
        // Dark background shades
        dark: {
          DEFAULT: '#0a0a0a',
          100: '#141414',
          200: '#1a1a1a',
          300: '#1e1e2e',
          400: '#252535',
          500: '#2d2d3d',
        },
        // Glass card colors
        glass: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.1)',
          hover: 'rgba(255,255,255,0.08)',
        },
      },

      // Custom backdrop blur for glassmorphism
      backdropBlur: {
        xs: '2px',
        glass: '12px',
        heavy: '24px',
      },

      // Background image for hero section
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        'red-gradient':
          'linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)',
        'card-gradient':
          'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%)',
      },

      // Smooth animation for theme switch and hover effects
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'seat-appear': 'seatAppear 0.3s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(229,9,20,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(229,9,20,0.8)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        seatAppear: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
      },

      // Font family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}