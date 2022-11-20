/*#️⃣15.6 Login Mutation part One
🔹FC = Funtional Component
🔹interface 이해: {errorMessage?: string}을 외부에서 함수 내로 props로 전달 하는데 그 type은 string이다 
  - interface 이름은 'IFormErrorProps'이다 
*/ 
import React from "react"

interface IFormErrorProps {
  errorMessage?: string;
}
export const FormError: React.FC<IFormErrorProps> =  ({errorMessage}) => (
  <span className=" font-medium text-red-400">
    {errorMessage}
  </span>
)
