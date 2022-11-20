/*#️⃣15.4 Form Design
  1.flex container 
   🔹justify(행의 끝을 나란히 맞추다): 메인축 좌/우
    > justify-content: center;
   🔹align(일직선으로 하다, 나란히 만들다): 메인축 위/아래
    > align-items: center;
  #️⃣15.5 Form Login
    1. 📄https://tailwindcss.com/docs/ring-width & https://tailwindcss.com/docs/ring-offset-width
      🔹focus:outline-none 하는 이유는 디폴트 값으로 블랙으로 처리 됨 따라서 처리 해주고 
      🔹focus:ring-2 focus:ring-pink-500 focus:ring-opacity-900 
   
    2. useForm이 name을 찾는데 
       - 형식1: <input name="email" />
       - 형식2: {...register("email", )}

    3. 🔹form태그(블록) 안에서: input, button이 인라인 태그라도 블록으로 쌓임❗
       
  #️⃣15.6 Login Mutation part one 
   🚨mutation PotatoMutation($email:String!, $password: String!) > 프론트엔드에서만 사용!❗
    1.const LOGIN_MUTATION = gql`
      mutation PotatoMutation($email:String!, $password: String!) {  
      🔷backend 하듯이 적어줘야 함, playground 기입방식 
        login(input:{
          email:$email,
          password: $password
        })
      }
    `
    🔹$email: $표시는 '변수'라는 뜻 > Apollo가 변수로 이해 한다 
    2. const [loginMutation, {loading, error, data}] = useMutation(LOGIN_MUTATION)
     🔹useForm 훅의 1번째 인수:이 function은 mutation의 방아쇠 역할이다  역할은 mutation function이다
     🔹useForm 훅의 2번째 인수: mutatio으로 부터 되돌아 오는 'data'
        🔯loading: mutation이 실행중이다
        🔯error: mutation이 error를 반환
        🔯data: 출처는 --- 백엔드, DTO 아웃풋에서 온다
    3. logingMutation({
        variables: {
          email,
          password:28423  🔴에러발생: mutation에 type을 이용하지 않았을 경우 
        }
       }) 
    ✅email:"ceoosm@gmail.com",
      password:"284823",
      role:Client
      "x-jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjY1NDA0MzQyfQ.8iibfq5HS2aVxyAoiJQsu-Is8keGv33hNVQ5AdTcDag"
    
    #️⃣15.7 Apollo Codegen
    4.🚧apollo codegen - 📄https://github.com/apollographql/apollo-tooling  설치
      > npm install -g apollo && npm install apollo 
      > apollo-tooking은 backend에서 🔹mutations, query response, input type🔹을 
        전부 다 'typescript  정의'로 자동으로 생성 해준다
      🔵해석1: "mutation을 보냄🚀(🚧type 자동정의) --- 🛸back-end에서 데이터를 전송한다는 것을 확신 할 수 있다" 
      🔵해석2:  DTO가 모든 것의 시작이라는 점, schema가 front-end를 위한 typescript가 되었다
    
    5.📄https://github.com/apollographql/apollo-tooling#configuration
      🔹[apollo.config.js] 참고❗❗
        
         
       */
/*#️⃣15.7 Apollo Codegen
  1. [apollo codegen] - 📄https://github.com/apollographql/apollo-tooling  설치
      > 🚧npm install -g apollo && npm install apollo 🔴
      > 🚧 npm install -D @graphql-codegen/cli 🔵
           npm install -D @graphql-codegen/typescript-operations @graphql-codegen/typescript 🔵
      
      > apollo-tooling은 backend에서 🔹mutations, query response, input type🔹을 
        전부 다 'typescript  정의'로 자동으로 생성 해준다
      🔵해석1: "mutation을 보냄🚀(🚧type 자동정의) --- 🛸back-end에서 데이터를 전송한다는 것을 확신 할 수 있다" 
      🔵해석2:  DTO가 모든 것의 시작이라는 점, 🔯schema가 front-end를 위한 typescript가 되었다
    
    2.📄https://github.com/apollographql/apollo-tooling#configuration
      📄https://the-guild.dev/graphql/codegen/docs/guides/react-vue  
      🔹includes: "apollo에게 file을 알려줘야 한다  " === 🔹documents
        > apollo가 뭘 할까 ? apollo가 기본적으로 하는 일은 파일을 보면서 🔯gql(태그이름)을 보면
         apollo는 🔯typescript definition을 나에게 준다 
      🔹tagName: 'gql'    === 🔹(API에서 찾아주는 걸로 추정)
     [login.tsx]
     const LOGIN_MUTATION = gql`
      mutation PotatoMutation($email:String!, $password: String!) {
        login(input:{
          email:$email,
          password:$password
        }){
          ok
          error
          token
        }
      }
    `
  3. Apollo 실행 
   > npx Apollo
   > 📄https://github.com/apollographql/apollo-tooling#configuration > ✅apollo client:codegen
   > 🔹사용법:  apollo client:codegen [OUTPUT] [OPTIONS] > npm client:codegen mytypes.d.ts --target=typescript
     🔹[OUTPUT]: mytypes.d.ts
     🔹[OPTIONS]: --target=target > --target=typescript
      🚧npm i -g apollo 🔴Warn: deprecated + 더이상 지원 하지 않음
      🚧https://the-guild.dev/graphql/codegen/docs/guides/react-vue 🔵해결완료
        
  4. 요약: 
       npm install -D @graphql-codegen/cli   
       import { CodegenConfig } from '@graphql-codegen/cli' + [codegen.ts]파일
       npm install -D @graphql-codegen/typescript-operations @graphql-codegen/typescript
       [package.json] : "script":{ "generate": "graphql-codegen" } 
       > npm run generate  
       > ✅Parse Configuration
         ✅Generate outputs

  5. const [loinMutation, {loading, error, data}] = useMutation🔯<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION) 
     🔯loingMutation(): useMutation(🔷mutation login) Hook의 trigger,   
     🔯data: loginMutation의 반환값
     🔯loading: 아직 결과값을 안 받아옴     

   */
