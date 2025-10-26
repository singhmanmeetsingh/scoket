import axios from "axios";


// use try and catch for axios 


export const getHomePageData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
