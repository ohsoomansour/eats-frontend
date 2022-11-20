
/*#️⃣25.5Driver Dashboard part One 
  1. 설치: 📄https://www.npmjs.com/package/google-map-react
    > npm i google-map-react

  2. [bootstrapURLKeys]
   > console.cloud.google.com 
   > https://console.cloud.google.com/apis/library/browse?filter=category:maps&project=minthawaii
   > 🔷Billing account 설정 후 > 90일 무료 > ($200유료는 upgrade해야 함)
   > 🔷Maps JavaScript API > https://console.cloud.google.com/apis/credentials?project=coral-silicon-368505
   > 🔷사용 
   > 🔑사용자 인증 정보 > (상단) + 사용자 인증 정보 만들기 > API키 

   #️⃣25.6 Driver Dashboard part Two  
   1. 용어 정리
     🔹navigator: 브라우저의 정보
     🔹navigator.geolocation API: https, localhost에서는 사용이 가능 
       - HTML5 Geolocation API
       - 직접 웹에서도 위치 정보를 수집, 주기적으로 위치 정보를 수집하여 갱신 watchPosition()
     🔹lat = latitude(위도), 적도에서 북쪽으로 나아갈수록 위도선은 1도씩 증가
     🔹lng = longitude(경도)
     🔹coord: coordinates(좌표)
    
   2. 🔷Use Google Maps API
       🔹Google Maps API Loads on Demand: There is no need to place a <script src= tag at top of page.
         The Google Maps API loads upon the first usage of the GoogleMapReact component.
       🔹onGoogleApiLoaded: You can access to Google Maps map and maps objects by using onGoogleApiLoaded,
         in this case you will need to set yesIWantToUseGoogleMapApiInternals to true
       🔹onApiLoaded:  ({map, maps} ) => {}

       🔹 map: 당장 내가 가지고 있는 지도 정보, 화면에 있는 나의 지도
         > 📄https://developers.google.com/maps/documentation/javascript/reference#map
         > map은 Map의 인스턴스이다 
       🔹 maps: 내가 사용할 수 있는 Google Maps 객체  
         google map api sdk > 📄https://developers.google.com/maps/documentation/javascript/reference/map#Map.constructor
      🔷panTo(latLng) 
       🔹latLng: The new center latitude/longitude of the map 
       🔹내용:Changes the map center to the specified LatLng. 
             If the change is less than the width and height of the map, the transition is animated smoothly.  
      🔷구글 맵 안에 컴포넌트 만들기
        const Driver:React.FC<IDriverProps> = () => <div className=" text-lg">🚖</div>
        <GoogleMapReact>
          <Driver
            lat={driveCoords?.lat}
            lng={driveCoords?.lng}
          />
        </GoogleMapReact> 
          
         
  #️⃣25.7 Driver Dashboard part Three
    1. 📄github.com/google-map-react/google-map-react/blob/master/API.md  
       > Child Component API
    
    2.개발 도구창 > : > More tools > Sensors
     > ⭐map & maps 객체를 state에 저장해 줘야 한다 
     >
   #️⃣25.8 Address Geocoding
   1. TypeScript and Google Maps - 📄developers.google.com/maps/documentation/javascript/using-typescript
     > 설치: npm i -D @types/google.maps
     > 컴파일 > [tsconfig.json]
     > 
   2. Google Map을 웹 사이트에 로드하는 순간 > google.maps객체가 window에 있음

   3. 🚀New 주문 > driver에게 어디를 가야 할지 알려줌 > 🚀Subscription:  
    [Geocoding Service]
    📄developers.google.com/maps/documentation/javascript/examples/geocoding-simple
    [API 라이브러리]
    📄https://console.cloud.google.com/apis/library?project=glassy-azimuth-368507
    > geocoding api 검색 > enable (활성화) ✅API 사용 설정됨

    [Direction API]
    📄console.cloud.google.com/apis/library/directions-backend.googleapis.com
     > Google Maps API에서 사용했던 🔑동일한 API키를 사용 > Direction 사용
    📄 https://developers.google.com/maps/documentation/javascript/examples/directions-simple
    
    🚨확인 사항: 위치 변경 마다 setMap에 저장 되는지 ?  
      start_address: "대한민국 울산광역시 남구 옥동 산285-1"
      end_address: "대한민국 울산광역시 중구 병영2동 산21" 
    🚨 travelMode: google.maps.TravelMode.TRANSIT
     > Direction API가 대한민국에서는 TRANSIT만 지원: 📄https://developers.google.com/maps/coverage?hl=en
     > 'DRIVING'은 다른 나라 도시로 바꾸면 거의 다 지원 
     
      🔹컬러: https://flatuicolors.com/

  #️⃣25.10 Cooked Order Subscription  
    1. ❗Challenge: cookedOrders subscription data를 받으면 🚀주소지 --- > '예상 경로'에 표시
  #️⃣25.11 Final Test
    1. 준비: Customer(크롬) / Owner(Edge) / Delivery(firefox)


    */
