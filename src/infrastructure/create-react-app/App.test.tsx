import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { getAccessToken } from "../../turnify/hooks/getAccessToken";

jest.mock("../../turnify/hooks/useAuthToken");

const mockedGetAccessToken = jest.mocked(getAccessToken);

test("renders the app", () => {
  mockedGetAccessToken.mockResolvedValue("someFakeToken");
  render(<App />);
});
