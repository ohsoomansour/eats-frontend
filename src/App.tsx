
import { LoggedOutRouter } from './routers/logged-out-router';
import {  useReactiveVar } from '@apollo/client'
import { LoggedInRouter } from './routers/logged-in-router';
import { isLoggedInVar } from './styles/apollo';

/*#️⃣14.0 npx create-react-app nuber-eats-frontend --template=typescript
  1. [package.json]
    🔴react-script:"4.0.0-next.98"
    🔵rm -rf node_modules > npm i  
    🔷해석:"node_modules를 삭제하고 react-script에 바꾼 저 버전의 node_modules을 설치(수정된 버전)   
*/
/*#️⃣14.1 TailwindCSS part One
  1.📄tailwindcss.com - 🚧npm install -D tailwindcss
  2.Visual Studio code extensions: 'Tailwind CSS intelliSense'를 설치 (+자동완성 기능)
    🔹tailwind.config.js파일을 자동으로 찾는다 
  3. node -v ✅v17.6.0 확인
  4. 🚧npm i postcss autoprefixer: "autoprefixer는 postcss의 또 다른 plugin, 클래스 이름에 접두사 호환성을 추가"
    🔹plugin: 플러그인을 추가하여 컴퓨터 시스템의 기능을 확장 
    🔹예시: border-radius > -moz-border-radius, -ms-border-radius 파이어폭스, 마이크로소프트에 호환되게 한다

  5.[postcss.config.js] 파일 생성 > npx tailwindcss init > [tailwind.config.js] 파일이 생성 됨
    > tailwind를 일반 CSS파일로 빌드하기 위해 postcss.config.js파일이 필요함
    [tailwind.config.js]
    > 커스터마이징 할거다 

  6. tailwind를 우리의 CSS파일에 include 함    
    [tailwind.css] 
    🔴@tailwind base;
    🔴@tailwind components;
       .btn {
         @apply px-4 py-2 bg-bule600 text-white rounded;
        }
    🔴@tailwind utilities;
    🔵postcss가 이 파일을 보고 이 세줄을 Tailwind가 갖고 있는 모든 클래스 이름으로 바꿀거다 
      +tailwind config 파일을 들여다보고 새 클래스 이름이 있다면 그것도 추가한다 
    🔵[tailwind.css]이 파일을 post CSS를 통해 변형 한다 
      [tailwind.css]
      module.exports = {
        content: [
         ✅📄https://tailwindcss.com/docs/installation >  *.{js,jsx,ts,tsx}
        ],

       🚀빌드업:npx tailwindcss-cli@latest build -i src/styles/tailwind.css -o src/styles/styles.css
       🔹-i: input
       🔹-o: 리엑트에서 임포트할 아웃풋 
       🔹*.js 의미: 모든 js파일 의미
       🔹src/** : ** 와일드카드 문자 시퀀스는 부분 경로를 찾음  

      */
