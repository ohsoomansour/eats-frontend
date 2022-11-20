import { render,screen } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import {BrowserRouter, Link} from "react-router-dom"
/*#️⃣20.3 FormError and Restaurant Tests
  1. 🚨Invariant failed: You should not use <Link> outside a <Router>
   > restaurant 컴포넌트는 LoggedInRouter에서 보여지기 때문에
   > 🔑keyPoint: 에러 메세지는 Link사용을 해야 한다고 하지만 
    - 사용자 관점: Restaurant 컴포넌트와 props가 렌더에 초점이 맞춰져 있다 

  */


describe("<Restaurant />", () => {
  it("renders ok with props", () => {
    const restaurantProps  = {
      id:1,
      name:"name",
      categoryName: "categoryName",
      coverImg: "lala"
    }

   const {debug, getByAltText, container} = render(
      <BrowserRouter>
        <Restaurant 
          {...restaurantProps} 
        />
      </BrowserRouter>
    )
    //screen.debug();
    screen.getByText(restaurantProps.name)
    screen.getByText(restaurantProps.categoryName)
    expect( container.firstChild).toHaveAttribute('href', `/restaurants/${restaurantProps.id}`)
  })

})