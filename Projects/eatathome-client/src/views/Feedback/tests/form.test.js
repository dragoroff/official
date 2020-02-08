import React from "react";
import { shallow } from "enzyme";

import { findByTestAttr, checkProps } from "../../../../test/testUtils";
import FormComponent from "../form";
import FeedbackComponent from "../form";

let mockOnSubmit = jest.fn();
const setup = (props = { onSubmit: mockOnSubmit, error: "" }) => {
  return shallow(<FormComponent {...props} />);
};

describe("check elements existance", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });
  test("renders without errors", () => {
    const component = findByTestAttr(wrapper, "component-form");
    expect(component.exists()).toBe(true);
  });

  test("renders button without errors", () => {
    const formButton = findByTestAttr(wrapper, "form-button");
    expect(formButton.length).toBe(1);
  });
});

describe("check props", () => {
  test("does not throw error with expected properties", () => {
    checkProps(FormComponent, { onSubmit: mockOnSubmit, error: "" });
  });
});

describe("changes the state when onChange event happened", () => {
  let wrapper, inputName, inputLastName, selectCountry, inputEmail, inputPhone;
  let mockSetState = jest.fn();
  const initialState = {
    name: "",
    lastName: "",
    email: "",
    country: null,
    phone: 0
  };

  beforeEach(() => {
    React.useState = jest.fn(() => [initialState, mockSetState]);
    wrapper = setup();

    // find each field
    inputName = findByTestAttr(wrapper, "input-name");
    inputLastName = findByTestAttr(wrapper, "input-lastname");
    selectCountry = findByTestAttr(wrapper, "select-country");
    inputEmail = findByTestAttr(wrapper, "input-email");
    inputPhone = findByTestAttr(wrapper, "input-phone");
  });

  afterEach(() => {
    mockSetState.mockClear();
  });

  describe("state updates with values of form input fields upon change", () => {
    test("first name field updates upon change", () => {
      const mockEventText = { target: { name: "name", value: "test" } };

      inputName.simulate("change", mockEventText);
      expect(mockSetState).toHaveBeenCalledWith({
        ...initialState,
        [mockEventText.target.name]: mockEventText.target.value
      });
    });

    test("last name field updates upon change", () => {
      const mockEventText = { target: { name: "lastName", value: "test" } };

      inputLastName.simulate("change", mockEventText);
      expect(mockSetState).toHaveBeenCalledWith({
        ...initialState,
        [mockEventText.target.name]: mockEventText.target.value
      });
    });

    test("email field updates upon change", () => {
      const mockEventText = { target: { name: "email", value: "test" } };

      inputEmail.simulate("change", mockEventText);
      expect(mockSetState).toHaveBeenCalledWith({
        ...initialState,
        [mockEventText.target.name]: mockEventText.target.value
      });
    });

    test("phone field updates upon change", () => {
      const mockEventNumber = { target: { name: "phone", value: "123" } };

      inputPhone.simulate("change", mockEventNumber);
      expect(mockSetState).toHaveBeenCalledWith({
        ...initialState,
        [mockEventNumber.target.name]: mockEventNumber.target.value
      });
    });

    test("select field updates upon change", () => {
      selectCountry.simulate("change", "Israel");
      expect(mockSetState).toHaveBeenCalledWith({
        ...initialState,
        country: "Israel"
      });
    });
  });
});

describe("error box", () => {
  test("when error in state is not empty, renders error box", () => {
    const wrapper = setup({ error: "error", onSubmit: mockOnSubmit });
    const errorBox = findByTestAttr(wrapper, "error-box");
    expect(errorBox.exists()).toBe(true);
  });

  test("when error in state is empty, does not render error box", () => {
    const wrapper = setup();
    const errorBox = findByTestAttr(wrapper, "error-box");
    expect(errorBox.exists()).toBe(false);
  });
});
