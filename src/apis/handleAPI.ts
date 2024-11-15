import axios from "./axisox.customize";

const handleAPI = async (
    url: string,
    data?: any,
    method?: 'post' | "get" | "patch" | "delete"
) => {
    return await axios(
        url, {
        method: method ?? "get",
        data
    });
}

export default handleAPI;