import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import { EditProfileMutation, EditProfileMutationVariables } from "../../__generated__/types";
//⭐useForm<IFormProps> === input의 name 속성을 interface함 

/*#️⃣18.3 Edit Profile part Two
  1. ...(password !== "" && { password })
    > password가 object 안에 있는 password를 추가하게 된다 
    > 한마디로 password가 ""와 같지 않은 경우 중괄호를 없앤다
   🔹const hello = { a : 1}
     ...hello // a:1

*/
/*#️⃣18.4 writeFragment vs Refetch
  1. query를 refetch: cache를 update 한다
     새로운 data가 백엔드에서 들어오길 기다리지 않고 프론트엔드에서 바로 update하는 거다 

  2. refetch 
  const {data: userData, ✅refetch} = useMe()
    🔹refetch: function인데 call하면 query를 다시 fetch한다 > ⚡cache가 자동적으로 update 된다 = Apollo가 update
  const onCompleted = ✅async (data: EditProfileMutation) => {
    const { 
      editProfile: { ok }
    } = data;

    if(ok && userData ){
    ✅await refetch()   ⚡useMe > useQuery > 백엔드에서 가져옴 ⚡
      
    }
  } 

 */
const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input:EditProfileInput!) {
      editProfile(input:$input){
        ok
        error 
      }
    }
`

interface IFormProps {
  email?:string;
  password?:string;
}
export const EditProfile = () => {

  const {data: userData, refetch} = useMe()
  const client =  useApolloClient()
  const history = useHistory();
  //📄https://www.apollographql.com/docs/react/api/react/hooks/#options-2
  const onCompleted = (data: EditProfileMutation) => {
    const { editProfile: {error, ok}} = data;
    
    if(ok && userData ){
      //update the cache
      const {
        me: {email: prevEmail, id }
      } = userData;
      const { email: newEmail } = getValues()
      if(prevEmail !== newEmail){
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email,
              verified 
            }
          `,
          data:{
            email: newEmail,
            verified: false
          }
        })
        //history.push("/")
      }
    }
  }
  const [editProfile, {loading}] = useMutation<
    EditProfileMutation,
    EditProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
      onCompleted
  })
  const{ register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode:"onChange",
    defaultValues:{
      email:userData?.me.email
    }
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables:{
        input:{
          email,
        ...(password !== "" && {password})
        }

      }
    })
  }
  
  return (
    <div className=" mt-52 flex flex-col items-center justify-center ">
      <Helmet>
        <title> EditProfile | Nuber Eats </title> 
      </Helmet>
      <h4 className=" font-semibold text-2xl mb-3">Edit Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)} className=" grid w-full max-w-screen-sm gap-3 mt-5 mb-5 ">
        <input
          {...register("email", {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
          })} 
          className="input" 
          type="email" 
          placeholder="Email"/>
        <input 
          {...register("password")}
          className="input" 
          type="password" 
          placeholder="password"/>
        <Button loading={loading} canClick={formState.isValid} actionText="Save Profile"  />

      </form>
    </div>
  )
}