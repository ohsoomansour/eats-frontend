import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom"
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { CategoryQuery, CategoryQueryVariables } from "../../__generated__/types";
/*#️⃣19.6 Category
  1. useEffect === componentDidMount메소드를 구현 
    1-1) 두 번째 인수 값이 없으면 --- 최초 렌더링시에만 실행
    1-2) dependency에 따라 렌더링 
    1-3) ⭐cleanup 함수 === componentWillUnmount 역할 
      예시)
    
    🔹componentDidMount 메소드: 컴포넌트를 처음 렌더링한 후에 실행, 최초로 렌더링 되는 시점에만 단 한번 실행 
      - props, state가 바뀌는 시점 / 부모 컴포넌트가 리렌더링 / forceUpdate 함수 발생
    🔹componentDidUpdate: props, state가 바뀌는 시점 / 부모 컴포넌트가 리렌더링 / forceUpdate 함수 
    🔹componentWillUnmount 메소드: 리액트 컴포넌트가 DOM에서 제거될 때 실행
      - 블로그 참조: 📄https://junhyunny.github.io/javascript/react/jest/how-to-test-clean-up/
      - componentDidMount 메소드에서 등록한 이벤트가 있다면 여기서 제거하는 작업을 수행
        > state, props가 바뀌면(⚡이벤트 발생) --- 기존 컴포넌트 unmonut, 새 컴포넌트 mount 
        > unmount시 > return cleanup함수가 콜이 됨 
        
    [에시]  
      useEffect(() => {
        console.log(location)
        return () => {
          console.log("clean clean")✅ 그 라우터에서 다른 곳으로 이동=== Category컴포넌트 unmount  
        }
      }, [])

   2. 🚧 Query 요청 후 🔴restaurants, totalResults "null"
      @ManyToOne(type => Category, category => category.restaurants, {eager: true }) 
      - 이해: Category의 id를 갖는다 + Restaurant 엔티티 쪽이 owner다 
        
      [restaurant.resolver.ts]
        @Query(type => CategoryOutput)
        category(
          @Args('input') categoryInput: CategoryInput 
        ): Promise<CategoryOutput> {
          return this.restaurantService.findCategoryByslug(categoryInput)
        }
    🚨[restaurant.service.ts]
       🔵 async findCategoryBySlug의 return 
    
      [category 엔티티]
       - slug:american-food
       - name:americanfood🔴  --- ⚡수정 ---   
         UPDATE category SET "name" = 'american food' WHERE id = 5 


     🚧🔴DB: restaurant 테이블에 category 3,4 "null"
        🔵UPDATE restaurant SET "categoryId" = '3' WHERE id = 32 
        🔵SQL로 수동으로 기입하여 사후 처리해도 잘 작동한다 


    style={{ backgroundImage: `url(${category.coverImage})`}}    
 */
const CATEGORY_QUERY = gql`
  query category($input:CategoryInput!){
    category(input:$input){
      ok
      error
      totalPages
      totalResults
      restaurants{
        ...RestaurantParts
      }
      category{
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  
`


interface ICategoryParams{
  slug: string;
}


export const Category = () => {
  const params = useParams<ICategoryParams>()
  console.log(params)
  const {data, loading} = useQuery<
    CategoryQuery,
    CategoryQueryVariables
  >(CATEGORY_QUERY,
    {
      variables:{
        input:{
          page:1,
          slug: params.slug
        }
      }
    })
  //console.log(data)
  return (
    <div className=" max-w-screen-xl mx-auto mt-10">
      <div className=" grid md:grid-cols-3 gap-x-3 gap-y-3">
        {!loading && (data?.category.restaurants?.map(restaurant => ( 
          <div key={restaurant.id}>
            <h2 className=" text-lg font-semibold text-gray-600 text-center">{restaurant.name}</h2>  
            <div 
              className=" bg-gray-500 py-40 bg-cover text-center" 
              style={{ backgroundImage: `url(${restaurant.coverImage})`}}
            >
            </div>
            <h3 className=" text-xl text-red-400 font-semibold text-center">{restaurant.address} 찾아와</h3>
          </div>  
          ))
        )}
      </div>
    </div>
  )
}