import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import {Login} from "../../pages/login"
import {BrowserRouter as Router} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

/*#️⃣20.5 Login Tests part One
  1. 📄github.com/Mike-Gibson/mock-apollo-client

   🔹waitFor(): stat가 바뀌는걸 await하게 해준다 
   🔹Link 컴포넌트: 새로고침없이 페이지를 변경 
*/


describe("<Login />",  () => {
  it("should render ok", async () =>{
    await waitFor(() => {
      const mockedClient = createMockClient();
    render(
     <HelmetProvider> 
      <Router>
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      </Router>
      </HelmetProvider>   
    )
    })    
  })

})