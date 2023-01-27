import { ChildProps } from "postcss";
import React, { ReactNode } from "react";

/*#️⃣24.0 Extending the Dish Component
  1. null과 undefined의 차이
    - null: null은 원시값(Primitive Type)중 하나 , 어떤 값이 의도적으로 비어있음을 표현
            null의 경우에는 해당 변수가 어떤 객체도 가리키지 않는다는 의미
      예) name: Pickle, extra: "" 
    - undefined: 값이 지정되지 않는 경우를 의미
      예) name: Spicy, (extra 지정 x)

  #️⃣24.4 Making Order part Four
    1.🚧 children 문제 🚧
     📄https://www.howdy-mj.me/react/react-node-and-jsx-element     
     📄https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement 
      - ReactNode vs ReactElement:  
      1.Funtonal Components는 ⭐ReactElement | null을 반환하고 string, ReactElements array는 반환 하지 못 해서 주의를 해야 하고
      2. 넓은 범위의 type으로 반환하려면 ⭐ReactNode를 쓰면 text, number, boolean, null, undefined, ReactElement, 
      ReactNodes의 array등 으로 React는 렌더가 가능

      3.피드백:그리고 리액트에서는 함수형 클래스형 이렇게 정의한적없습니다
        그냥 함수컴포넌트 클래스컴포넌트라고 부르는게 맞습니당  
      🚨 {children?: ReactNode} type defeinition


*/
interface IDishProps{
  description:string;
  id?:number;
  name:string;
  price:number;
  isCustomer?:boolean;
  orderStarted?: boolean;
  options?:Array<{ __typename?: 'DishOption', name: string, extra?: number | null,
    choices?: Array<{ __typename?: 'DishChoice', name: string, extra?: number | null }> | null }>;
  addItemToOrder?: (dishId:number) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
  children?:ReactNode
}

export const Dish:React.FC<IDishProps> = ({
  //owner입장
  description,
  id = 0,
  name,
  price,
  //customer입장
  isCustomer = false, 
  orderStarted = false,
  options,
  addItemToOrder,
  isSelected,
  removeFromOrder,
  children: dishOptions ,
}) => {

const onClick = () => {
  if(orderStarted){
    if(!isSelected && addItemToOrder){
      return addItemToOrder(id)
    }
    if(isSelected && removeFromOrder){
      return removeFromOrder(id)
    }
  }
}

  return (
    <div 
      className={` px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className=" mb-5">
        <h3 className=" text-lg font-medium flex items-center">
          {name} {" "} 
          {orderStarted && (
            <button
              className={`ml-3 py-1 focus:outline-none text-sm text-white ${
                isSelected ? "bg-red-500" : "bg-lime-600"
              }`} 
              onClick={onClick}>
                {isSelected ? "Remove" : "Add"}
            </button>
          )}          
        </h3>
        <h4 className=" font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-bold">Dish Options:</h5>
          <div className=" grid gap-2 justify-start">{dishOptions} </div>
        </div>
      )}
    </div>
  )
}