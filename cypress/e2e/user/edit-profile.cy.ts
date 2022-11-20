
/*#️⃣21.6 EditProfile E2E part One
  1. 🔷beforeEach: 📄https://mochajs.org/
    - description: run before each test
  #️⃣21.6 EditProfile E2E part Two
  1. 


*/

describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    user.login("ceoosm11@gmail.com", "284823");
  })
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(2000)
    user.title().should('eq', "EditProfile | Nuber Eats")
  })
  it("can change email", () => {
     user.intercept('POST', "http://localhost:4000/graphql", (req) => {
       if(req.body?.operationName === "editProfile") {
        //@ts-ignore
        req.body?.variables?.input?.email = "ceoosm11@gmail.com"
       }
     })
    user.visit("/edit-profile")
    user.findByPlaceholderText(/Email/i).clear().type("ceoosm12@gmail.com")
    user.findByRole('button').click();
  })

})