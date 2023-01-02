
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
            <FontAwesomeIcon 
              icon={faUser}
              color="black" 
              size="2x" 
              className=" fill-cyan-500 hover:fill-slate-500" 
            /> 
  */
import React from "react";
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useMe } from "../hooks/useMe";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Svg = styled.svg`
  fill:#130f40;
  transition: fill 0.3s ease-in-out;
  &:hover {
    fill: #30336b;
  }
`;

 
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
          <span className=" text-lg font-semibold">{data?.me.email}</span>
          <Link to="/edit-profile">
            
          <Svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512"
            height="40px"
            width="40px"
          
          >
            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
          </Svg>

          </Link>
        </div>
      </header>
    </>  
  );
};