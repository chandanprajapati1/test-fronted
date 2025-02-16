import { getAuthCredentials } from "@/utils/auth-utils";
import { getBaseUrl } from "@/utils/axios-api";

async function fetchProjectDetails(url: string) {
    const token = getAuthCredentials();

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Uncomment the line below if you need token authentication
                'Authorization': `Bearer ${token?.token}`
            }
        });

        if (!response.ok) {
            // Throw a more descriptive error
            throw new Error(`Failed to fetch: ${response.statusText} (status: ${response.status})`);
        }

        const result = await response.json();
        console.log("Fetched Project Details:", result);

        // Assuming the data structure contains `registries` inside `result.data`
        return result.data || [];
    } catch (error: any) {
        console.error("Error fetching project details:", error.message || error);
        throw error; // Rethrow the error after logging
    }
}

export const getRegisterNamesAndIds = async () => {
    try {
        const registerData = await fetchProjectDetails(`${getBaseUrl('project')}/list-registries`);

        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = registerData.registries.map((registry: { _id: string; name: string }) => {
            return {
                _id: registry._id,
                name: registry.name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getRegisterNamesAndIds:", e.message || e);
        return null;
    }
};

export const getCountryNamesAndIds = async () => {
    try {
        const countryData = await fetchProjectDetails(`${getBaseUrl('auth')}/country`);

        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = countryData.Country.map((country: { ID: string; Name: string }) => {
            return {
                _id: country.ID,
                name: country.Name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getCountryNamesAndIds:", e.message || e);
        return null;
    }
};

export const getStateNamesAndIds = async (id: string) => {
    try {
        const stateData = await fetchProjectDetails(`${getBaseUrl('auth')}/state/${id}`);

        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = stateData.State.map((state: { ID: string; Name: string }) => {
            return {
                _id: state.ID,
                name: state.Name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getStateNamesAndIds:", e.message || e);
        return null;
    }
};

export const getSectorNamesAndIdsWithoutRegistry = async () => {
    try {
        const sectorData = await fetchProjectDetails(`${getBaseUrl('project')}/sectors`);

        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = sectorData.sectors.map((sector: { _id: string; sector_name: string }) => {
            return {
                _id: sector._id,
                name: sector.sector_name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getSectorNamesAndIds:", e.message || e);
        return null;
    }
};

export const getSectorNamesAndIds = async (id: string) => {
    try {
        const sectorData = await fetchProjectDetails(`${getBaseUrl('project')}/sectors-list?registry_id=${id}`);

        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = sectorData.sectors.map((sector: { _id: string; sector_name: string }) => {
            return {
                _id: sector._id,
                name: sector.sector_name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getSectorNamesAndIds:", e.message || e);
        return null;
    }
};

export const getMethodologyNamesAndIds = async (id: string) => {
    try {
        const methodologyData = await fetchProjectDetails(`${getBaseUrl('project')}/list-methodologies/${id}`);

        console.log("methodologyData", methodologyData)
        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = methodologyData.methodologies.map((methodology: { _id: string; name: string }) => {
            return {
                _id: methodology._id,
                name: methodology.name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getMethodologyNamesAndIds:", e.message || e);
        return null;
    }
};



export const getTypeNamesAndIds = async (registry: string, sector: string) => {
    try {
        const typeData = await fetchProjectDetails(`${getBaseUrl('project')}/project-types-list?registry_id=${registry}&sector_id=${sector}`);
        // Map over the data to extract only 'name' and '_id'
        const namesAndIds = typeData.project_types.map((type: { _id: string; type_name: string }) => {
            return {
                _id: type._id,
                name: type.type_name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getTypeNamesAndIds:", e.message || e);
        return null;
    }
};

export const getSDGGoalsNamesAndIds = async () => {
    try {
        const sdgGoalData = await fetchProjectDetails(`${getBaseUrl('project')}/list-sdg-goals`);

        // Map over the data to extract only 'name' and '_id'
        console.log(" ==================sdgGoalData", sdgGoalData)
        const namesAndIds = sdgGoalData.sdg_goals.map((goal: { _id: string; goal_name: string; description: string, hero_image: any }) => {
            return {
                _id: goal._id,
                name: goal.goal_name,
                description: goal.description,
                image: goal.hero_image.name
            };
        });

        console.log("Names and IDs:", namesAndIds);
        return namesAndIds;
    } catch (e: any) {
        console.error("Error in getSDGGoalsNamesAndIds:", e.message || e);
        return null;
    }
};
