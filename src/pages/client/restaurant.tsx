import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Dish } from "../../components/dish"
import { DishOption } from "../../components/dish.option"
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment"
import { CreateOrderItemInput, CreateOrderMutation, CreateOrderMutationVariables, RestaurantQuery, RestaurantQueryVariables } from "../../__generated__/types"

/*#️⃣ParentComponent > childComponent

*/

const RESTAURANT_QUERY = gql`
  query restaurant($input:RestaurantInput!){
    restaurant(input:$input){
      ok
      error
      restaurant{
        ...RestaurantParts
        menu{
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;
const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input:CreateOrderInput!){
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`

interface IRestaurantParams{
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>()
  const history  = useHistory()

  const {data, loading} = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables:{
      input:{
        restaurantId: +params.id
      }
    }
  })
  const [orderStarted, setOrderStarted] = useState(false)
  //주문했던 repository라고 생각 + new 주문을 추가
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([])

  const triggerStartOrder = () => {
    setOrderStarted(true)
  }
  //dish entity에서 해당 dishId를 불러와서 
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId))
  }
  const getItem = (dishId:number) => {
    return orderItems.find(order => order.dishId === dishId)
  }
  
  const addItemToOrder = (dishId:number) => {
    //이미 선택된 'dish'이면 선택하지 않음 
    if(isSelected(dishId)){
      return;
    }
    setOrderItems(current => [{dishId, options: [] }, ...current])
  }

  const removeFromOrder = (dishId:number) => {
    setOrderItems((current) => 
      current.filter((dish) => dish.dishId !== dishId)
    )
  }
  
  const isOptionSelected = (dishId:number, optionName: string) => {
    const item = getItem(dishId)
    if(item){
      return Boolean(getOptionFromItem(item, optionName))
    }
    return false;
  }

  const getOptionFromItem = (item: CreateOrderItemInput, optionName:string ) => {
    //⭐ OrderItems안에서 get한 'item의 option' === optionName은 순회
    return item.options?.find(option => option.name === optionName) 
  }
  //⭐addOptionToItem 작성 이유: react.js에서는 새 state를 확인 하고 re-render하는 것 
  const addOptionToItem = (dishId:number, optionName:string) => {
    if(!isSelected(dishId)){
      return;
    }
    
    const oldItem = getItem(dishId)
    if(oldItem){
      const hasOption = Boolean(
        oldItem.options?.find((aOpton) => aOpton.name === optionName)
      )
      if(!hasOption){
        //⭐OrderItems에서 'dish'를 - + 한걸 필터 함 
        removeFromOrder(dishId)
        setOrderItems((current) => [
          {dishId, options:[{name: optionName}, ...oldItem.options!]}, //의미: undefined가 아닌 options가 존재!
          ...current
        ])
      }
    }
  }
  const removeOptionFromItem = (dishId: number, optionName:string) => {
    if(!isSelected(dishId)){
      return;
    }
    const oldItem = getItem(dishId)
    if(oldItem){
      removeFromOrder(dishId)
    }
    setOrderItems((current) => [
      {
      dishId,
       options:oldItem?.options?.filter(
        (option) => option.name !== optionName
       ),
      ...current,
      }
    ])
  }
  const triggerCancelOrder = () => {
    setOrderStarted(false)
    setOrderItems([])
  }
  const onCompleted = (data:CreateOrderMutation ) => {
    console.log(data)
    const {
      createOrder:{orderId}
    } = data;
    if(data.createOrder.ok){
      history.push(`/orders/${orderId}`)
    }
  }

  const [createOrderMutation, {loading: placingOrder}] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >( CREATE_ORDER_MUTATION, {
      onCompleted
  });

  const triggerConfirmOrder = () => {
    if(placingOrder) {
      return;
    }
    if(orderItems.length === 0 ){
      alert("Can't place empty order")
      return;
    }
    
    const ok = window.confirm("You are about to place an order")
    if(ok ){
      createOrderMutation({
        variables:{
          input:{
            restaurantId: +params.id,
            items:orderItems
          }
        }
      })
    } 
  }
  
  return (
    <div>
      <div
        className=" bg-gray-600 bg-cover bg-center py-48"
        style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`}}
      >
        <div className=" bg-white w-3/12 py-8 md:pl-40 sm:pl-4">
          <h4 className=" text-3xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className=" text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className=" text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className=" container pb-32 flex flex-col items-end mt-20">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && 
          <div className=" flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3" >
              Confirm Order
            </button>
            <button onClick={triggerCancelOrder} className="btn px-10 bg-black">
              Cancel Order
            </button>
          </div>
        }
        
        <div className="w-full grid md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish,index) => (
            <Dish
              id={dish.id}
              isSelected={isSelected(dish.id)} 
              orderStarted={orderStarted}
              key={index} 
              description={dish.description} 
              name={dish.name} 
              price={dish.price}
              isCustomer={true} 
              options={dish.options || "" || undefined}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
                               
            >
            {dish.options?.map((option, index) => (
              <DishOption
                key={index}
                dishId={dish.id} 
                isSelected={isOptionSelected(dish.id, option.name)}
                addOptionToItem={addOptionToItem}
                name={option.name}
                extra={option.extra}
                removeOptionFromItem={removeOptionFromItem}
              />
            ))}
          </Dish>  
          ))}
        </div> 
      </div>
    </div>
  );
}