


/*#️⃣22.2 File Upload part One
  1. File upload: 📃https://docs.nestjs.com/techniques/file-upload
    -  
    - 백엔드: npx nest g mo uploads > 백엔드 upload파일

  2. 프론트엔드
    🔷FormData(HTML Element)는 폼을 쉽게 보내도록 도와주는 객체
      - 형식: const formData = new FormData()
      - method: formData.append(name, value, fileName)
      - Content-Type: 속성은 multipart/form-data로 지정된 후 전송 
      - 사용예시
        const formData = new FormData()
        formData.append('file', autualFile)

 
     

  #️⃣22.4 Create Restaurant part Two
  1. 용어 정리   
    🔹image/*: 모든 타입의 이미지 파일이 허용됨 
     - 📃http://www.tcpschool.com/html-tag-attrs/input-accept
    🔹FileList type
      const onsSubmit = () => { console.log( ✅getValues() )  }
  ✅🔻file: FileList ("lets you access the list of files selected with the element." )
      ▶0: File {name: 'localschemafile제공x_에러.png', lastModified: 1666138094844, lastModifiedDate: Wed Oct 19 2022 09:08:14 GMT+0900 (한국 표준시), webkitRelativePath: '', size: 65311, …}   
    
    🔹FormData: Rest api인 Ajax로 폼(폼 태그) 전송을 가능하게 해주는  
      - html에 form 태그가 없을 때: new FormData() 로 생성  
    🔹HTTP Header: Body의 형식, Content-type
      form의 enctype 속성값: 폼 데이터가 서버로 제출될때 해당 데이터가 인코딩되는 방법을 명시
      1) application/x-www-form-urlencoded: default값으로, 모든 문자들을 서버로 보내기 전에 인코딩됨을 명시 
      2) text/plain: 공백 문자는 기호로 변환, 나머지 문자는 모두 인코딩되지 않음을 명시
      3) multipart/form-data: 모든 문자를 인코딩하지 않음을 명시, <form>요소가 파일이나 이미지를 서버로 전송할 때
        ⭐'POST'로 보내줘야 한다
        ⭐필요한 이유: 사진 파일  + 사진 설명 
         const formData = new FormData()
         formData.append("photo", files[0].uploadedFile);
         formData.append("comment", commentNocomment)

  2. 
    🚨Access to fetch at 'http://localhost:4000/uploads/' from origin 'http://localhost:3000' has been blocked by CORS policy
    : No 'Access-Control-Allow-Origin' header is present on the requested resource.
    If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.        
    🔵 백엔드 - [main.ts]에서 
       app.enableCors(); 
    

  3. 🚧Referrer Policy:strict-origin-when-cross-origin🚧     
    

  */
 /*#️⃣22.5 Cache Optimization part One
  1. 🔷refetchQueries: 'query를 다시 fetch해주는 기능'
      - 사용법: refetchQueries:[{query: ✅MY_RESTAURANT}]
      - 사용 이유: ⭐레스토랑을 생성 후 다시 돌아오면 '레스토랑이 생성 되지 않은거 처럼 보임' 
      - 프로세스: mutation이 정상 작동후, ⚡MY_RESTAURANT_QUERY refetch됨
      - cache의 이해: 처음부터 localhost:3000/add-restaurant으로 이동 > http://localhost:3000/  'My Restaurants' 페이지로 가면
                     My Restaurants에는 cache가 없다   
       
  2.📄DOCS: Apollo Client allows you to make local(+cashe) modifications to your GraphQL data by updating the cache
    🔹by updating the cache: ⚡refetchQueries작업

    
 */
import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../__generated__/types";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

 const CREATE_RESTAURANT_MUTATION = gql`
 mutation createRestaurant($input:CreateRestaurantInput!){
   createRestaurant(input:$input) {
     ok
     error
     restaurantId
   }
 }
`

interface IFormProps {
  name:string;
  address:string;
  categoryName:string;
  file: FileList
}

export const AddRestaurant = () => {
  
  const client = useApolloClient()
  const [ImageUrl, setImageUrl] = useState("")
  const history = useHistory()

  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant:{ ok, restaurantId }
    } = data; 
    if(ok) {
      const { file, name, categoryName, address,  } = getValues();
      setUploading(false)
      
      const queryResult = client.readQuery({
        query: MY_RESTAURANTS_QUERY,
        
      })

      client.writeQuery({
        query:MY_RESTAURANTS_QUERY,
        data:{
          myRestaurants:{
            ...queryResult.myRestaurants,
            restaurants:[
              {
                address,
                category: {
                  "__typename": "Category",
                  name: categoryName, 
                },
                coverImage: ImageUrl,
                id: restaurantId,
                "isPromoted": false,
                name,
                "__typename": "Restaurant",
                
              },
              ...queryResult.myRestaurants.restaurants
            ]
          }
        }
      })
      history.push("/")
    }
  }
  const [createRestaurant, {data}] = useMutation<
     CreateRestaurantMutation,
     CreateRestaurantMutationVariables
  >(CREATE_RESTAURANT_MUTATION, {
      onCompleted,
      //refetchQueries:[{query:MY_RESTAURANTS_QUERY}]
    })

  const {handleSubmit, register, getValues, formState:{errors}, formState} = useForm<IFormProps>({
    mode:"onChange"
  })
  const [uploading, setUploading] = useState(false)
   
  const onSubmit = async () => {
    try {
      setUploading(true)
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0]
      const formBody = new FormData();
      formBody.append('file', actualFile)
    
      const { url: coverImage } = await ( 
        await fetch("http://localhost:4000/uploads/", {
          method: 'POST',
          //headers:{ 'Content-Type': 'multipart/form-data' },
          body: formBody,
        })
         ).json()
      setImageUrl(coverImage);
      createRestaurant({
        variables:{
          input:{
            name,
            categoryName,
            address,
            coverImage
          },
        },
      });
    } catch (e) {}
     
  }
  return (
    <div className="container flex flex-col items-center ">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurnats</h1>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className=" grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          placeholder="Name"

          className="input"
          type="text"   
          {...register("name", {required: "Name is required"})}
        />
        <input
          placeholder="Address"
          className="input"
          type="text"
          {...register ("address", {required: "Address is required"})} 
         />
        <input
          placeholder="CategoryName"
          className="input" 
          type="text"
          {...register("categoryName", {required: "Category Name is required"})}
        />
        <div>
          <input
            {...register("file", { required: true })}
            type="file"
            accept="image/*"
            
            
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  )
}