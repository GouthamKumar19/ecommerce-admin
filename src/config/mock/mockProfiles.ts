import { UserProfile } from "../../types/profileTypes";

export const mockProfileResponse: UserProfile = {
  _id: "6512c5f3e4b09a12d8f42b68",
  name: "john",
  email: "john123@exelon.com",
  role: "ADMIN",
  createdAt: "2024-02-06T15:30:00.000Z",
  updatedAt: "2024-02-06T15:30:00.000Z",
};

export const mockApiResponse = {
  status: 200,
  message: "Success",
  data: mockProfileResponse,
};

export const mockUpdateApiResponse = {
  status: 200,
  message: "Success",
  data: mockProfileResponse,
};
