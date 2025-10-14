

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        tertiary: '#10B981',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#06B6D4',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'bg-primary': '#F8FAFC',
        'bg-secondary': '#F1F5F9',
        'border-light': '#E2E8F0',
        'border-medium': '#CBD5E1'
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  plugins: [],
}

