import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { useAuthToken } from "../../turnify/hooks/useAuthToken";

jest.mock("../../turnify/hooks/useAuthToken");

const mockedUseAuthToken = jest.mocked(useAuthToken);

test('renders the app', () => {
  mockedUseAuthToken.mockReturnValue({accessToken: 'someFakeToken'})
  render(<App />);
});
