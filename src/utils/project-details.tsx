import axiosApi from "@/utils/axios-api";
import {API_ENDPOINTS} from "@/config/api-endpoint";
import {AxiosResponse} from "axios";


type ApiResponse = {
    data: {
        data: any;
        project_details: {
            total_credit?: any;
            actual_annual_estimated_reductions?: any;
            crediting_period?: {
                start_date: any;
                end_date: any;
            };
            active_credit?: {
                start_date: any;
                end_date: any;
            };
        };
    };
};

export const fetchProjectDetails = async (projectId: string | null): Promise<NonNullable<ApiResponse['data']['project_details']> | null> => {
    try {
        const response: AxiosResponse<ApiResponse['data']> = await axiosApi.project.get(
            API_ENDPOINTS.ProjectCurrentStatus(projectId)
        );
        const projectData = response.data.data.project_details;
        console.log('Project Data:', response);
        return projectData;
    } catch (error) {
        console.error('Error fetching project details:', error);
        return null;
    }
};