/*#️⃣14.3 Apllot Setup
    1. Applo client 설치: https://www.apollographql.com/docs/react/get-started/
    2. 🚧npm install @apollo/client graphql [applo.ts]파일
*/
/*#️⃣14.4 React Router Dom - 📄reactrouter.com/web/guides/quick-start
  1. 설치: npm i react-router-dom@5.3.0
*/
/*#️⃣26.0 Heroku Setup
<git 처리 과정> - ※https://jforj.tistory.com/119
  1.> Working Directory: 개발자의 현재시점으로 소스코드를 수정하며 개발하는 공간을 의미
    > Staging Area: Working Directory에서 작업한 파일을 Local Repository에 전달하기 위해 파일들을 분류하는 공간
    > Local Repository: 로컬 저장소이며 작업한 파일들을 저장해두는 내부 저장소(.git 폴더)
    > Remote Repository: 원격 저장소이며 인터넷으로 연결되어 있어 있는 외부 저장소
    *Branch: Remote Repository의 현재 상태를 복사하며 master 브랜치와 별개의 작업을 진행할 수 있는 공간
             보통 브랜치를 생성하여 개발을 진행하고 개발을 완료하면 master 브랜치에 병합하여 개발 완료된 소스코드를 합침
    *Head: 현재 작업중인 브랜치의 최근 커밋된 위치
    *index: Staging Area를 의미           

  git init
  git add README.md  
    - git add: 어떤 파일을 깃에 올릴지 함 보쟈, git add . 프로젝트 모든 파일을 추가 하겠다  
    - 🔧🚀"수정된 소스코드들을 > Staging Area로 전달"🚀
    - git add index.html (index.html만 올리겠다)
  git status : 📜📄내가 올릴려고 하는 파일들 나열📃  
    -  WorkingDirectory에서 📂수정이 발생된 파일들📂을 확인
  git commit -m "first commit" 
    - 최종본이라고 볼 수있음
    - (add된 모든 소코드들을)🚀Staging Area > Local Repositiory로 이동🚀   
  git branch -M main
    - main branch는 '배포 가능한 상태'만 관리 
    - 생성되어 있는 브랜치를 확인
  git remote add origin https://github.com/ohsoomansour/eats-backend.git(리포리토리주소) 
   - origin은 git이 가져온 '원격 저장소'를 가리킴
     > 🚀 원격 저장소를 연결 🪐🌍
  git remote -v
   -  내가 설정해둔 원격저장소 이름과 URL을 확인 할 수 있음 
  git push -u origin main : "master - > master 성공" 
   - orgin:원격저장소 별칭 d
   - master: 현재브랜치 이름 
   - 🚀'로컬 저장소'에서 파일을 업로드하면서🚀 병합시키는 명령어가 push🚩 

  
  ★수정발생: 
    git add . (전체하는게 편함 )
    git commit -m "second commit" 
    git remote -v : 내가 설정해둔 원격저장소 이름과 URL을 확인 할 수 있음 
    git remote add origin https://github.com/ohsoomansour/CodeChallenge5_revised1.git > error: remote origin already exists.
    > git remote rm origin: "🚧연결이 잘못되었으면 연결을 해제함🚧"
    git push -u origin main
    > 수정커밋하고 나서 재배포 해야함 npm run deploy
    > 변한 게 없다 싶으면 Ctrl + Shift + R로 캐쉬를 무시하는 '새로고침'을 하면 됩니다.
    ❗if) "first commit" 최종본을 해버린 상태면 local repository로 보내버린 상태, 즉 1차 준비 끝이라는 뜻임
        따라서 'push'로 보내버리고  수정 "second commit"으로 처리하면 됨  

  ★gh-pages
  ⓵npm install gh-pages --save-dev
  ⓶"scripts": {"deploy": "gh-pages -d build", "predeploy": "npm run build" }
    "homepage": "https://ohsoomansour.github.io/CodeChallenge1/" 
  ⓷npm run build > npm run deploy (published 성공!)
  🚨에러 발생 대처🚨
  1.warning: LF will be replaced by CRLF in src/App.tsx.
  The file will have its original line endings in your working directory
  ocrlf true
  *LF:줄을 바꾸려는 동작 
  *CRLF:줄 바꿈
  > 💊해결 한 방: git config --global core.autocrlf true

  🔥github.com/search?q=user%3Asoo-sin   



  1. 📄Heroku Home:https://dashboard.heroku.com/new-app id:ceoosm@naver.com /pw: je t'aime@34
      >  npm install -g heroku
  2. 📄The Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
     > npx heroku --version > ⚡heroku/7.66.4 win32-x64 node-v17.6.0
     > npx heroku login
     🚨Create new Git repository
     > cd nuber-eats-backend
     > git init
     > npx heroku git:remote -a eats-backend
  
  3. 커밋  
    git add .
    git commit -am "make it better"
    git push heroku main(master)
          
  🔹Git Bash: window의 cmd, linux와 mac의 terminal과 같은 역할   
*/
                      
export default function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
  
}



