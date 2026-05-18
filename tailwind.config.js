
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        forest:  '#1B4332',
        sage:    '#2D6A4F',
        mint:    '#52B788',
        frost:   '#B7E4C7',
        mist:    '#D8F3DC',
        cream:   '#F8F7F4',
        stone:   '#E8E6E1',
        pebble:  '#9E9B95',
        ink:     '#1C1C1A',
        fresh:   '#52B788',
        warn:    '#E9C46A',
        expired: '#E76F51',
        darkbg:  '#264653',
      },
      fontFamily: {
        display: ['DMSerifDisplay_400Regular'],
      },
    },
  },
  plugins: [],
};
