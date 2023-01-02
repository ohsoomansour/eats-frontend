import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { CreateDishMutation, CreateDishMutationVariables } from "../../__generated__/types";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

/*#️⃣22.10 DishOptions part One
  1. Form & input 
    //@ts-ignore
   <iniput 
     ⭐{...register(`${index}-OptionName`)}
   /> 
   <input
     ⭐{...register(`${index}-OptionExtra`)}
   />

  2.  const onSubmit = () => {
        const {name, price, description, ⭐...rest} = getValues()
      } 
  
  3. 듀토리얼  
    setValue(): 📄https://react-hook-form.com/api/useform/setvalue
    - 개념: setValue(name, value, config?: Object ) => void
    - 예시: setValue('array.0.test1', '1')
    - 키포인트: "will directly update input value"

  🔹unmount(언마운트): 컴포넌트가 DOM에서 제거되는 것   
  🔹 +"" = 0
  🔹react-hook-form 사용시, defaultValue는 hook에서 default 값을 선언해 줘야 한다
  🔹useForm({shouldUnregister: true})
    - By default, an input value will be retained when input is removed. However,
      you can set shouldUnregister to true to unregister input during unmount.      

*/
const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!){
    createDish(input:$input){
      ok
      error
    }
  }
`

interface IPrams {
  restaurantId: string;
}
interface IForm {
  name: string;
  price:string;
  description:string;
  [key:string]:string;
}

export const AddDish = () => {
  const { restaurantId }  = useParams<IPrams>()
  const history = useHistory()
  const [createDish, {loading}] = useMutation<CreateDishMutation, CreateDishMutationVariables>(
    CREATE_DISH_MUTATION, {
      refetchQueries:[
        {
          query: MY_RESTAURANT_QUERY, 
          variables:{
            input:{
              id: +restaurantId
            }
          }
        }
      ]
    })
  const {register ,handleSubmit, getValues, formState, setValue, unregister } = useForm<IForm>({
    mode:"onChange",
    shouldUnregister:true
  })
  const onSubmit = () => {
    const {name, price, description, ...rest} = getValues()
    const optionObjects = optionsNumber.map(theId => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`]
    }))

    createDish({
      variables:{
        input:{
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options:optionObjects
        }

      }
    })
    history.goBack()
    
  }
  //optionNumber:옵션을 몇개 추가 했는지 
  const [optionsNumber, setOptionsNumber] = useState<number[]>([])
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current])
  }
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete))
    setValue(`${idToDelete}-optionName`, "" )
    //대안:unregister(`${idToDelete}-optionName`)
    setValue(`${idToDelete}-optionExtra`, "")
    //대안:unregister(`${idToDelete}-optionExtra`)     
  }

  return (
    <div className=" container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className=" text-2xl font-semibold mb-3">Add Dish</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" grid max-w-screen-sm w-full gap-3 mb-5"
      >
        <input
          {...register("name", { required: "Name is required" })}
          className=" input"
          type="text"
          placeholder="name"        
        />
        <input
          {...register("price" , { required: "Price is required" })}
          className=" input"
          type="number"
          min={0}
          placeholder="Price"        
        />
        <input
          {...register("description", {required: "Description is required"})}
          className=" input"
          type=" text"
        />
        <div className=" my-10">
          <h4 className=" text-lg font-medium mb-3">Dish Option</h4>
          <span
            className=" cursor-pointer bg-gray-900 text-white py-1 px-2 mt-5"
            onClick={onAddOptionClick}
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 && (
            optionsNumber.map((id) => (
              <div key={id} className=" mt-5">
                
                <input 
                  {...register(`${id}-optionName`)}
                  className=" py-2 px-4 focus:outline-none mr-3 focus-border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input 
                  {...register(`${id}-optionExtra`)}
                  className=" py-2 px-4 focus:outline-none mr-3 focus-border-gray-600 border-2"
                  type="number"
                  min={0}

                  placeholder="Option Extra"
                />
                <span
                 className=" cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5"
                 onClick={() => onDeleteClick(id)}>Delete Option</span>
              </div>  
            ))
          )}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Create Dish"
        />
      </form>
    </div>
  )
}