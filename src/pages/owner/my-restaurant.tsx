/*#️⃣22.7 Restaurant Dashboar part one
  1. 컨셉: 메뉴를 업로드 + Pay
  #️⃣22.13 Victory Charts part One
  1.설치: 📄https://formidable.com/open-source/victory/ > npm install victory
  2. #12.11 Create Order part Six 참고해서 
     createOrder 만들기 
     🚨[order.service.ts]에서 에러 확인 
        "Could not create Order"
  🔴TypeError: Cannot read properties of undefined (reading 'find')
    at OrderService.CreateOrder (C:\Users\오수만\Desktop\uberEats\nuber-eats-backend\src\orders\order.service.ts:111:63)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at target (C:\Users\오수만\Desktop\uberEats\nuber-eats-backend\node_modules\@nestjs\core\helpers\external-context-creator.js:77:28)       
    at Object.createOrder (C:\Users\오수만\Desktop\uberEats\nuber-eats-backend\node_modules\@nestjs\core\helpers\external-proxy.js:9:  
  
  🔴[graphql] 
    options:[{name:"Spicy"},{name:"Pickle"}]
     > Spicy pickle로 해야 적용이 된다
     > 대/소문자 구분 제대로 안하면 total계산이 안되어서 undefined property가 나옴 
  🔵'대문자' > '소문자'로 변경 필요  + restaurant에 따른 menu 대,소문자 구분 확인❗
    - 이유:
    - editDish로 편집   

    🔹DELETE FROM antisnow.board WHERE no > 30000 AND no < 80000

  #️⃣22.15 Victory Charts part Three
    1. 🔹VictoryVoronoiContainer: 📄https://formidable.com/open-source/victory/docs/victory-voronoi-container
       🔹Sin: 30도 = 1/2, 45도 =  루트2 / 2 , 루트3 /2
       🔹new Date('2022-11-06T02:29:52.720Z').toLocaleDateString("ko") > '2022. 11. 6.'
       🔹new Date('2022-11-06T02:29:52.720Z').toDateString() > 'Sun Nov 06 2022'
  #️⃣23.0 Introduction - 
    🚨실제 사업 준비가 되어있으면 와야되는 강의 & domain 검증 반드시 거치기 때문에 (일단skip) 
    1. Buisiness Email Address: ceoosm@naver.com
    2. password: Tkfkdgo23
    3. ⭐step1. Domain approval 도메인이 필요함 > step2. Verification check
    */

import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { MyRestaurantQuery, MyRestaurantQueryVariables, PendingOrdersSubscription, PendingOrdersSubscriptionVariables } from "../../__generated__/types";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryPie, VictoryVoronoiContainer, VictoryLine, VictoryTheme, VictoryLabel, VictoryTooltip } from 'victory';
import { TestMap } from "../../components/kakaoMap";
import { Map, MapMarker } from "react-kakao-maps-sdk";


export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input:MyRestaurantInput!){
    myRestaurant(input:$input){
      ok
      error
      
      restaurant{
        ...RestaurantParts
        menu{
          ...DishParts
        }
        orders{
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`
const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders{
    pendingOrders{
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`


interface IPrams {
  id: string;
}

//useQuery는 Myrestaurant이 렌더링 되면 바로 execute vs useMuatation에  mutation function을 호출 해줘야 한다
export const Myrestaurant = () => {
  const { id } = useParams<IPrams>()
  const {data} = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(
    MY_RESTAURANT_QUERY, {
      variables:{
        input:{
          id: +id 
        }
      }
    })
  const {data: subscriptionData} = useSubscription<PendingOrdersSubscription>(
    PENDING_ORDERS_SUBSCRIPTION)
    
    //console.log(subscriptionData)
    const history = useHistory()
    useEffect(() => {
      if(subscriptionData?.pendingOrders.id){
        history.push(`/orders/${subscriptionData.pendingOrders.id}`);
      }
    },[subscriptionData]) 
  return (
    <div>
      <div className=" bg-gray-700 py-28 bg-center bg-cover"
           style={{
            backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
           }}
      ></div>
      <div className=" container mt-10">
        <h2 className=" text-4xl font-medium mb-10">
           {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link to={`/restaurants/${id}/add-dish`} className=" mr-8 text-white bg-gray-800 py-3 px-10"
         >
          Add Dish&rarr;
        </Link>
        <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className=" mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className=" text-xl mb-5">Please upload a dish</h4>
          ) : (
            <div className=" grid md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish,index) => (
                <Dish
                  key={index} 
                  description={dish.description} 
                  id={dish.id} 
                  name={dish.name} 
                  price={dish.price}                  
                />
              ))}
            </div>
          )}
        </div>
        <div className=" mt-20 mb-10">
          <h4 className=" text-center text-2xl font-medium">Sales</h4>
          <div className="  mt-10">
              <VictoryChart
                height={500}
                theme={VictoryTheme.material}
                width={window.innerWidth}
                domainPadding={50} 
                containerComponent={<VictoryVoronoiContainer />}>
                <VictoryLine
                  labels={({ datum }) => datum.y}
                  labelComponent={
                    <VictoryTooltip
                      style={{ fontSzie: 18 } as any }
                      renderInPortal
                      dy={-20}
                    />
                  } 
                  data={
                    data?.myRestaurant.restaurant?.orders.map(order => (
                      {x:order.createdAt, y:order.total}
                    ))}
                  interpolation={"stepBefore"}
                  style={{
                    data: { strokeWidth: 5, stroke: "red"}
                  }}
                     
                 />

                <VictoryAxis
                  tickLabelComponent={<VictoryLabel renderInPortal dy={-20}/>}
                  style={{
                    tickLabels: {
                      fontSzie: 20,
                      angle: 45,
                    }
                  }} 
                  tickFormat={tick => new Date(tick).toLocaleDateString("ko")}

                />
              </VictoryChart>  
              
          </div>
        </div>   
      </div>
    </div>
  )
}