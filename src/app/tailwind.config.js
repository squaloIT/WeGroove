module.exports = {
  mode: 'jit',
  purge: [
    './../server/templates/views/*.liquid'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-purple': '#433e90',
        'brand-blue': '#326ada',
        'brand-light-gray': '#d2d2d2',
        'brand-gray': '#d4d8d4',
        'brand-dark-gray': '#a19c9c',
        'brand-purple-hover': '#3c3781',
        'like-button-red': '#e0245e',
        'like-button-red-background': 'rgba(224, 36, 94, 0.1)',
        'comment-button-blue': 'rgb(29, 161, 242)',
        'comment-button-blue-background': 'rgba(29, 161, 242, 0.1)',
        'retweet-button-green': 'rgb(23, 191, 99)',
        'retweet-button-green-background': 'rgba(23, 191, 99, 0.1)',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        ubuntu: ['Ubuntu', 'monospace'],
        lobster: ['Lobster', 'cursive'],
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
