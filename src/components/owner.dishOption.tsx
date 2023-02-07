import React from "react";

interface IOwnerDishOptionProps{
  name:string;
  extra?:number | null;
  
}

export const OwnerDishOptions:React.FC<IOwnerDishOptionProps> = ({
  name,
  extra,
  

}) => {




  return (
    <span >
      
      <div>
        <span className=" mr-2 text-sm text-slate-800 ">▫️{name}</span>
        <span className=" text-sm opacity-75">${extra}</span>
      </div>
    </span>    
  )
}