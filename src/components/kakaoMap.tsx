
 /*#️⃣ 카카오 맵 사용
1. 설치 및 config 
 > 📄javascript: https://apis.map.kakao.com/web/guide/
    - osmchairman@hanmail.net / 개발자 이름: 오수만
    - JavaScript 키: 3ae98396a10cebe4972d396ad18e52bb  
 > 📄리액트: https://github.com/JaeSeoKim/react-kakao-maps-sdk
     
 2. tsconfig.json & compilerOptions.types 
    📄https://www.typescriptlang.org/tsconfig#typeRoots
	 - TS 2.0 부터는 types나 typeRoot를 설정해주지 않아도 기본적으로 자동으로 모두 읽어와서 활용
	   > 즉, node_modules/@types 내의 모든 경로를 찾아와서 사용
	 - .d.ts파일은 type을 정의(declare)하기 위해서 존재하는 파일
     📄https://github.com/JaeSeoKim/kakao.maps.d.ts
		  > npm install kakao.maps.d.ts --save-dev
			> [package.json]
			  "dependencies": {
					"kakao.maps.d.ts": "^0.1.33"
				},

   🚧 외부 cdn 스크립트 사용법 🚧
     🔹onload 이벤트: 웹 페이지 내 모든 콘텐츠(이미지, 스크립트 파일, css파일 등)을 완전히 로드 후  
                      스크립트 실행을 위해 주로 <body>안에서 사용
                      지원 HTML 태그 요소 <body> <img> <input type="image"> <link> <script> <style> ..
       예제) <img src="이미지 출처.com" onload=" minoi() ">
             <script>
                funtion minoi(){
                  alert("이미지 로드 완료")
                }
             </script>         

     🔹onerror 이벤트: "이미지 로드 실패시 함수 실행 "
       예제) <img src="logo.png" onerror="fail()">
            <script>
                function fail(){
                  alert('이미지 로드 실패')
                }
            </script>    
     🔹setAttribute: element 속성의 값을 바꾼다 
      <a href = "#"> Code Test </a>    
      document.getElementById('abc').setAttribute('href', 'https://www.success.co.kr')
     
    🔹appendChild: 오로지 Node 객체만 받을 수 있다 + 오직 하나의 노드만 추가
      예시) const parent = document.createElement('div')
            const child = document.createElement('p')
            parent.appendChild(child)
            ⚡<div><p></p></div>
  3. 튜토리얼 📄https://react-kakao-maps-sdk.jaeseokim.dev/docs/sample/map/basicMap
              📄https://velog.io/@nemo/kakao-api-map-search-app   
  
  4. ⭐context api 이해하기 
    - 블로그: 📄https://kyounghwan01.github.io/blog/React/react-context-api/#%E1%84%8B%E1%85%A8%E1%84%89%E1%85%B5
    - 개념: context는 컴포넌트안에서 전역적으로 데이터를 공유하도록 나온 개념
       export const MyStore = React.createContext("defaultValue");              
       const [value, setValue] = useState("3")
       export const Test = () => {

        return (
          <MyStore.Provider value={value}>
            <MyStore.Consumer>
              {value => value.toString()}
            </MyStore.Consumer>
          </MyStore.Provider>
        )
      }
    🔹namespace: 클래스, 인터페이스, 함수, 변수 등을 논리적으로 묶는데 사용
    🔹<T> : 제네릭 타입, any 라고 보면 됨
    🔹<P> : Partial 타입은 제네릭 T에 대해서 모든 프로퍼티들을 Optional하고 변경
           📄https://blog.martinwork.co.kr/typescript/2019/05/28/typescript-util-types.html
    🔹Union Type: 자바스크립트의  OR 연산자( || )와 같은 것
    🔹클래스 접근 제한자(public/protected/private): 📄https://poiemaweb.com/typescript-class

  5. 📄https://apis.map.kakao.com/web/guide/#routeurl
    > 길찾기 바로가기: URL Pattern 
    > 도착 지점 찾기 
     const history = useHistory()
     
    const onSubmit = () => {
      const { keyword } = getValues()
      history.push (`https://map.kakao.com/link/to/${keyword},${state.center.lat},${state.center.lng}`)
    }

    const {register, handleSubmit } = useForm()
    <form onSubmit={handleSubmit()}>
      <input
        {...register('keyword')}
       />

    </form>
  6. 정리 
   - 실외: react native 
    🚨 카카오 네비는 22.3.28 서비스가 종료 
     
 */


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Map, MapMarker } from "react-kakao-maps-sdk"
import { Link, useHistory } from "react-router-dom";




 export const TestMap = () => {


  const [state, setState] = useState({
    center:{lat:35.5386376, lng: 129.2887282 },
    isPanto: false,
  });
  return (
  <div>
    
    <Map
      
      center={state.center}
      isPanto={state.isPanto}
      style={{ width: "100%", height: "450px" }}
      level={3}
      
    >
      
      <div
        style={{
          display:"flex",
          gap:"10px"
        }}
      > 
        <button
          onClick={() => 
            setState({   
              center:{lat:35.5386376, lng: 129.2887282 },
              isPanto:false,
            })
          }
        >
          지도 중심좌표 이동 
        </button>
        <button
          onClick={() =>
            setState({
              center:{lat:35.6, lng: 129.30 },
              isPanto:true
            })
          }
        >
          지도 중심좌표 부드럽게 이동
        </button>
      </div>
      <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
        <div style={{color:"#000"}}>Hello World!</div>
      </MapMarker>
      
    </Map>
    <div>
            
    </div>
  </div>  
  )
}

