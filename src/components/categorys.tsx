import { gql, useQuery } from "@apollo/client"
import { Link } from "react-router-dom"
import { RESTAURANTS_QUERY } from "../pages/client/restaurants"
import { RestaurantsPageQuery, RestaurantsPageQueryVariables } from "../__generated__/types"



export const Categorys = () => {
  const {data} = useQuery<
  RestaurantsPageQuery, RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables:{
      input:{
        page:1
      }
    }
  })

  return (
    <div className=" flex justify-around max-w-s cursor-pointer">
      
      {data?.allCategories.categories?.map((category, index) => (
        <Link to={`/category/${category.slug}`}>
          <div  className=" flex flex-col group items-center cursor-pointer ">
            <div
              key={category.id}
              className=" w-16 h-16 rounded-full group-hover:bg-gray-100 bg-cover"
              style={{ backgroundImage: `url(${category.coverImage})`}}
              ></div>
              <span className=" mt-1 text-sm text-center font-semibold">{category.name.toUpperCase()}</span>
          </div>
        </Link>    
      ))}
      
    </div>
  )
}