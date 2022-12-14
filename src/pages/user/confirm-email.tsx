import React, { useEffect } from "react"
import {gql, useApolloClient, useMutation} from "@apollo/client";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../__generated__/types";
import { useHistory, useLocation } from "react-router-dom";
import {useMe} from "../../hooks/useMe"
import { Helmet } from "react-helmet";
/*#๏ธโฃ18.0 Verifying Email part One
  ๐งcode์ ์ถ์ฒ ๋ฐ ๋ฐ์ก&์์  ๋ก์ง ์ดํด๐ง
    1. [mailgun] ID: ceoosm@naver.com  / PW:tkfkdgodhtnakstnfm
      

    2. [๋ฐฑ์๋- users.service ]
        createAccount ๋ฅผ ํ๋ฉด โcode๊ฐ ์์ฑ๋๋ค
       [๋ฐฑ์๋ - verification.entity] 
         @BeforeInsert()
            createCode():void {
            this.code = uuidv4();โ
          } 
        ๐ verification ์ โcode๊ฐ์ ์ฅ ๋๋ค 
       [Templates- Editor] 
      <a href="http://127.0.0.1:3000/confirm?code={{code}}"โ> Please confirm your account! </a>  
    
    3. maligun > ceoosm@naver.com ์ด๋ฉ์ผ ๋ณด๋ด๋ ๋ฐฉ๋ฒ
     - ๊ฐ์: #7.9 Refactor 
     - ์์: โญlogin > editProfile์ ํ๋ฉด ๋ฉ์ผ์ด ์ ์ก์ด ๋๋ค
     - ์ด์ :  ํ๋กํ์ผ์ ํธ์ง ํ๋ฉด์ verification.code๋ฅผ ์์ฑํด์ 
             โกthis.mailService.sendVerifiacationEmail(user.email, โ  verification.code);
    
    4. user๋ ์๋ฌด๊ฒ๋ ์ํ๊ณ  > Confirming email(verifying)
       > โกmutation์ ์๋์ผ๋ก callํ๊ณ  > ๐คuser๋ confirm ๋  ๋๊น์ง ์๋ฌด๊ฒ๋ ์ํจ --- โญ์ปจํ
       > ๋ฌธ๊ตฌ: Please verify your email ์ฌ๋ผ์ง

    5. naver ๋ฉ์ผ์์ > confirm ๋งํฌ ์ด๋ฉด 
       > http://127.0.0.1:3000/confirm?code=d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40 (๋ณ๊ฒฝ ์ )
       > http://localhost:3000/confirm?code=d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40 (๋ณ๊ฒฝ ํ)
       > login ๋ ํ์ด์ง์์ ๐ซPage Not Found๊ฐ ๋ฌ๋ค (์ ํ์  domain์ผ๋ก ์์์์๋ง ํ์ ์  ์ฌ์ฉ)
         (์ํฉ ์ค๋ช: ์ ์ ๊ฐ ์ด๋ฉ์ผ์ ๋ฐ์ผ๋ ค๊ณ  naver ๋ฉ์ผ ํ์ธ )
         (๐ค4๋ฒ์์ ์ ์ ๊ฐ ๋ก๊ทธ์ธ ์ํ์์ ๊ธฐ๋ค๋ฆฌ๋ ์ํฉ์ ๋ง๋ค๊ธฐ ์ํด )
        [logged-in-router.tsx]
        const ClientRoutes = [
          <Route key={1} path="/" exact>
            <Restaurants />
          </Route>,
          <Route path="/confirm" exact>โ
            <ConfirmEmail />
          </Route>,  
         ]

       > logout์ํ > login์ํ๋ก ๋ณํจโ

      ๐นuseEffect(Callback, [prosps.source]): The default behavior of an effect is to fire the effect 
        after all rendering is complete. In this way, if one of the dependencies changes,
        the effect is always recreated.


             */
  /*#๏ธโฃ18.1 Verifying Email part Two
    1. [header.tsx] !data?.me.verified - "cache๋ก๋ถํฐ read ํ  ์๋ ์๊ณ  ๋ฐ๋ก write ํ  ์๋ ์๋ค"
       [apollo docs] - ๐https://www.apollographql.com/docs/react/caching/cache-interaction/#writequery-and-writefragment
       โญwriteFragment:(๊ฐ์ ํต์ฌ ํฌ์ธํธ)
        client.writeFragment({
          id: 'Todo:5', ๐ทwriteFragment 
          fragment: gql`  ๐ท์ฐ๋ฆฌ๊ฐ ๋ฐ๊พธ๊ณ  ์ถ์  type์ ํํธ 
            fragment MyTodo on Todo { ๐ทํด์: fragment๋ Todo type์ ์ผ๋ถ๋ถ === User์ verified(=fragment)  
              completed               ๐ทTodo๋ API ์์ ๊ฐ์ ธ์ค๋ ์ด๋ฆ(User)์ด์ด์ผ ํ๋ค   
            }
          `,
          data: {
            completed: true, ๐ท new data๋ฅผ sendํจ 
          },
        });     
 

       > ๊ธฐ๋ณธ์ ์ผ๋ก id๋ฅผ ๊ฐ์ง๊ณ  fragmet๋ฅผ ์ฐพ์ ์ ์์ด์ผ ํ๋ค
       > [Apollo tool - CASHE] โApollo๊ฐ CACHE model์ type(id๋ฑ์ ์์ฑ)๊ณผ id field๋ก id๋ฅผ ๋ง๋ ๋ค๋ ๊ฒ
         User:4
          __typename:"User"
          id:4  ๐ทwriteFragment  
          email:"ceoosm2@gmail.com"
          role:"Client"
          verified:false
       
         User:4
        [useMe.tsx]
         const ME_QUERY = gql`
          query me{
            me {
              idโ
              email
              role
              verified
            }
          }
        `  
         
     ๐นreload:์ฌ์ ์ฌ,์ฌ๋ฐฐ์น ํ๋ค - '์๋ก๊ณ ์นจ'์ ์๋ฏธ๋ก ์ถ์   
    #๏ธโฃ18.2 Edit Profile part One
     1. ๐ง ๐ดcode๊ฐ ๋ฐ๋ d4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40 !== bb9f054d-02a3-44ca-b42a-3c2b8ded9d97
       ์ฐ์  createAccount๋ก ๊ณ์ฑ์ ์๋ก ๋ง๋ค์ด์ 'code'๊ฐ ์์ฑ๋์ด์ confirm์ด๋ฉ์ผ์ด ๋ณด๋ด์ง๋์ง ?
       ๊ทธ ์ฝ๋๋ฅผ > verifyEmail์ ํตํด์ > cash์์ true > Home ์ผ๋ก ์ด๋  
        id: mansour@naver.com / 284823
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjY2NDE2ODM4fQ.vJrTpg2b34cmCXshsOLGOJ1tquK243q6CA1vuh-5Upk" 
        code-mail:๐ดd4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40

        id: mansour2@naver.com / 284823 
        token:  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNjY2NDE4MDcxfQ.xXwgOqci7eyG17D9QZ89XxB3QvOiloERtPBdvzl6sFo"
        code-mail:๐ดd4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40
               
        
        id: mansour3@naver.com / 284823
        code-db: 7ec18cd8-ccd9-44f9-a9fe-600331e24856
        code-mail:๐ดd4c6b79f-4eb5-47e0-ab69-a5a1e75f3c40

        ๐ตceoosm@naver.com ์ญ์   
          - id: 13
          - verified: false, 
          - code(db):  717c80e0-f90b-4cdd-9d43-b2939d475a96
            code(mail):๐ต 717c80e0-f90b-4cdd-9d43-b2939d475a96
                       
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