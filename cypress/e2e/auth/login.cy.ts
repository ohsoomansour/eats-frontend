/*#️⃣21.0 Installing Cypress 
  1. npm run start > cypress 실행, npx cypress open
  2. e2e > [Specs] > first-test cy.ts 클릭! > localhost:3000 로 이동 
  3. baseUrl 설정 > cypress.config.ts 
    📄https://docs.cypress.io/guides/references/configuration#Configuration-File
  #️⃣21.1 Our First Cypress Test
  1. Open Selector Playground 클릭 > 클릭 엘리먼트 해서 클래스 이름을 통해 get
  2. Cypress Testing Library 
     📄https://testing-library.com/docs/cypress-testing-library/intro/
      > npm install --save-dev cypress @testing-library/cypress
      > 우리가 사용했던 걸로 element를 가지게 된다 

      >[tsconfig.json] 파일에 "types":[ "@testing-library/cypress"] 
       [command.js] 파일에 import '@testing-library/cypress/add-commands' 추가
     
      🔹cy.findByRole: (커서 올려서 참조)
   #️⃣21.2 Login E2E
    1. cy.findByRole("alert").shold("have.text", "Please enter a valid email")
       > 🔴 결과는 ""
       > 🔵 차선으로 findByText("please enter a valid email")

    2. cy.findByPlaceholderText(/password/i).click()  " playceholder 패스워드를 찾고 클릭해라"
        
    3. 
     3-1)🚧 cy.window().its("localStorage.nuber-token").should("be.a", "string")🚧
        ⭐흐름: token 생성 --- localStorage에 저장 --- localStorage에서 get  
        - 백엔드, [users.service.tsx]에서  @Mutation login에서 jwt를 만든다 
        - 프론트, [login.tsx]에서 grapql를 통해 data를 받고 --- localStorage.setItem("nuber-token", data.token)
          즉, 로그인을 해야 localStorage에 token이 있기 때문에 최소 1번은 해야 된다 

      🔹window() 현재 활성화된 페이지의 window 객체를 가져옴 
       🔹its(이전에 가져온 객체에 대한 프로티 값을 가져온다)
        📄https://docs.cypress.io/api/commands/its   
     */



describe("Log In", () => {
  it("should go to login page", () => {
    cy.visit("/")
      .title()
      .should("eq", "Login | Nuber Eats");
    
  })
  it("can see email / password validation errors", () => {
    cy.visit("/");
    cy.findByPlaceholderText(/email/i).type("bad@email");
    cy.findByText("Please enter a valid email")
    cy.findByPlaceholderText(/email/i).clear()
    cy.findByText("Email is required")
    cy.findByPlaceholderText(/email/i).type("bad@email");
    cy.findByPlaceholderText(/password/i).type("a").clear()
    cy.findByText("Password is required")
  }) 

  it("can fill out form", () => {
    cy.login("ceoosm5@gmail.com", "284823")
  })

  
})