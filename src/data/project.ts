import axiosApi from "@/utils/axios-api";
import { API_ENDPOINTS } from "@/config/api-endpoint";

export const fetchProjectDetails = async (): Promise<any> => {
    const response = await axiosApi.project.get(API_ENDPOINTS.Projects);
    if (response.status === 200 || response.status === 201) {
        console.log("project List");
        console.log(response.data);
        console.log("project List end");
        return response.data;
    }
};