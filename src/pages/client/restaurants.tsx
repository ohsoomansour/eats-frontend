import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Categorys } from "../../components/categorys";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { RestaurantsPageQuery, RestaurantsPageQueryVariables } from "../../__generated__/types";
/*#️⃣19.1 Category Style
  1. 🚧coverImgage 주소 넣는 법
    📄우버이츠 이미지: https://www.ubereats.com/city/los-angeles-ca?pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMmNvZmZlZSVFQyVCRCVBOSUyMiUyQyUyMnJlZmVyZW5jZSUyMiUzQSUyMjcwOTk5ODMwMSUyMiUyQyUyMnJlZmVyZW5jZVR5cGUlMjIlM0ElMjJ0bWFwX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBMzUuNDg4MzcxNjklMkMlMjJsb25naXR1ZGUlMjIlM0ExMjkuMjEzNDYzNTglN0Q%3D  
     <👨‍🍳owner 프로필>
     🔹email:"ceoosm@gmail.com",
     🔹password:"284823",
     🔹role:Owner
     🔹"x-jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTY2NjUzMjg4M30.4jvBMzAP-p9Cqpgp2KDdtWCaZwPImhHgDzCxtTw-71M"
    1-1)createRestaurant & editRestaurant
        - id: 32
        - name: "JangChen"
        - coverImage: https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Asian_CuisineCarousel@2x.png
        - address: "Haul-Bin"
        - categoryName:"AsianFood"
    1-2) postgreSQL UPDATE
     🔹UPDATE [테이블명] SET [열]= '변경할값' WHERE [열] is not null ✅ ---(조건)      
     🔹UPDATE category SET "coverImage" = 1  WHERE id = 1
     🔹UPDATE category SET "coverImage" = 'https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Asian_CuisineCarousel@2x.png' WHERE id = 2
        
  */
 /*#️⃣19.2 Restaurants List
    1. 🔹Optional Chaining: data?.restaurants.results?  
     - 해석1: "TypeScript가 data가 있으면 🚀.restaurants 연결 or 없으면 에러 발생하지 않음 "
     - 해석2: "우리가 API 로부터 type을 생성 --> Typescirpt는 이 type을 바탕으로 optional chaining을 생성" 
    2.🚧category null🚧  
     🔵백엔드에서 Category를 eager - #️⃣12.10 orderUpdates part One
      📃github.com/typeorm/typeorm/blob/master/docs/eager-and-lazy-relations.md
      - 의미: eager relations은 db에서 entity를 load할 때마다 자동으로 load되는 relationship을 말한다
      - 해결: [restaurant.entity.ts]
        @Field(type => Category,{ nullable: true})
        @ManyToOne(
          type => Category,
          category => category.restaurants,
          {nullable: true, onDelete: 'SET NULL', eager: true}✅
        )
        category: Category;✅
    */
  /*#️⃣19.4 Search part One
     1. Deep 하게 형식 정의를 보쟈 
        const history = useHistory();
        const onSearchSubmit = () => {
          history.✅push({
            ⭐ --- (push는 location과 state 인수를 갖는다 ) --- ⭐
          })
        }
      [push정의 해석] 
        1-1) push(location: Path | ✅LocationDescriptor<HistoryLocationState>  
            
        1-2)export interface LocationDescriptorObject {
              pathname?: Pathname | undefined;✅ 
              search?: Search | undefined;✅ 예시 ?search = hamberger
              state?: S | undefined;
              hash?: Hash | undefined;
              key?: LocationKey | undefined;
            }
        1-3) ✅export type Search = History.Search;   

    2. history.push({
      pathname:"/search",
      state:{
        searchTerm  ⭐--- URL로 데이터를 포함 시키지 않고 데이터를 보냄, 새로고침 후에도 브라우저가 state를 기억 ---⭐
      }
    })              
  */
  /*#️⃣19.5 Search part Two - " 원하는 조건이 되면 "
    1. lazy query  
       
     
  */        

export const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!){
    allCategories {
      ok
      error
      categories{
        ...CategoryParts
      }
    },
    restaurants(input: $input){
      ok
      error
      totalPages
      totalResults
      results{
        ...RestaurantParts   
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1)
  const {data, loading} = useQuery<
      RestaurantsPageQuery, RestaurantsPageQueryVariables
      >(RESTAURANTS_QUERY, {
        variables:{
          input:{
            page
          }
        }
      })
    console.log(data)
    
  const onNextPageClick = () => setPage(current => current + 1 )  
  const onPrevPageClick = () => setPage(current => current - 1 )
  const {register, handleSubmit, getValues} = useForm<IFormProps>() 
  const history = useHistory()
  const onSearchSubmit = () => {
    //console.log(getValues())
    const { searchTerm } = getValues()
    history.push({
      pathname:"/search",
      search: `?term=${searchTerm}`
      
    })
  }
  
  return (
    <div  >
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)} 
        className=" bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          {...register("searchTerm", {required: true })} 
          type="Search" 
          placeholder="Search restaurants..." 
          className=" input rounded-md border-0 w-3/4 md:w-3/12"
        />
      </form>
      {!loading && (
        <div className=" max-w-screen-2xl pb-20 mx-auto mt-8">
          
          <Categorys />
          <div className=" grid md:grid-cols-3 mt-10 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id} 
                coverImg={restaurant.coverImage}
                name={restaurant.name}
                categoryName={restaurant.category?.name} 
              />
            ))}
          </div>
          <div className=" grid grid-cols-3 text-center max-w-xs items-center mx-auto">
            {page > 1 ? (<button
              onClick={onPrevPageClick}
              className=" focus:outline-none font-bold text-3xl">
              &larr;
            </button>
          ) : (
            <div></div>  
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className=" focus:outline-none font-bold text-3xl">
                &rarr;
              </button>
            ) : (
              <div></div>  
            )}
          </div>
        </div>
        )}
    </div>
    
  )
}