/*#️⃣15.8 Login Mutation
  1. output(LoginMutation 아웃풋)에서 'error:false' === 🔹GraphQl에겐 onCompleted라는 뜻 
  2. GraphQL에서의 error는 request가 유효하지 않다 === 인증이 필요, url 오류      
*/
/*#️⃣15.9 Login Mutation part Two
  1. 📄npmjs.com/package/rimraf > npm i rimraf  === 🔹rm -rf: 파일 삭제 + 실행   
 
  2.  🚧Error: ECONNREFUSED 127.0.01:4000
      🔵localChemaFile isn't provided, Apollo tries to fetch a schema from https://localhost:4000/graphql
        > ✅서버를 먼저 켜야 > codegen.ts  > 프론트앤드를 키면 발생하는 에러     

      🚧Failed to load resource: net::ERR_SSL_PROTOCOL_ERROR(오류107)
        원인1 - "SSL 연결 오류", 브라우저가 서버에 대한 보안 연결을 만들 수 없음을 의미
         > 서버 또는 컴퓨터에 안전하게 연결하는 데 필요한 '클라이언트 인증서'가 없는 것이 원인  
        해결1.📄http://1004lucifer.blogspot.com/2018/11/chrome-errsslprotocolerror.html
               서버가 낮은 버전의 프로토콜을 사용하는 경우
              브라우저에서 낮은 버전의 프로토콜을 사용 가능하도록 옵션을 변경해 준다  
        [구글 크롬 ssl 설정]  
        📄https://ko.wukihow.com/wiki/Enable-SSL-3.0
          인터넷 옵션 > 22.10.19 🔴SSL3.0사용 체크 안됨 >> 체크 후 다시 시작 >> 🔴같은 에러
        [다른 브라우저를 사용] 
          크롬 >> 🔴Edge 
        [Cipher Suites]
          🔹TLS(Transport Layer Security): 인증성,기밀성,무결성
          🔹SSL(Secure Sockets Layer):전송 계층 보안, TLS의 표준화 되기 전의 이름 
          🔹socket: 클라이언트와 서버 사이 같은 프로그램 계층끼리 주고받는 소켓 방식 
        [Request URL - https]
        📄https://stackoverflow.com/questions/60548707/neterr-ssl-protocol-error-on-http-post-to-express-server        
          🔴원인은 Request URL: https://localhost:4000/graphql     
          🔵[apollo.ts]
    3. 🔯const [login, {data, loading }] = useMutation
         - useMutation은 반드시 리스트를 반환, 첫 원소는 반드시 호출해 줘야 하는 mutation function   

        */
import {  gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {LoginMutationVariables, LoginMutation} from "../__generated__/types";
import logo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { authTokenVar, isLoggedInVar } from "../styles/apollo";
import { LOCALSTORAGE_TOKEN } from "../styles/constant";

const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput){
      ok,
      error,
      token,
    },
  }
`

interface ILoginForm {
  email: string;
  password: string;
  resultError:string;
}   
export const Login = () => {
  const {register,
    getValues,
    formState:{ errors },
    handleSubmit,
    formState
  } = useForm<ILoginForm>({
    mode: "onChange" //📄https://react-hook-form.com/api/useform 제대로 이해해야 로직이 이해가 감 
  });
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, ok, token}
    } = data;

    if(ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token)
      authTokenVar(token)
      isLoggedInVar(true);
    }
  }
  const [login, {loading, error, data: loginMutationResult, }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
      onCompleted: onCompleted
   })


  const onValid = () => {
    if(!loading){ 
      const {email, password} = getValues();
      login({
        variables:{
          loginInput:{
            email,
            password,
          }
        }
      })
    }
  }
  //rem: 16px 배수 > 2.5rem = 40px
  return (
  <div className="h-screen flex items-center flex-col mt-10 lg:mt-28"> 
    <Helmet>
      <title>Login | Nuber Eats </title>
    </Helmet>
    <div className=" w-full max-w-screen-sm flex flex-col px-5 items-center">
      <img src={logo} className=" w-52 mb-5" alt="Nuber Eats"/>
      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Welcom back
      </h4>
      <form 
        className="grid gap-2 mt-5 w-full mb-3 " 
        onSubmit={handleSubmit(onValid)}
      > 
        <input
          {...register("email", {
            required: "Email is required",
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
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
          type="password"
          placeholder="Password" 
          className="input"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password.message}/>
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10 chars."/>
        )}
        <Button 
          canClick={formState.isValid}
          loading={loading}
          actionText={"Log in"}
        />
        {loginMutationResult?.login.error && (
          <FormError errorMessage={loginMutationResult.login.error} />
        )}
      </form>
      <div>
        New to Nuber?{" "}
        <Link to="/create-account" className=" text-lime-600 hover:underline"> Create an Account</Link>
      </div>
    </div>        
  </div>
  )
}