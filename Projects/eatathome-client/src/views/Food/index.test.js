import React from "react";
import { shallow } from "enzyme";

import { findByTestAttr } from "../../../test/testUtils";
import FoodComponent from "./index";

const setup = () => {
  return shallow(<FoodComponent />);
};

let wrapper;
beforeEach(() => {
  wrapper = setup();
});

test("renders without errors", () => {
  const component = findByTestAttr(wrapper, "component-food");
  expect(component.exists()).toBe(true);
});

test("renders background without errors", () => {
  const background = findByTestAttr(wrapper, "food-background");
  expect(background.exists()).toBe(true);
});

test("renders two buttons without errors", () => {
  const foodButton = findByTestAttr(wrapper, "food-button");
  expect(foodButton.length).toBe(2);
});

test("renders logo without errors", () => {
  const logo = findByTestAttr(wrapper, "logo");
  expect(logo.exists()).toBe(true);
});
