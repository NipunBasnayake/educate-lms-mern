import ApiService from "./api-service-config/api-service";

export async function getCourseId() {
    const studentId = localStorage.getItem("user");
    if (!studentId) {
        throw new Error("No student ID found in localStorage");
    }
    const apiObject = {
        method: "GET",
        authentication: true,
        prefix: "students",
        endpoint: studentId,
    };
    try {
        const response = await ApiService.callApi(apiObject);
        if (!response || !response.data || !response.data.enrolledCourse || !response.data.enrolledCourse._id) {
            throw new Error("Invalid student data or no enrolled course found");
        }
        return response;
    } catch (error) {
        console.error("getCourseId error:", error.message);
        throw error;
    }
}

export async function getAllunits() {
    try {
        const student = await getCourseId(); // Add await here
        const apiObject = {
            method: "GET",
            authentication: true,
            prefix: "",
            endpoint: "units?course="+student.data.enrolledCourse._id, // Use _id based on response
        };
        return await ApiService.callApi(apiObject);
    } catch (error) {
        console.error("getAllunits error:", error.message);
        throw error;
    }
}