import { render, screen } from "@testing-library/react";
import React from "react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("renders ok with props", () => {
    const{getByText} = render(<FormError errorMessage="test"/>)
    screen.getByText("test")
  })

})