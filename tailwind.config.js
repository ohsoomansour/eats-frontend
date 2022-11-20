/** @type {import('tailwindcss').Config} */
/*#️⃣15.11 UI Clonning part Two
  1.npx tailwindcss init > 🚧이 파일을 만드는 이유는 Tailwind를 확장하기 위함 , 프레임워크를 확장하는 방법 
    > Tailwind를 tailwind.config.js로 확장하는 거다 
    > Tailwind CSS IntelliSense는 tailwind.config.js 파일을 자동으로 찾아 온다 
  2.tailwind 컬러 확장: 📄tailwindcss.com/docs/customizing-colors
    2-1) const colors = require('tailwindcss/colors')  
    2-2) IntelliSense는 'tailwind.config.js' file을 읽는다 
   */
const colors = require('tailwindcss/colors')  
module.exports = {
  content: [
    './public/index.html',
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  purge:[
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors:{
        lime:colors.lime
      }
    },
  },
  plugins: [],
}
