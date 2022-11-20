import { Link } from "react-router-dom";

interface IRestaurantProps {
  id:number;
  coverImg:string;
  name: string;
  categoryName?: string;
}

export const Restaurant = ({id, coverImg, name, categoryName}:IRestaurantProps) => {

  return (
    <Link to={`/restaurants/${id}`}>
      <div >
        <div
          style={{ backgroundImage: `url(${coverImg})`}} 
          className="bg-cover bg-center py-28 mb-3"
        ></div>
        <h3 className=" text-xl font-semibold">{name}</h3>
        <span
          className="border-t border-gray-300 text-xs opacity-50"
        >                                                              
          {categoryName}                             
        </span>
      </div>
    </Link>  
  )
}