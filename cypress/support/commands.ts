
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/*#️⃣21.5 Custom Commands
  🔷declare 키워드: 컴파일러에게 해당 변수나 함수가 이미 존재하는 것을 알리는 역할 
                    다른 영역 코드에서 declare로 선언된 해당 '변수'나 '함수'를 참조할 수 있다  
                    전역변수 또는 .d.ts파일을 만들때 사용 
  🔷TS의 내부모듈: 
    - top-level(아무것으로도 감싸지지 않은 최상위 레벨 )export가 존재하면 해당 ts파일은 '모듈 파일'로 인식
      top-level에 아무런 import나 export가 존재하지 않는다면 TS파일을 '스크립트 파일로 인식' 
    - 전역 스코프 오브젝트로 명명  

   🔹namespace: TS 의 네임스페이스는 모듈 방법(Internal Module) 제공
                Use namespaces to organize types. 📄https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html

     예시)🚀 namespace Cypress{                       
               interface Chainable{      >>> (참조) >>> <reference path= "commands.ts" >  
                assertLoggedIn():void;
               }
             }
     
    ⚡외부 모듈 안에 독립된 모듈 보장          


  🔷TS의 외부모듈: module-loader를 이용(의존)하는 외부모듈 - CommonJS(Node)/Require.js/ES Module 
    예) import * as express from "express";

  🔷type: You can use a type alias to make a shorthand for a type:
     type GreetingLike = string | (() => string) | MyGreeter;

  🔷keyof: The keyof operator takes an object type and 
    📄https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#handbook-content  
   예시) export enum UserRole {
          Client = "Client" ,  ✅원래는 UserRole.Client = 0 
          Owner = "Owner"  , 
          Delivery ="Delivery" ,
        }

       export type AllowedRoles = keyof typeof UserRole | 'Any';  
       > ⚡type AllowedRoles = "Client" | "Owner" | "Delivery" | "Any"
    
    🔹Numeric enums: 숫자 열거형    

    */
import '@testing-library/cypress/add-commands'
declare global {
  namespace Cypress{
    interface Chainable{
      assertLoggedIn():void;
      login(email: string, password: string):void;
      assertLoggedOut():void;
    }
  }
}

Cypress.Commands.add("assertLoggedIn", () => {
  cy.window().its("localStorage.nuber-token").should("be.a", "string")
})

Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.nuber-token").should("be.undefined")
})

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  cy.assertLoggedOut()
  cy.title().should("eq", "Login | Nuber Eats")
  cy.findByPlaceholderText(/email/i).type(email);
  cy.findByPlaceholderText(/password/i).type(password);
  cy.findByRole('button')
    .should('not.have.class', "pointer-events-none")
    .click()
  
  cy.assertLoggedIn()  
})

