import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../fragment";
import { useMe } from "../hooks/useMe";
import { 
  OrderUpdatesSubscription,
  GetOrderQuery,
  GetOrderQueryVariables,
  EditOrderMutation,
  EditOrderMutationVariables,
  OrderStatus,
  UserRole
  } from "../__generated__/types";
/*#️⃣25.0 Order Component
  1. 고객 관점:고객이 주문 > restaurant이 주문을 수락 --- 고객이 주문 상태를 확인
  2. 오너 관점: 주문이 들어오면 주문을 받는 subscription
  3. 라이더 관점 : 주문을 받는 subscription을 하고 '구글 맵'으로 위치를 알려 줌   

 #️⃣25.1 Subscription Setup
  1. 📄https://www.apollographql.com/docs/react/data/subscriptions/
   > 백엔드: npm install graphql-ws
   > 프론트엔드 
  
 #️⃣25.4 Edit Order
  1. oncClick 핸들러  > onButtonClick호출 with 'newStatus'를 받는다  
    > const onButtonClick = (newStatus: OrderStatus) => {
      
     }   

 #️⃣ 
   🔹const {data, subscribeToMore} = useQuery()
     📄https://www.apollographql.com/docs/react/data/queries#result    
*/
const GET_ORDER = gql`
  query getOrder($input: GetOrderInput!){
    getOrder(input:$input){
      ok
      error
      order{
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!){
    orderUpdates(input: $input){
      ...FullOrderParts
    }
  }  
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id:string;
}

const EDIT_ORDER = gql`
  mutation editOrder($input:EditOrderInput!){
    editOrder(input:$input){
      ok
      error
    }
  }
`

export const Order = () => {
  const params = useParams<IParams>();
  const {data: userData} = useMe()
  const [editOrderMutation] = useMutation<EditOrderMutation, EditOrderMutationVariables>(EDIT_ORDER)

  const {data, subscribeToMore} = useQuery<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER, {
    variables:{
      input:{
        id:+params.id
      }
    }
  })

  useEffect(() => {
    if(data?.getOrder.ok){
      subscribeToMore({
        document:ORDER_SUBSCRIPTION,
        variables:{
          input:{
            id: +params.id
          }
        },
        updateQuery:( //⭐updateQuery를 이용해 data를 덮어씌워서 query를 교체
          prev,
          {
            subscriptionData: { data }, 
          } : {subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if(!data) return prev;
          return{
            getOrder:{
              ...prev.getOrder,
              order:{
                ...data.orderUpdates
              }
            }
          }
        }
      })
    }

  }, [data])
  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables:{
        input:{
          id: +params.id,
          status: newStatus
        }
      }
    })
  }  
  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | NuberEats </title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
              
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
             Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending&& (
                <button onClick={() => onButtonClick(OrderStatus.Cooking)}className=" btn">Accept order</button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button onClick={() => onButtonClick(OrderStatus.Cooked)}className=" btn">Order Cooked</button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
              
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className="btn"
                >
                  Picked Up
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className="btn"
                >
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Thank you for using Nuber Eats
            </span>
          )}          
        </div>
      </div>
    </div>
  )
}