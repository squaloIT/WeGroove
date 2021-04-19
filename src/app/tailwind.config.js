module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-purple': '#433e90',
        'brand-blue': '#326ada',
        'brand-light-gray': '#d2d2d2',
        'brand-gray': '#d4d8d4',
        'brand-dark-gray': '#a19c9c',
        'brand-purple-hover': '#3c3781'
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        ubuntu: ['Ubuntu Mono', 'monospace']
      },
    },
    screens: {
      'xs': { 'min': '400px', max: "639px" },
      'sm': { 'min': '640px', 'max': '767px' },
      'md': { 'min': '768px', 'max': '1023px' },
      'lg': { 'min': '1024px', 'max': '1279px' },
      'xl': { 'min': '1280px', 'max': '1535px' },
      '2xl': { 'min': '1536px' },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
