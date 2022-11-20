import React from "react";
import {BrowserRouter , Switch, Route} from "react-router-dom";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";
/*#️⃣15.1 React Hook Form
  1.🔹handleSubmit(콜백): 제출 했을때, 폼이 유효하면 콜백을 호출함  
    🔹formState: {error}
      > 예시: 🔴ceoosmm@dmail.com ▶email {type: 'pattern', message: '', ref: input}  

    🔹{...register("email", {required: "This is required", })} 
      ▶email: {type: 'required', message: 'This is required', ref: input}

*/
/*#️⃣15.16 Router and 404s
  switch가 있으면 한 번에 route 하나만 render 하라고 알려줌 
*/

export const LoggedOutRouter = () => {

 return(
    <BrowserRouter >
      <Switch>
        <Route path={["/create-account"]}>
          <CreateAccount />
        </Route>
        <Route exact path={["/"]} >
          <Login />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}