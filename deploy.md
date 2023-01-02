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
  git remote add origin https://github.com/ohsoomansour/eats-frontend.git(리포리토리주소) 
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
    git remote add origin https://github.com/ohsoomansour/eats-frontend.git > error: remote origin already exists.
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
 
 #️⃣26.3 Netlify - 
  1. github id:ceoosm@naver.com / pw: (나)수르@34
  2. https://app.netlify.com/start/
    > Connect to Git provider
    > Pick a repository Github repository: eats-frontend
    > "tailwind:build도 확인해야 한다❗"
     - "script":{
         "prebuild":"npm run tailwind:build",
        }
  3. Production: main@HEAD(main branch의 최신 commit) Failed>> [Deploy log] >> (아래의 에러 메세지)
    > 🚨Failed to compile.
    > ❗'loading' is assigned a value but never used 등 
    > 🔵해결책: [package.json] > "build": "CI=false react-scripts build"
          "Netlify 가 front-end를 build할 때 경고를 에러로 인식하지 않는다는 의미"
     
     🔹CI(Continuous Integration): 지속적인 통합, App의 버그 수정 또는 새로운 코드 변경이
                                   주기적으로 빌드 및 테스트 되면서 공유되는 레퍼지토리에 통합 되는 것           
    > git add . > git commit -m "CI commit" > git push origin 

  4. Tailwind 파일이 커서 압축 파일로 build 
    > 📃tailwindcss.com/docs/optimizing-for-production
    > purge 는 우리가 사용하고 있는 className만 Netlify 최종 CSS build에 추가 된다
    > Now whenever you compile your CSS with `NODE_ENV` set to `production`, Tailwind will automatically purge unused styles from your CSS    
    📄최신update: https://tailwindcss.com/docs/upgrade-guide
    total 323.7MB

  5. 🚨https://lighthearted-stroopwafel-c4c50f.netlify.app/
    ⚡https://lighthearted-stroopwafel-c4c50f.netlify.app//create-account 새로고침⚡
    > 🚫Page Not Found > ⭐root 폴더가 아니라서 그렇다  
    > 해석: "Netlify가 create-account라는 폴더를 찾으려고 하는데 존재하지 않음"
    > 💊redirect: 📄https://docs.netlify.com/routing/redirects/#app
    > [_redirects] ⭐어떤 페이지로 가든 전부 /index.html로 간다
      /* /index.html 200(코드)
    > index.html은 react application을 포함하고 있는 페이지 
    > react application에서 path를 결정

    6. 🚨계정 만들기 > Request URL: http://localhost:4000/graphql  
      🚫localhost에 연결 하고 싶은게 아님
      🚧"heroku eats-backend에 있는 API에 연결 하고 싶다"🚧
      🔵URL을 변경 해줘야 한다: [apollo.ts] 
    
     