import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react"
import { Helmet } from "react-helmet";
import { useHistory, useLocation, useParams } from "react-router-dom"
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../__generated__/types";
/*#️⃣19.5 Search part Two
  1.  Lazy Query는 즉시 실행하지 않는 Query이다 === "사용자가 버튼을 누를 때 실행 하고 싶을 경우"
      ⚡useLazyQuery()  "query가 없으면 call되지 않는다 "
    
    🔹Tuple = Array
    🔹(QueryTuple) ---> LazyQueryResultTuple
    🔹replace를 사용하면 인수의 URL로 대체
  2. ⭐fragment
    export const RESTAURANT_FRAGMENT = gql`
    ✅fragment RestaurantParts on Restaurant {
        id
        name
        coverImage
        category{
          name
        }
        address
        isPromoted
      }
    `
    [fragment 적용]  
    const SEARCH_RESTAURANT = gql`
      query searchRestaurant($input: SearchRestaurantInput!){
        searchRestaurant(input:$input){

          restaurants{
            ...RestaurantParts✅
          }
        }
      }
      ${RESTAURANT_FRAGMENT}✅
    `
*/
/*#️⃣19.7 Code Challenge
   1. 카테고리 > restaurants ⭕
   2. search > 검색된 음식점들 
    2-1)[logged-in-router.tsx]
        <Route key={5} path="/category/:slug✅" >
          <Category />
        </Route>,

        const params = useParams()  --- ⚡{slug: 'mexican-food'} 
        


    2-2)[restaurants.tsx]
        history.push({
          pathname:"/search",
          search: `?term=${searchTerm}`   ---  ⚡http://localhost:3000/search?term=korean
          
        })
        
        🔹방법1:const [_, query] = location.search.split("?term=") 
        
        🔹방법2const location = useLocation()  --- ⚡{pathname: '/search', search: '?term=korean', hash: '', key: 'hacfgs'}
          const query = new URLSearchParams(location.search).get('term')
        🔹참조: 백엔드 -> #️⃣11.17 Restaurant and Search ~ #️⃣11.18       
*/
/*#️⃣용어 정리
    1. 벡틱(``)의 사용
      🔹줄바꿈: "줄바꿈을 그대로 인식"
        var vectic = `
          Hi
            its'me 
        `
        console.log(vectic) 
      🔹표현식의 삽입(Express interpolation): 변수나 연산 등을 삽입 
        var name = 'SM'
        제 이름은 `${name}` 입니다.   
    2. URL VS URI
      🚀http://www.google.co.kr:80/hakawati/uri.php?url=urn
      - http: 프로토콜                      - +
      - www: 서브 도메인                      |
      - google: Domain
      - co: Country Code Top Level Domain    | -- ⭐URL 
      - kr: TLD 
      - :80 port                             |            ------+
      - hakawati: path "해당 자원의 위치"   - +                  |
                                                                | --- ⭐URI   
      - uri: page                                               |   
      - .php: extension                                   ------+
      - ?uri=urn: Parameter    

*/
const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!){
    searchRestaurant(input:$input){
      ok
      error
      totalPages
      totalResults
      restaurants{
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`


export const Search = () => {
  const history = useHistory()
  const location = useLocation() 
  
  const query = new URLSearchParams(location.search).get('term')
  
  const [queryReadyToStart, {loading, data, called}] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT )

  useEffect(() => {

    if(!query){
      history.push("/")
    }
    queryReadyToStart({
      variables:{
        input:{
          page:1,
          query: query + ""
        }
      }
    })

  },[])
  
  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <div className=" grid md:grid-cols-3 gap-x-3 gap-y-3">
        {!loading && (data?.searchRestaurant.restaurants?.map(restaurant => (
          <div key={restaurant.id}  >
            <h3>{restaurant.name}</h3>
            <div
              className=" bg-gray-500 py-40 bg-cover text-center"
              style={{ backgroundImage: `url(${restaurant.coverImage})`}}
            ></div>
          </div>
        )))}
      </div>
    </div>
  )
}