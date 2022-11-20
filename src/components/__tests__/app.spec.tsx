
/*#️⃣20.0 Test Setup
  1. 📄https://testing-library.com/docs/dom-testing-library/intro/
  ⭐📄 https://create-react-app.dev/docs/running-tests  
   > jest는 🛸'create-react-app 프로젝트'에 이미 설정되어 있다 
   🔹override(~보다 중요하다): JS - 객체의 상속받은 부모의 메소드를 재정의하는 것을 의미 
  
  2. [package.json]
     "jest":{
        "bad": "seeting"
      },
      🚨Out of the box, Create React App only supports overriding these Jest options:
        • clearMocks
        • collectCoverageFrom
        • coveragePathIgnorePatterns
        • coverageReporters
        • coverageThreshold
        • displayName
        • extraGlobals
        • globalSetup
        • globalTeardown
        • moduleNameMapper
        • resetMocks
        • resetModules
        • restoreMocks
        • snapshotSerializers
        • testMatch
        • transform
        • transformIgnorePatterns
        • watchPathIgnorePatterns.
   🅰 These options in your package.json Jest configuration are not currently supported by Create React App:
   
  3. Coverage Reporting 
    > npm test -- --coverage "우리 app 모든 부분의 coverage를 확인해서 보여준다 "
    > npm test -- --coverage --watchAll=false   
    > ⭐component, pages, routers 테스트 한다!

  4. jest가 '특정 폴더'에서만 테스트 파일을 찾을 수 있도록 만듬
     "jest":{
      "collectCoverageFrom":{
        "./src/components/별별/별.tsx",  ---⭐components 안에서 모든 폴더의 모든 tsx파일의 coverage를 검사 --- 
        "./src/pages/별별/별.tsx",
        "./src/routers/별별/별.tsx"
      }
     }  

  5. code자체를 테스트하는게 아니라 user의 관점에서 components를 테스트 한다 
   */

/*#️⃣20.1 App Tests
  1. render:🚫 'react-dom'에서 가져오면 안됨 
            ⭕ @testing-library/react 
    > render funtion에는 우리가 테스트하고 싶은 실제 component를 주면 된다 

  2.🚨Invariant Violation: ✅Could not find "client" in the context or passed in as an option.
     Wrap the root component in an <ApolloProvider>, or pass an ApolloClient instance in via options.
    
    🔵어떻게 [app.tsx]를 render하고 있지!?  
      > [index.tsx]
        <ApolloProvider client={client}>✅
          
      > 'token'이 안들어옴 따라서 > logged in이 되지 않는다  
      > login page에 있는 useMutation을 신결 쓸 필요가 없다
      > [app.tsx] ⚡return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter /> 궁금 한거다 

    
    🔹wrapper: 자바스크립트와 같은 프로그래밍 언어에서 하나 이상의 다른 기능들을 호출 하기 위한 기능
               때로는 순전히 편의상, 때로는 프로세스에서 약간 다른 작업을 하도록 적응시키는 기능 

    3.모킹 
      📄https://jestjs.io/docs/es6-class-mocks#calling-jestmock-with-the-module-factory-parameter
      🔹jest.mock(path, moduleFactory)
        - moduleFactory: ✅A module factory is a function that returns the mock

      
      🔹jest.fn(implementation?) & jest.spyOn(object, methodName) 
        📄https://jestjs.io/docs/jest-object#jestfnimplementation
        Returns a new, unused mock function. Optionally takes a mock implementation.
        예시1) const mockFn = jest.fn()
               mockFn()
               expect(mockFn).toHaveBeenCalled();

      ⭐예시2)✅const returnsTrue = jest.fn(() => true);
                console.log(returnsTrue())  // true;

      🔹mockImplementation():
       📄https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn 
        <Tip❗>
         jest.fn(implementation) === jest.fn().mockImplementation(implementation) 
     
      🔹it(): The Jest docs state it is an alias of test

    4.🔹debug
      describe("<App>", () => {
        it("renders OK", () => {
          const utils = render(<App />);   🚫const {debug} = render(<App />)
          screen.debug() ✅ 
        })

      })

      ● Console
        <body>
          <div>
            <span>
              logged-out
            </span>
          </div>
        </body> 
     */
import { render, waitFor } from "@testing-library/react";
import {screen} from '@testing-library/react'
import React from "react";
import { isLoggedInVar } from "../../styles/apollo";
import { App } from "../app";    

jest.mock('../../routers/logged-out-router', () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>
  }

})
jest.mock('../../routers/logged-in-router', () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>
  }

})



describe("<App/>", () => {
  it("renders LoggedOutRouter", () => {
    
    const {debug, getByText} = render(<App />);
    screen.getByText("logged-out")
    
  });
  it("renders LoggedInRouter", () => {
    isLoggedInVar(true);
    const {debug, getByText} = render(<App />);
    screen.getByText("logged-in")
    //screen.debug()
  })
})