import React, { useEffect, useState } from "react" 
import GoogleMapReact from 'google-map-react'
import { gql, useMutation, useSubscription } from "@apollo/client";
import { FULL_ORDER_FRAGMENT } from "../../fragment";
import { CookedOrdersSubscription, TakeOrderMutation, TakeOrderMutationVariables } from "../../__generated__/types";
import { Link, useHistory, useParams } from "react-router-dom";

const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription cookedOrders{
    cookedOrders{
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`
const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input:TakeOrderInput! ){
    takeOrder(input:$input){
      ok
      error
    }
  }
`


interface ICoords {
  lat:number;
  lng:number;
}
interface IDriverProps {
  lat:number;
  lng:number;
  $hover?:any;
}
const KaKaoMapApp = () => {
 

  return(
    <a  href="https://map.kakao.com/link/to/옥동">
      <h1 className=" text-lg font-semibold mt-10 " >카카오 맵</h1>
      <img
        className=" inline"
        src="https://developers.kakao.com/assets/img/about/buttons/navi/kakaonavi_btn_medium.png" 
        alt="길 안내하기 버튼">
      </img>
    </a>
  )
}


export const Dashboard = () => {

  const {data:cookedOrdersData} = useSubscription<CookedOrdersSubscription>(COOKED_ORDER_SUBSCRIPTION)
  const history = useHistory()
  const onCompleted = (data: TakeOrderMutation) => {
    if(data.takeOrder.ok){
      history.push(`/orders/${cookedOrdersData?.cookedOrders.id}`)
    }
  }
  const triggerMutation = (orderId: number  ) => {
    takeOrderMuataion({
      variables:{
        input:{
          id: orderId
        }
      }
    })
  }
  const [takeOrderMuataion ] = useMutation<TakeOrderMutation, TakeOrderMutationVariables>(TAKE_ORDER_MUTATION, {
    onCompleted
  })
  useEffect(() => {
    if(cookedOrdersData?.cookedOrders.id){
      makeRoute()
    }
  },[cookedOrdersData])
  const[driveCoords, setDriverCoords] = useState<ICoords>({lng:0, lat: 0})
  const [map, setMap] = useState<google.maps.Map>()
  const [maps, setMaps] = useState<any>();
  // @ts-ignore
  const onSuccess = ({coords:{latitude, longitude}}:Position) => {
    
    setDriverCoords({lat: latitude, lng: longitude})
  }
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error)

  }
  
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy:true
    })

  },[])



  useEffect(() => {
    if(map && maps){
      map.panTo(new google.maps.LatLng(driveCoords?.lat, driveCoords?.lng))
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        location: new google.maps.LatLng(driveCoords.lat, driveCoords.lng)
      },(results, status) => {
        //console.log(results, status)
      })
    }
  },[driveCoords?.lat, driveCoords?.lng])
  const onApiLoaded = ({map, maps}: {map:any, maps:any}) => {
    map.panTo(new maps.LatLng(driveCoords?.lat, driveCoords?.lng))
    setMap(map)
    setMaps(maps)
    
  };

  const makeRoute = () => {
    if(map){
      const directionsService = new google.maps.DirectionsService()
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions:{
          strokeColor:"#e84393",
          strokeOpacity:0.8,
          strokeWeight:10,

        }
      })
      directionsRenderer.setMap(map)
      directionsService.route({
        origin:{
          location:  new google.maps.LatLng(driveCoords.lat, driveCoords.lng)
        },
        destination:{
          location:  new google.maps.LatLng(driveCoords.lat + 0.02, driveCoords.lng + 0.02)
        },
        travelMode: google.maps.TravelMode.TRANSIT
      }, (result, status) => {
        directionsRenderer.setDirections(result)
      })
    }
  }
  
  return (
    
    <div >
             
      <div 
        className=" overflow-hidden"
        style={{ width: window.innerWidth , height: '50vh'  }} 
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{key: "AIzaSyD7943MbbZnoYpbMPA8Eor7XF9tG6di-2A"}}
          defaultCenter={{
            lat:35.5386376,
            lng:129.2887282
          }}
          defaultZoom={15}
        >
             
        </GoogleMapReact> 
      </div>
      <KaKaoMapApp />
      <div className=" max-w-screen-sm  mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
      {cookedOrdersData?.cookedOrders.restaurant ?(
       <> 
        <h1 className=" text-3xl text-center font-medium"> 
          New Cooked Order
        </h1>
        <h1 className=" text-center text-2xl my-3 font-medium ">
          Pick it up soon @{" "}
          {cookedOrdersData?.cookedOrders.restaurant.name}
        </h1>
        <button
          className=" btn w-full block text-center mt-5"
          onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
         >
          Accept Challenge &rarr; 
        </button>    
       </>) : (
          <h1 className=" text-center text-3xl font-medium">
            No orders yet...
          </h1>
       ) 
       
       }
      </div> 

      
      
    </div>
    
    
  )
}