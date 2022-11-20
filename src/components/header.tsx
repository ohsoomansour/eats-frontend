import React from "react";
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useMe } from "../hooks/useMe";
import { Link } from "react-router-dom";

/*#️⃣15.17 Header part One
  1. 🔹1em = 16px
     🔹rem 
       html - font size 5px
       div  - font size 50px
              margin top 2rem = 10px(최상위 기준)
              margin bottom 2em = 100px(상위 요소 div 기준, 가장 가까이 정의된 폰트 크기를 가져옴) 
             
      예시) py = 16px  
  #15.18 Header part Two 
  2. font awesome 설치
   npm i --save @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons      
  
  3.🔹px-5 모바일 first❗ > xl:px-0 웹 second!
    
  */

 
export const Header: React.FC = () => {
  const {data} = useMe();

  return(
    <> 
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email</span>
        </div>
      )} 
      <header className=" py-4">
        <div className=" w-full max-w-screen-xl px-5 xl:px-0 mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={logo} className=" w-24 mb-5" alt="Nuber-eats" />
          </Link>
          <span className=" text-xs">{data?.me.email}</span>
          <Link to="/edit-profile">
            <FontAwesomeIcon icon={faUser} size="2x" className="highlight" />
          </Link>
        </div>
      </header>
    </>  
  );
};