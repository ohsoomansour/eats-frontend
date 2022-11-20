import { gql, InMemoryCache, useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { MyRestaurantsQuery, MyRestaurantsQueryVariables } from "../../__generated__/types";
import { Restaurant } from "../../components/restaurant";


/*#️⃣22.1 Create Restaurant part One
  1. 컨셉: 음식점을 upload 가능한 create restaurant 스크린으로 이동    
  */
/*#️⃣22.5 Cache Optimazation part One
  1. 📄apollographql.com/docs/react/caching/cache-interaction
    - Fetch the cashed myRestaurants item with id (any)
    - If your cache contains data for all of the query's fields,
      readQuery returns an object that matches the shape of the query:
    
     🔷client.readQuery({
      query: MY_RESTAURANT_QUERY,
      
    })
  2. 📄https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies#storing-local-state-in-reactive-variables
     📄 
    🔷client.writeQuery({
          query:MY_RESTAURANT_QUERY,
          data:{
            ⭐cache에 있던 새로운 data를 보내야 한다 === ...queryResult  = apollo Cache의 동일한 모습  
          }   
        })
     
      🔹[apollo | Cache]
          {
              __typename: "MyRestaurantsOutput"
              "ok":true,
              "error":null,
              "restaurants":[]
          }   

  3. 🚧cache가 정상 작동은 되나 apollo cache가 활성화 되지 않아 화면에 보이지 않음🚧
     ⚡캐시 작업이 처음 화면에는 보이지 않으나 npm run start 즉 재부팅 후 보이기 시작함 

    🔷Configuring the Apollo Client cache 
      🔹InMemoryCache: 
      🔹configuration options: 
      https://www.apollographql.com/docs/react/caching/overview/


    🔷캐시 데이터와의 상호작용: 📄https://www.apollographql.com/docs/react/caching/cache-interaction 
      
  */ 
export const MY_RESTAURANTS_QUERY = gql`
  query MyRestaurants{
    myRestaurants{
      ok
      error
      restaurants{
        ...RestaurantParts
        
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
 `
 // 
export const MyRestaurants = () => {
  const {data} = useQuery<
    MyRestaurantsQuery,
    MyRestaurantsQueryVariables
  >(MY_RESTAURANTS_QUERY)

  
  
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats </title>
      </Helmet>
     <div className=" container mt-32">
      <h2 className=" text-4xl font-medium mb-10">My Restaurants</h2>
      {data?.myRestaurants.ok &&
       data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className=" text-xl mb-5">You have no restaurants.</h4>
            <Link
              className=" link"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>  
        ) : (
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id}
                coverImg={restaurant.coverImage} 
                name={restaurant.name}
              />
            ))}
          </div>
        )}
     </div>

    </div>
    
  )
}
