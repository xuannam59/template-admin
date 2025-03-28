import { handleUploadFileAPI } from "@/apis/handleAPI";
import { notification, UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";

export const previewImage = (setState: React.Dispatch<React.SetStateAction<UploadFile[]>>) =>
    ({ fileList: newFileList }: UploadChangeParam<UploadFile>) =>
        setState(newFileList.map((item) => ({
            ...item,
            url: item.originFileObj ? URL.createObjectURL(item.originFileObj) : item.url,
            status: 'done'
        })));

export const uploadImage = async (files: any, folder: string, single?: boolean): Promise<string[] | string> => {
    const urls: string[] = [];
    if (files.length > 0) {
        for (const file of files) {
            if (file.originFileObj) {
                const url = await handleUploadFileAPI(file.originFileObj, `images/${folder}`);
                if (url.data) {
                    urls.push(url.data.fileUpload)
                } else {
                    notification.error({
                        message: file.name,
                        description: url.message && Array.isArray(url.message) ?
                            url.message.toString() :
                            url.message,
                        duration: 3
                    })
                }
            } else {
                urls.push(file.url);
            }
        }
    }

    return single ? urls[0] : urls;
}