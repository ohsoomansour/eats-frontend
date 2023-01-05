/*#️⃣22.1 Create Restaurant part One
  1. 컨셉: 음식점을 upload 가능한 create restaurant 스크린으로 이동    
  */
/*#️⃣22.5 Cache Optimazation part One
  1. 1단계🔷readQuery(캐시읽기전용):📄apollographql.com/docs/react/caching/cache-interaction
      🔹개념1: The readQuery method enables you to execute a GraphQL query directly on your cache 
               > 해석: "캐시에서 GraphQL쿼리를 바로 가져 온다는 의미"  ⚡GraphQL쿼리 --(직접 가져옴)--> ⭐cashe 
               
               > 예시: Fetch the cached to-do item with ID5
                 const { todo } = client.readQuery({
                  query: READ_TODO,
                  ✅ Provide any required variables in this object.
                  ✅ Variables of mismatched types will return `null`.
                  variables: {
                    id: 5,
                  },
                  }); 

               
      🔷const client = useApolloClient();
        useEffect(() =>{
          const queryResult = client.readQuery({query: MY_RESTAURANTS_QUERY})
          console.log(queryResult)
        },[])          
     
        {
          "myRestaurants": {
              "__typename": "MyRestaurantsOutput",
              "ok": true,
              "error": null,
          ✅ "restaurants": [
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
    ⭐(비교)refetchQueries는 server에 요청 즉 API를 사용하여 cash 업데이트  
     
  2. 2단계: ✅위의 restaurants 객체를 write하겠다는 의미 
    📄https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies#storing-local-state-in-reactive-variables 
    🔷client.writeQuery({
          query:MY_RESTAURANT_QUERY,
          data:{
            
          }   
        })
     
      🔹data는 [Apollo Dev Tools - Cache]
          {
              __typename: "MyRestaurantsOutput"
              "ok":true,
              "error":null,
              "restaurants":[]
          }
       {

          

  3. 🚧cache가 정상 작동은 되나 apollo cache가 활성화 되지 않아 화면에 보이지 않음🚧
     ⚡캐시 작업이 처음 화면에는 보이지 않으나 npm run start 즉 재부팅 후 보이기 시작함 

    🔷Configuring the Apollo Client cache 
      🔹InMemoryCache: 
      🔹configuration options: 
      https://www.apollographql.com/docs/react/caching/overview/


    🔷캐시 데이터와의 상호작용: 📄https://www.apollographql.com/docs/react/caching/cache-interaction 

  4. Cache와 직접적으로 상호작용하는 방법:(API를 건드리지 않고!) Restaurant 생성 그 자체를 fake 
      
  */ 
import { gql,  useApolloClient,  useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { MyRestaurantsQuery } from "../../__generated__/types";
import { Restaurant } from "../../components/restaurant";
import styled from "styled-components";
import { useEffect } from "react";

const H = styled.h2`
  color:black;
  font-size:40px;
  font-weight:20px;
  font-family:'Covered By Your Grace', cursive;
  margin-bottom:20px;
  background-color:white;
      
`;

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
 
export const MyRestaurants = () => {
  const {data} = useQuery<
    MyRestaurantsQuery
  >(MY_RESTAURANTS_QUERY)
  //console.log(data)
  //MyRestaurants 컴포넌트가 렌더링 될 때 useEffect가 한 번 실행이 된다 
  const client = useApolloClient()
  useEffect(() => {
    const queryResults = client.readQuery({query:MY_RESTAURANTS_QUERY})
    console.log(queryResults)
  }, [])

  //
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats </title>
      </Helmet>
     <div className=" container mt-32">
      <H className=" text-3xl font-medium mb-10 bg-white shadow-lg ">
        My Restaurants
      </H>
      
 
      
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
        <>  
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
          <Link to={`/add-restaurant`} className=" inline-block ">
            <svg 
              className="  transform h-64 w-80 hover:scale-110 transition duration-500 cursor-pointer" 
              xmlns="http://www.w3.org/2000/svg" 
              width="390px" 
              height="200px"  
              viewBox="-430 -400 1200 1200"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
            </svg>
          </Link>
        </>  
        )}
     </div>

    </div>
    
  )
}
