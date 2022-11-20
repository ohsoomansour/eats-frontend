/*#️⃣20.2 Button Tests
  1. [package.json]
    "test": "react-script test --verbose"
   > <Button />
     ✅"should render ok with props" 

   2. [button.tsx]
     {loading ? "Loading..." : actionText }   --- 삼항 조건: component의 Implementation
    > {loading && "Loading..." }  ---  🚫코드 테스트 ⭕사용자 관점으로 output만 테스트 --- 
      {!loading && actionText }

   3.canClick
     const ✅{container} = render
     <body>
      <div>✅🚀사용 --- ⭐container의 children이 무엇을 가지고 있는지 체크 ---
        <button
          class="text-lg font-medium focus:outline-none text-white py-3  transition-colors bg-gray-300"
        >
          Test
        </button>
      </div>
     </body> 

     🔵expect(container.firstChild).toHaveClass("pointer-events-none")
     🔹pointer-event-none: HTML 요소에 정의된 클릭, 상태(hover,active등) 커서 옵션들이 '비활성화'한다.  
  */

import { render, screen } from "@testing-library/react"
import React from "react"
import { Button } from "../button"

jest.mock('../../pages/login.tsx', () => {

  return{
    Button: () => <span></span>
  }
})

describe("buttton", () => {
  it("should render ok with props", () => {
    const {debug, getByText, rerender} = render(<Button  canClick={true} loading={false}  actionText={"Test"} />)
    screen.getByText("Test")

    rerender(<Button  canClick={true} loading={true}  actionText={"Loading..."} />)

    screen.getByText("Loading...")
  })
  it("canClick", () => {
    const {debug, getByText ,container} = render(
      <Button  canClick={false} loading={false}  actionText={"Test"} />
    )
    expect(container.firstChild).toHaveClass("pointer-events-none")
  })

})