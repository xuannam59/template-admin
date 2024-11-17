import axios from "./axisox.customize";

export interface response {
    data?: any,
    message: string,
    statusCode: number
}

const handleAPI = async (
    url: string,
    data?: any,
    method?: 'post' | "get" | "patch" | "delete"
): Promise<response> => {
    return await axios(
        url, {
        method: method ?? "get",
        data
    });
}

export default handleAPI;