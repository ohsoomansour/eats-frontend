import { Link } from "react-router-dom";
import styled from "styled-components";
const H2 = styled.h2`
    color:black;
    font-weight:20px;
    font-family:'Covered By Your Grace', cursive;
    margin-bottom:20px;
    background-color:white;
        
  `;
interface IRestaurantProps {
  id:number;
  coverImg:string;
  name: string;
  categoryName?: string;
}

export const Restaurant = ({id, coverImg, name, categoryName}:IRestaurantProps) => {

  return (
    <Link to={`/restaurants/${id}`}>
      <div className=" ml-4" >
        <div
          style={{ backgroundImage: `url(${coverImg})`}} 
          className="bg-cover bg-center py-28 mb-3 rounded-lg border-2 
         transform h-64 w-80 hover:scale-110 transition duration-500 cursor-pointer "
        ></div>
        <H2>
          <h3 className=" text-2xl text-center font-semibold">{name}</h3>
        </H2>  
        <span
          className="border-t border-gray-300 text-xs opacity-50"
        >                                                              
          {categoryName}                             
        </span>
      </div>
    </Link>  
  )
}

