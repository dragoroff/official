import React from "react";
import { shallow } from "enzyme";

import { findByTestAttr } from "../../../test/testUtils";
import CookComponent from "./index";

const setup = () => {
  return shallow(<CookComponent />);
};

let wrapper;
beforeEach(() => {
  wrapper = setup();
});

test("renders without errors", () => {
  const component = findByTestAttr(wrapper, "component-cook");
  expect(component.exists()).toBe(true);
});

test("renders background without errors", () => {
  const background = findByTestAttr(wrapper, "cook-background");
  expect(background.exists()).toBe(true);
});

test("renders two buttons", () => {
  const cookButton = findByTestAttr(wrapper, "cook-button");
  expect(cookButton.length).toBe(2);
});

test("renders logo without errors", () => {
  const logo = findByTestAttr(wrapper, "logo");
  expect(logo.exists()).toBe(true);
});
