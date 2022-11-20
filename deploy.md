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
 
 #️⃣26.3 Netlify 
  1. github id / pw
  2. https://app.netlify.com/start/repos
    > Github repository: eats-frontend