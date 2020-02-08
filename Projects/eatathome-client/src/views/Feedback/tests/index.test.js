import React from "react";
import { shallow } from "enzyme";
import moxios from "moxios";

import { findByTestAttr } from "../../../../test/testUtils";
import FeedbackComponent from "../index";
import FormComponent from "../form";

const setup = () => {
  return shallow(<FeedbackComponent match={{ params: { obj: "host" } }} />);
};

describe("check elements existance", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });
  test("renders component without errors", () => {
    const component = findByTestAttr(wrapper, "component-feedback");
    expect(component.exists()).toBe(true);
  });

  test("renders logo without errors", () => {
    const logo = findByTestAttr(wrapper, "logo");
    expect(logo.exists()).toBe(true);
  });
});

describe("renders proper component depending on state's success", () => {
  test("when success is false, renders form component", () => {
    const wrapper = setup();
    wrapper.setState({ success: false });
    const FormComponent = findByTestAttr(wrapper, "component-form");
    expect(FormComponent.exists()).toBe(true);
  });

  test("when success is true, does not render form component", () => {
    const wrapper = setup();
    wrapper.setState({ success: true });
    const FormComponent = findByTestAttr(wrapper, "component-form");
    expect(FormComponent.exists()).toBe(false);
  });

  test("when success is true, renders success box", () => {
    const wrapper = setup();
    wrapper.setState({ success: true });
    const successBox = findByTestAttr(wrapper, "success-box");
    expect(successBox.exists()).toBe(true);
  });

  test("when success is false, does not render success box", () => {
    const wrapper = setup();
    wrapper.setState({ success: false });
    const successBox = findByTestAttr(wrapper, "success-box");
    expect(successBox.exists()).toBe(false);
  });
});

describe("onSubmit event", () => {
  test("updates state after button was clicked", () => {
    const data = {
      country: null,
      email: "",
      lastName: "",
      firstName: "",
      phone: ""
    };

    const mockHandleSubmit = jest.fn();
    const wrapperForm = shallow(<FormComponent onSubmit={mockHandleSubmit} />);

    const form = findByTestAttr(wrapperForm, "main-form");
    form.simulate("submit", { preventDefault() {} });

    expect(mockHandleSubmit).toHaveBeenCalledWith(data);
  });
});

describe("error case", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test("change error in state when error occured", () => {
    const inputData = {
      firstName: "test",
      lastName: "test",
      email: "test",
      phone: 123,
      country: "test"
    };
    const wrapper = setup();

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 400,
        response: {
          data: "error"
        }
      });
    });

    return wrapper
      .instance()
      .handleSubmit(inputData)
      .then(() => {
        expect(wrapper.state().error).toBe("error");
      });
  });
});

describe("success case", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  test("change `success` to true in state after axios response", () => {
    const inputData = {
      firstName: "test",
      lastName: "test",
      email: "test",
      phone: 123,
      country: "test"
    };
    const wrapper = setup();

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200
      });
    });

    return wrapper
      .instance()
      .handleSubmit(inputData)
      .then(() => {
        expect(wrapper.state().success).toBe(true);
      });
  });
});
