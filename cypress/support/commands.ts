
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

/*#๏ธโฃ21.5 Custom Commands
  ๐ทdeclare ํค์๋: ์ปดํ์ผ๋ฌ์๊ฒ ํด๋น ๋ณ์๋ ํจ์๊ฐ ์ด๋ฏธ ์กด์ฌํ๋ ๊ฒ์ ์๋ฆฌ๋ ์ญํ  
                    ๋ค๋ฅธ ์์ญ ์ฝ๋์์ declare๋ก ์ ์ธ๋ ํด๋น '๋ณ์'๋ 'ํจ์'๋ฅผ ์ฐธ์กฐํ  ์ ์๋ค  
                    ์ ์ญ๋ณ์ ๋๋ .d.tsํ์ผ์ ๋ง๋ค๋ ์ฌ์ฉ 
  ๐ทTS์ ๋ด๋ถ๋ชจ๋: 
    - top-level(์๋ฌด๊ฒ์ผ๋ก๋ ๊ฐ์ธ์ง์ง ์์ ์ต์์ ๋ ๋ฒจ )export๊ฐ ์กด์ฌํ๋ฉด ํด๋น tsํ์ผ์ '๋ชจ๋ ํ์ผ'๋ก ์ธ์
      top-level์ ์๋ฌด๋ฐ import๋ export๊ฐ ์กด์ฌํ์ง ์๋๋ค๋ฉด TSํ์ผ์ '์คํฌ๋ฆฝํธ ํ์ผ๋ก ์ธ์' 
    - ์ ์ญ ์ค์ฝํ ์ค๋ธ์ ํธ๋ก ๋ช๋ช  

   ๐นnamespace: TS ์ ๋ค์์คํ์ด์ค๋ ๋ชจ๋ ๋ฐฉ๋ฒ(Internal Module) ์ ๊ณต
                Use namespaces to organize types. ๐https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html

     ์์)๐ namespace Cypress{                       
               interface Chainable{      >>> (์ฐธ์กฐ) >>> <reference path= "commands.ts" >  
                assertLoggedIn():void;
               }
             }
     
    โก์ธ๋ถ ๋ชจ๋ ์์ ๋๋ฆฝ๋ ๋ชจ๋ ๋ณด์ฅ          


  ๐ทTS์ ์ธ๋ถ๋ชจ๋: module-loader๋ฅผ ์ด์ฉ(์์กด)ํ๋ ์ธ๋ถ๋ชจ๋ - CommonJS(Node)/Require.js/ES Module 
    ์) import * as express from "express";

  ๐ทtype: You can use a type alias to make a shorthand for a type:
     type GreetingLike = string | (() => string) | MyGreeter;

  ๐ทkeyof: The keyof operator takes an object type and 
    ๐https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#handbook-content  
   ์์) export enum UserRole {
          Client = "Client" ,  โ์๋๋ UserRole.Client = 0 
          Owner = "Owner"  , 
          Delivery ="Delivery" ,
        }

       export type AllowedRoles = keyof typeof UserRole | 'Any';  
       > โกtype AllowedRoles = "Client" | "Owner" | "Delivery" | "Any"
    
    ๐นNumeric enums: ์ซ์ ์ด๊ฑฐํ    

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

