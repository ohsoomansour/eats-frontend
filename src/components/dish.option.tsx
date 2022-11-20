import React from "react";

interface IDishOptionProps{
  isSelected:boolean;
  name:string;
  extra?:number | null;
  addOptionToItem: (dishId:number, optionName:string) => void;
  removeOptionFromItem: (dishId: number, optionName:string) => void;
  dishId:number;
}

export const DishOption:React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  dishId,
  removeOptionFromItem,
  addOptionToItem

}) => {


const  onClick = () => {
  if(isSelected){
    removeOptionFromItem(dishId, name); //⭐항상 옵션 제거가 우선순위 > 옵션 첨가 
  } else {
    addOptionToItem(dishId, name)
  }
}

  return (
    <span
    onClick={onClick} 
    className={ `border px-2 py-1 ${
      isSelected
        ? "border-gray-800"
        : "hover:border-gray-800"
    }`} 

  >
    <span className=" mr-2">{name}</span>
    {extra && <span className=" text-sm opacity-75">(${extra})</span>}
  </span>    
  )
}