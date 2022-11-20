
/*#️⃣20.4 Testing Header and 404
  1. 📄https://www.apollographql.com/docs/react/api/react/testing/#mockedprovider
  2. [logged-in-router.tsx]
      <BrowserRouter>✅
          <Header />
      </BrowserRouter>

  3. const Header = () => {
       const {data} = useMe();
    }

    [useMe.tsx]
    const ME_QUERY = gql`
      query me{
        me {
          id
          email
          role
          verified
        }
      }
    `
    export const useMe = () => {
      return useQuery<MeQuery>(ME_QUERY)
    }
    🔴component = <Header /> 안에서 뭔가를 mock하면 안된다 --- 🚫useMe() hook 자체를 mock하면 안된다!
    🔵  hook에 결과를 주는걸 mock해야 한다는 의미 
      > graqhql request를 mock 할거다
      > <MockedProvider mock={[]}> 
       📄https://www.apollographql.com/docs/react/development-testing/testing/#defining-mocked-responses
        mocks는 query, mutation, result를 mock 할 수 있게 해준다
    
    4. await new Promise(resolve => setTimeout(resolve, 0))
      state update도 기다려줘야 한다

      */
import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor, screen, act, findByText } from "@testing-library/react";
import {BrowserRouter } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";     
import { Header } from "../header";

describe("<Header />",  () => {
  it("renders verify banner", async () => {
    
      await waitFor(async () => {
        const {debug,  getByText} = render(
          <MockedProvider
            mocks={[
              {
                request: {
                  query: ME_QUERY,
                },
                result: {
                  data: {
                    me: {
                      id: 1,
                      email: "",
                      role: "",
                      verified: true,
                    },
                  },
                },
              },
            ]}
          >
            <BrowserRouter>
              <Header />
            </BrowserRouter>
          </MockedProvider>
        
          
        )
         
        
         await new Promise((resolve) => setTimeout(resolve, 5))
         debug()
      })
    })
  })
  
