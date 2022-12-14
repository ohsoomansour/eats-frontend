


/*#๏ธโฃ22.2 File Upload part One
  1. File upload: ๐https://docs.nestjs.com/techniques/file-upload
    -  
    - ๋ฐฑ์๋: npx nest g mo uploads > ๋ฐฑ์๋ uploadํ์ผ

  2. ํ๋ก ํธ์๋
    ๐ทFormData(HTML Element)๋ ํผ์ ์ฝ๊ฒ ๋ณด๋ด๋๋ก ๋์์ฃผ๋ ๊ฐ์ฒด
      - ํ์: const formData = new FormData()
      - method: formData.append(name, value, fileName)
      - Content-Type: ์์ฑ์ multipart/form-data๋ก ์ง์ ๋ ํ ์ ์ก 
      - ์ฌ์ฉ์์
        const formData = new FormData()
        formData.append('file', autualFile)

 
     

  #๏ธโฃ22.4 Create Restaurant part Two
  1. ์ฉ์ด ์ ๋ฆฌ   
    ๐นimage/*: ๋ชจ๋  ํ์์ ์ด๋ฏธ์ง ํ์ผ์ด ํ์ฉ๋จ 
     - ๐http://www.tcpschool.com/html-tag-attrs/input-accept
    ๐นFileList type
      const onsSubmit = () => { console.log( โgetValues() )  }
  โ๐ปfile: FileList ("lets you access the list of files selected with the element." )
      โถ0: File {name: 'localschemafile์ ๊ณตx_์๋ฌ.png', lastModified: 1666138094844, lastModifiedDate: Wed Oct 19 2022 09:08:14 GMT+0900 (ํ๊ตญ ํ์ค์), webkitRelativePath: '', size: 65311, โฆ}   
    
    ๐นFormData: Rest api์ธ Ajax๋ก ํผ(ํผ ํ๊ทธ) ์ ์ก์ ๊ฐ๋ฅํ๊ฒ ํด์ฃผ๋  
      - html์ form ํ๊ทธ๊ฐ ์์ ๋: new FormData() ๋ก ์์ฑ  
    ๐นHTTP Header: Body์ ํ์, Content-type
      form์ enctype ์์ฑ๊ฐ: ํผ ๋ฐ์ดํฐ๊ฐ ์๋ฒ๋ก ์ ์ถ๋ ๋ ํด๋น ๋ฐ์ดํฐ๊ฐ ์ธ์ฝ๋ฉ๋๋ ๋ฐฉ๋ฒ์ ๋ช์
      1) application/x-www-form-urlencoded: default๊ฐ์ผ๋ก, ๋ชจ๋  ๋ฌธ์๋ค์ ์๋ฒ๋ก ๋ณด๋ด๊ธฐ ์ ์ ์ธ์ฝ๋ฉ๋จ์ ๋ช์ 
      2) text/plain: ๊ณต๋ฐฑ ๋ฌธ์๋ ๊ธฐํธ๋ก ๋ณํ, ๋๋จธ์ง ๋ฌธ์๋ ๋ชจ๋ ์ธ์ฝ๋ฉ๋์ง ์์์ ๋ช์
      3) multipart/form-data: ๋ชจ๋  ๋ฌธ์๋ฅผ ์ธ์ฝ๋ฉํ์ง ์์์ ๋ช์, <form>์์๊ฐ ํ์ผ์ด๋ ์ด๋ฏธ์ง๋ฅผ ์๋ฒ๋ก ์ ์กํ  ๋
        โญ'POST'๋ก ๋ณด๋ด์ค์ผ ํ๋ค
        โญํ์ํ ์ด์ : ์ฌ์ง ํ์ผ  + ์ฌ์ง ์ค๋ช 
         const formData = new FormData()
         formData.append("photo", files[0].uploadedFile);
         formData.append("comment", commentNocomment)

  2. 
    ๐จAccess to fetch at 'http://localhost:4000/uploads/' from origin 'http://localhost:3000' has been blocked by CORS policy
    : No 'Access-Control-Allow-Origin' header is present on the requested resource.
    If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.        
    ๐ต ๋ฐฑ์๋ - [main.ts]์์ 
       app.enableCors(); 
    

  3. ๐งReferrer Policy:strict-origin-when-cross-origin๐ง     
    

  */
 /*#๏ธโฃ22.5 Cache Optimization part One
  1. ๐ทrefetchQueries: 'query๋ฅผ ๋ค์ fetchํด์ฃผ๋ ๊ธฐ๋ฅ'
      - ์ฌ์ฉ๋ฒ: refetchQueries:[{query: โMY_RESTAURANT}]
      - ์ฌ์ฉ ์ด์ : โญ๋ ์คํ ๋์ ์์ฑ ํ ๋ค์ ๋์์ค๋ฉด '๋ ์คํ ๋์ด ์์ฑ ๋์ง ์์๊ฑฐ ์ฒ๋ผ ๋ณด์' 
      - ํ๋ก์ธ์ค: mutation์ด ์ ์ ์๋ํ, โกMY_RESTAURANT_QUERY refetch๋จ
      - cache์ ์ดํด: ์ฒ์๋ถํฐ localhost:3000/add-restaurant์ผ๋ก ์ด๋ > http://localhost:3000/  'My Restaurants' ํ์ด์ง๋ก ๊ฐ๋ฉด
                     My Restaurants์๋ cache๊ฐ ์๋ค   
       
  2.๐DOCS: Apollo Client allows you to make local(+cashe) modifications to your GraphQL data by updating the cache
    ๐นby updating the cache: โกrefetchQueries์์

  ๐ทconst client = useApolloClient();
        useEffect(() =>{
          const queryResult = client.readQuery({query: MY_RESTAURANTS_QUERY})
          console.log(queryResult) === โญApollo Dev Tools์ CACHE์ ์ผ์นํ๋์ง ํ์ธ
        },[])          
     
        {
          "myRestaurants": {
              "__typename": "MyRestaurantsOutput",
              "ok": true,
              "error": null,
          โ "restaurants": [
                  {
                      "__typename": "Restaurant",
                      "id": 63,
                      "name": "it'sRan",
                      "coverImage": "https://samsungnubereats.s3.ap-northeast-2.amazonaws.com/1671071676833SAM_0780.JPG",
                      "category": {
                          "__typename": "Category",
                          "name": "japanese food"
                      },
                      "address": "it'sRan",
                      "isPromoted": false
                  },
                  {
                      "__typename": "Restaurant",
                      "id": 62,
                      "name": "Guda42",
                      "coverImage": "https://samsungnubereats.s3.ap-northeast-2.amazonaws.com/1671071523779SAM_0810.JPG",
                      "category": {
                          "__typename": "Category",
                          "name": "japanese food"
                      },
                      "address": "Ginza",
                      "isPromoted": false
                  }
              ]
          }
        }
    โญ(๋น๊ต)refetchQueries๋ server์ ์์ฒญ ์ฆ API๋ฅผ ์ฌ์ฉํ์ฌ cash ์๋ฐ์ดํธ
    
 */
import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
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
      
      console.log(queryResult)

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