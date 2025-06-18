import ApiService from "./api-service-config/api-service";

export async function getQuizByUnitId(id) {
  try {
    const apiObject = {
      method: "GET",
      withCredentials: true,
      prefix: "",
      endpoint: `quiz/unit/${id}`,
    };
    return await ApiService.callApi(apiObject);
  } catch (error) {
    console.error("getQuizById error:", error.message);
    throw error;
  }
}