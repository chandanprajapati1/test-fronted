import axiosApi from "@/utils/axios-api";
import {API_ENDPOINTS} from "@/config/api-endpoint";
import {CountryList, StateList, CityList} from "@/types";

export const getCountryDropdown = async (): Promise<CountryList[]> => {
    try {
        const countryData = await axiosApi.auth.get(API_ENDPOINTS.CountryList);
        const countryListObject = countryData.data.data.Country;

        const namesAndIds = countryListObject.map((country: { ID: string; Name: string }) => ({
            _id: country.ID,
            name: country.Name
        }));

        return [
            {_id: '', name: 'Select country'},
            ...namesAndIds
        ];
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

export const getStateDropdown = async (countryId: string | undefined) => {
    try {
        let namesAndIds = [];
        if(countryId !== ''){
            const stateData = await axiosApi.auth.get(`state/${countryId}`);
            if(stateData.status == 200){
                const stateListObject = stateData.data.data.State;
                namesAndIds = stateListObject.map((state: { ID: string; Name: string }) => {
                    return {
                        _id: state.ID,
                        name: state.Name
                    };
                });
            }
        }

        return [
            {_id: '', name: 'Select State'},
            ...namesAndIds
        ];
    } catch (error) {
        console.error(`Error fetching states:`, error);
    }
};


export const getCityDropdown = async (stateId: string | undefined) => {
    try {
        let namesAndIds = [];
        if(stateId !== '') {
            const cityData = await axiosApi.auth.get(`city/${stateId}`);
            const stateListObject = cityData.data.data.City;
            namesAndIds = stateListObject.map((state: { ID: string; Name: string }) => {
                return {
                    _id: state.ID,
                    name: state.Name
                };
            });
        }

        return [
            {_id: '', name: 'Select City'},
            ...namesAndIds
        ];
    } catch (error) {
        console.error(`Error fetching city:`, error);
    }
};

export const handleCountryChange = async (countryId: string | undefined, setStateDropdown: (value: (((prevState: StateList[]) => StateList[]) | StateList[])) => void) => {
    try {
        const list: any = await getStateDropdown(countryId);
        setStateDropdown(list);
    } catch (error) {
        console.error(`Error fetching states:`, error);
    }
};

export const handleStateChange = async (stateId: string | undefined, setCityDropdown: (value: (((prevState: CityList[]) => CityList[]) | CityList[])) => void) => {
    try {
        const list: any = await getCityDropdown(stateId);
        setCityDropdown(list);
    } catch (error) {
        console.error(`Error fetching states`, error);
    }
};

export const getCountries = async (): Promise<CountryList[]> => {
    try {
        const countryData = await axiosApi.auth.get(API_ENDPOINTS.CountryList);
        return countryData.data.data.Country;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

export const getStates = async (countryId: string | undefined) => {
    try {
        const stateData = await axiosApi.auth.get(`state/${countryId}`);
        return stateData.data.data.State;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

export const getCities = async (stateId: string | undefined) => {
    try {
        const cityData = await axiosApi.auth.get(`city/${stateId}`);
        return cityData.data.data.City;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};