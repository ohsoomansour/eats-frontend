/** @type {import('tailwindcss').Config} */
/*#️⃣15.11 UI Clonning part Two
  1.npx tailwindcss init > 🚧이 파일을 만드는 이유는 Tailwind를 확장하기 위함 , 프레임워크를 확장하는 방법 
    > Tailwind를 tailwind.config.js로 확장하는 거다 
    > Tailwind CSS IntelliSense는 tailwind.config.js 파일을 자동으로 찾아 온다 
  2.tailwind 컬러 확장: 📄tailwindcss.com/docs/customizing-colors
    2-1) const colors = require('tailwindcss/colors')  
    2-2) IntelliSense는 'tailwind.config.js' file을 읽는다 
   
  3. 🔹template:컨텐츠만 살짝 바꿔서 즉시 사용할 수 있는 코드 집합 
                반복적인 HTML 부분을 template로 만들어두고 사용
    */
const colors = require('tailwindcss/colors')  
module.exports = {
  content: [
    './public/index.html',
    "./src/**/*.{js,jsx,ts,tsx}"
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
