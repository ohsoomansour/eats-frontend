/*#️⃣21.4 Create Account E2E part Two
  1. ⭐cy.intercept: 📄https://docs.cypress.io/api/commands/intercept
    - 의미: HTTP request에 대한 spy를 허용 또는 stub(mock)

  1-1) ⭐modify real HTTP request' body, headers, and URL 
        계정 만들기의 response를 변경을 원한다     
        > 그 response는 지금 'user가 이미 존재합니다'라고 말하고 있다 
        > ⚡ 이 response를 수정해서, react.js가 성공적으로 계정이 생성되었다고 생각하게 만든다 
        > [소제목 - Intercepting a response ]


      🔹req.reply()
        - The req.reply() function can be used to send a stub(mock) response for an intercepted request. 
        By passing a string, object, or StaticResponse to req.reply(), the request can be preventing 
        from reaching the destination server.
        - 실행시, 모든 Query & mutation에게 이걸로 reply 하기 때문 

      🔹res.send(): 📄https://docs.cypress.io/api/commands/intercept#Ending-the-response-with-res-send        
        - 실제 받는 body는: [네트워크] --- graphql의 Response에서 받는다 
        - 모킹 res.send({ body }) : body는     
        
  1-2) 🚧로그인 할 때, 여전히 intercept 받고 있음 > token을 못 받는다 🚧
      > 🔴login mutation 을 하지 않기 때문에 따라서!
      > 🔵조건부를 만들어서 인터셉터 해줘야 한다! 
          oprationName 확인! 
      */
 /*#️⃣21.7 EditProfile E2E part Two
    1. 🔷fixture: [auth] - [create-account.json] fixtrue✅
        📄https://docs.cypress.io/api/commands/intercept#Response-object-properties 
      [예시]cy.intercept('http://localhost:4000', (req) => {
              req.reply((res) => {
                res.send({
                  fixture: "auth/create-account.json"
                })
              })      
                     
            })
 */         
describe("should see emial", () => {
  const user = cy;
  it("should see email / password validation errors", () => {
    user.visit("/")
    user.findByText(/create an account/i).click()
    user.findByPlaceholderText(/email/i).type("non@good")
    user.findByText("Please enter a valid email")
    user.findByPlaceholderText(/email/i).clear()
    user.findByText("Email is required")
    user.findByPlaceholderText(/password/i).type("1").clear()
    user.findByPlaceholderText(/email/i).type("ream@gmail.com")
    user.findByText("Password is required")
  })
  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      //console.log(req.body)
      const {operationName} = req.body
      if(operationName && operationName === 'createAccount'){
        req.reply((res) => {
          res.send({
            fixture: "create-account.json"
          })
        })
      }   
    })
    user.visit("/create-account")
    user.findByPlaceholderText(/email/i).clear()
    user.findByPlaceholderText(/email/i).type("ceoosm11@gmail.com")
    user.findByPlaceholderText(/password/i).type("284823")
    user.findByRole('button').click()

    user.wait(1000)
    cy.login("ceoosm11@gmail.com", "284823")
    
  })
})