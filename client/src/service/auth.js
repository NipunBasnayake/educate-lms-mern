import ApiService from "./api-service-config/api-service";

export const registerUser = async (userCredentials) => {
  const apiObject = {};
  apiObject.method = "POST";
  apiObject.authentication = false;
  apiObject.prefix = "auth";
  apiObject.endpoint = "register";
  apiObject.body = userCredentials;
  return await ApiService.callApi(apiObject);
};
