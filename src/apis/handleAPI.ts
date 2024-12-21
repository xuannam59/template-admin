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

export const handleUploadFileAPI = (file: any): Promise<response> => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    return axios({
        method: 'post',
        url: '/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export default handleAPI;