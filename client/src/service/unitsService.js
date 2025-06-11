import ApiService from "./api-service-config/api-service";


export async function getAllunits() {
    const student = getCourseId();
    if (student.enrolledCourses 
        != null) {
        const apiObject = {};
        apiObject.method = "GET";
        apiObject.authentication = true;
        apiObject.prefix = "units";
        apiObject.endpoint = student.enrolledCourses[0];
        return await ApiService.callApi(apiObject);
    }
    return [{
            "unitId": "6848fef5b46d16dccf6732d0",
            "title": "Unit 3: JavaSceerweweweript Basics",
            "course": null,
            "subUnits": [],
            "lessons": [],
            "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
            "assessments": [],
            "credits": "4.0",
            "exams": [
                {
                    "_id": "684907ceb46d16dccf6732fe",
                    "title": "Midterm Exam",
                    "date": "2025-06-15T10:00:00.000Z"
                }
            ],
            "studyMaterials": [],
            "discussions": [],
            "order": 1,
            "createdAt": "2025-06-11T03:58:45.660Z",
            "updatedAt": "2025-06-11T03:58:45.660Z",
            "__v": 0
        }]
}

export async function getCourseId() {
    const studentId = localStorage.getItem("user")
    const apiObject = {};
    apiObject.method = "GET";
    apiObject.authentication = true;
    apiObject.prefix = "students";
    apiObject.endpoint = studentId;
    return await ApiService.callApi(apiObject);
}