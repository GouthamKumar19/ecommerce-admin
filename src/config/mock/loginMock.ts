import { LoginResponse } from "../../types/loginTypes";

export const mockLoginResponse: LoginResponse = {
  _id: "1234567890abcdef",
  name: "john",
  email: "john123@exelon.com",
  role: "ADMIN",
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC2J9.eyJpYXQiOjE3MTg0NTYyMzAsImV4cCI6MTcyMTA0ODIzMH0.en4E7n7zxBA2OK0nVzW3hGL6i1-hFhnEwGW",
  refresh_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV2CJ9.eyJpYXQiOjE3MTg0NTYyMzEsImV4cCI6MjAzMzgxNjIzMX0.Po_Xc3Jt4GhKWpd1B5cUcHsdZWq_4ElO138VmsU",
  refreshExpiresAt: "2024-07-15T12:57:10.956Z",
};

export const mockApiResponse = {
  status: 200,
  message: "Login successful",
  data: mockLoginResponse,
};
