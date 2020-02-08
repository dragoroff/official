import React from "react";
import { shallow } from "enzyme";

import { findByTestAttr } from "../../../test/testUtils";
import MainPage from "./index";

const setup = () => {
  return shallow(<MainPage />);
};

let wrapper;
beforeEach(() => {
  wrapper = setup();
});

test("renders without errors", () => {
  const component = findByTestAttr(wrapper, "component-main");
  expect(component.exists()).toBe(true);
});

test("renders background without errors", () => {
  const background = findByTestAttr(wrapper, "main-background");
  expect(background.exists()).toBe(true);
});

test("renders two buttons", () => {
  const mainButton = findByTestAttr(wrapper, "main-button");
  expect(mainButton.length).toBe(2);
});
