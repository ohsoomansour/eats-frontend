import {  gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { CreateAccountMutation, CreateAccountMutationVariables, UserRole} from "../__generated__/types";
import logo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import Helmet from "react-helmet";

/*#️⃣15.13 Create Account Mutation part Two 
  1. useMutation Hook:  
   🔹status: 📄https://www.apollographql.com/docs/react/data/mutations/#tracking-mutation-status
   🔹onCompleted:📄https://www.apollographql.com/docs/react/api/react/hooks/#options-2 
    - 간략
    - callback function: (data) => void; 
  2.계성 생성(샘플1)
   emai: ohsoomansour@naver.com
   password: 284823  
   role:Client

  3. 용어정리 
   🔹GraphQL SDL(Schema Definition Language)
     예시) type Person {
             name: String!
             age: Int!
            }
   🔹transpile vs compile 
     - 📄https://ideveloper2.tistory.com/166
     - transpile: 비슷한 수준의 추상화 예) es6 > es5 , ts > JS
     - 한 언어로 작성된 소스 코드를 다른 언어로 변환하는 것

    🔹tsconfig.js - include등 블로그 참조 📄https://kay0426.tistory.com/69
     */ 
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      error
      ok
    }
  }
`

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
  address:string;
}

export const CreateAccount= () => {
  const {register,
    getValues,
    formState:{ errors },
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: "onChange", //📄https://react-hook-form.com/api/useform 제대로 이해해야 로직이 이해가 감 
    defaultValues: {
      role: UserRole.Client
    }
  });
  const history = useHistory()
  const onCompleted = (data:CreateAccountMutation) => {
    const {
      createAccount:{ ok }
    } = data;
    console.log(data)
    if(ok){
      alert("Account is created! Log in now")
      history.push("/")
    }
  }

  const [createAccount, {loading, data:createAccountMutationResult}] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted
  })
  


  const onValid = () => {
    if(!loading){
      const {email, password, role, address} = getValues()
      createAccount({
        variables:{
          createAccountInput:{
            email,
            password,
            role,
            address
          }
        }
      });
    }
  }

  //rem: 16px 배수 > 2.5rem = 40px
  return (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28"> 
    <Helmet>
      <title>Create an Account | Nuber Eats </title>
    </Helmet>
    <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
      <img src={logo} className=" w-52 mb-5" alt="Nuber-eats" />
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Let's get started 
      </h4>
      <form 
        className="grid gap-2 mt-5 w-full mb-3 " 
        onSubmit={handleSubmit(onValid)}
      > 
        <input
          {...register("email", {
            required: "Email is required",
            pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/  
          })}
           placeholder="Email"
           className="input mb-3 "
           type="email"

        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email.message}/>
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid email"}/>
        )}
        
        <input
          {...register("password", {required: "Password is required"})} 
          placeholder="Password" 
          className="input"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password.message}/>
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10 chars."/>
        )}
        <select {...register("role", {required:true})} className="input">
          {Object.keys(UserRole).map((role, index) => (
            <option key={index}>{role}</option>
          ))}
        </select>
        <input 
          {...register("address", {required: "Address is required"} )}
          className="input"
          placeholder="Address"
        />
        {errors.address?.message && (
          <FormError errorMessage={errors.address.message} />
        )}


        <Button 
          canClick={formState.isValid}
          loading={loading}
          actionText={"Create Account"}
        />
        {createAccountMutationResult?.createAccount.error && (
          <FormError 
            errorMessage={createAccountMutationResult.createAccount.error}
          />
        )}

      </form>
      <div>
        Already use Uber?{" "}
        <Link to="/" className=" text-lime-600 hover:underline"> Sign in </Link>
      </div>
    </div>        
  </div>
  )
}