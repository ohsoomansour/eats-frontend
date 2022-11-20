import React, { useEffect } from "react"
import {gql, useApolloClient, useMutation} from "@apollo/client";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../__generated__/types";
import { useHistory, useLocation } from "react-router-dom";
import {useMe} from "../../hooks/useMe"
import { Helmet } from "react-helmet";
/*#️⃣18.0 Verifying Email part One
  🚧code의 출처 및 발송&수신 로직 이해🚧
    1. [mailgun] ID: ceoosm@naver.com  / PW:tkfkdgodhtnakstnfm
      

    2. [백엔드- users.service ]
        createAccount 를 하면 ✅code가 생성된다
       [백엔드 - verification.entity] 
         @BeforeInsert()
            createCode():void {
            this.code = uuidv4();✅
          } 
        🚀 verification 에 ✅code가저장 된다 
       [Templates- Editor] 
      <a href="http://127.0.0.1:3000/confirm?code={{code}}"✅> Please confirm your account! </a>  
    
    3. maligun > ceoosm@naver.com 이메일 보내는 방법
     - 강의: #7.9 Refactor 
     - 순서: ⭐login > editProfile을 하면 메일이 전송이 된다
     - 이유:  프로파일을 편집 하면서 verification.code를 생성해서 
             ⚡this.mailService.sendVerifiacationEmail(user.email, ✅  verification.code);
    
    4. user는 아무것도 안하고 > Confirming email(verifying)
       > ⚡mutation을 자동으로 call하고 > 💤user는 confirm 될 때까지 아무것도 안함 --- ⭕컨펌
       > 문구: Please verify your email 사라짐

    5. naver 메일에서 > confirm 링크 열면 
       > http://127.0.0.1:3000/confirm?code=d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40 (변경 전)
       > http://localhost:3000/confirm?code=d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40 (변경 후)
       > login 된 페이지에서 🚫Page Not Found가 뜬다 (제한적 domain으로 작업시에만 한정적 사용)
         (상황 설명: 유저가 이메일을 받으려고 naver 메일 확인 )
         (💤4번에서 유저가 로그인 상태에서 기다리는 상황을 만들기 위해 )
        [logged-in-router.tsx]
        const ClientRoutes = [
          <Route key={1} path="/" exact>
            <Restaurants />
          </Route>,
          <Route path="/confirm" exact>✅
            <ConfirmEmail />
          </Route>,  
         ]

       > logout상태 > login상태로 변함✅

      🔹useEffect(Callback, [prosps.source]): The default behavior of an effect is to fire the effect 
        after all rendering is complete. In this way, if one of the dependencies changes,
        the effect is always recreated.


             */
  /*#️⃣18.1 Verifying Email part Two
    1. [header.tsx] !data?.me.verified - "cache로부터 read 할 수도 있고 바로 write 할 수도 있다"
       [apollo docs] - 📄https://www.apollographql.com/docs/react/caching/cache-interaction/#writequery-and-writefragment
       ⭐writeFragment:(강의 핵심 포인트)
        client.writeFragment({
          id: 'Todo:5', 🔷writeFragment 
          fragment: gql`  🔷우리가 바꾸고 싶은  type의 파트 
            fragment MyTodo on Todo { 🔷해석: fragment는 Todo type의 일부분 === User의 verified(=fragment)  
              completed               🔷Todo는 API 에서 가져오는 이름(User)이어야 한다   
            }
          `,
          data: {
            completed: true, 🔷 new data를 send함 
          },
        });     
 

       > 기본적으로 id를 가지고 fragmet를 찾을 수 있어야 한다
       > [Apollo tool - CASHE] ✅Apollo가 CACHE model의 type(id등의 속성)과 id field로 id를 만든다는 것
         User:4
          __typename:"User"
          id:4  🔷writeFragment  
          email:"ceoosm2@gmail.com"
          role:"Client"
          verified:false
       
         User:4
        [useMe.tsx]
         const ME_QUERY = gql`
          query me{
            me {
              id✅
              email
              role
              verified
            }
          }
        `  
         
     🔹reload:재적재,재배치 하다 - '새로고침'의 의미로 추정  
    #️⃣18.2 Edit Profile part One
     1. 🚧 🔴code가 바뀜 d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40 !== bb9f054d-02a3-44ca-b42a-3c2b8ded9d97
       우선 createAccount로 계성을 새로 만들어서 'code'가 생성되어서 confirm이메일이 보내지는지 ?
       그 코드를 > verifyEmail을 통해서 > cash에서 true > Home 으로 이동  
        id: mansour@naver.com / 284823
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjY2NDE2ODM4fQ.vJrTpg2b34cmCXshsOLGOJ1tquK243q6CA1vuh-5Upk" 
        code-mail:🔴d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40

        id: mansour2@naver.com / 284823 
        token:  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNjY2NDE4MDcxfQ.xXwgOqci7eyG17D9QZ89XxB3QvOiloERtPBdvzl6sFo"
        code-mail:🔴d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40
               
        
        id: mansour3@naver.com / 284823
        code-db: 7ec18cd8-ccd9-44f9-a9fe-600331e24856
        code-mail:🔴d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40

        🔵ceoosm@naver.com 삭제  
          - id: 13
          - verified: false, 
          - code(db):  717c80e0-f90b-4cdd-9d43-b2939d475a96
            code(mail):🔵 717c80e0-f90b-4cdd-9d43-b2939d475a96
                       
        */

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!){
    verifyEmail(input:$input){
      ok
      error
    }
}
`

export const ConfirmEmail = () => {
  const { data: userData } = useMe()
  //console.log(userData)
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: VerifyEmailMutation) => {
    
   const {
      verifyEmail: { ok } 
   } = data;
   if(ok && userData?.me.id) {
     client.writeFragment({
       id: `User:${userData.me.id}`,
       fragment: gql`
           fragment VerifiedUser on User {
             verified
           }
       `,
       data:{
         verified:true
       }
     })
     history.push("/")
   }
  }

  const [verifyEmail] = useMutation<
    VerifyEmailMutation,
    VerifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTATION, {
    onCompleted
  })

  
  useEffect(() =>{
    const [_, code] = window.location.href.split("code=")
    console.log(code)
    verifyEmail({
      variables:{
        input:{
          code
        }
      }
    })
  }, [])
  return (
    
    <div className=" mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title> Verify Email | Nuber Eats </title> 
      </Helmet>
      <h2 className=" text-lg mb-2 font-medium"> Confirming email... </h2>
      <h4 className=" text-gray-700 text-sm"> Please wait, dont' close this page...  </h4>
      
    </div>
  )
}