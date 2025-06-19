import ApiService from "./api-service-config/api-service";

export const sendNewMessage = async (newMessage) => {
  const apiObject = {
    method: "POST",
    withCredentials: true,
    prefix: "discussion",
    endpoint: "chat",
    body: newMessage,
  };
  return await ApiService.callApi(apiObject);
};