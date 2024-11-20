import { InboxOutlined } from "@ant-design/icons"
import { message, Modal, notification, Table, Upload, UploadProps } from "antd";
import type { UploadRequestOption } from "rc-upload/lib/interface"; // Import đúng kiểu
import { useState } from "react";
import * as XLSX from 'xlsx';

const { Dragger } = Upload;

interface IProps {
    isModalOpenImport: boolean
    setIsModalOpenImport: React.Dispatch<React.SetStateAction<boolean>>
    fetchUser: () => void
}



const UserImport = (props: IProps) => {
    const { isModalOpenImport, setIsModalOpenImport } = props
    const [isLoading, setIsLoading] = useState(false);
    const [dataExcel, setDataExcel] = useState<any[]>([]);

    const onCancel = () => {
        setDataExcel([]);
        setIsModalOpenImport(false)
    }

    const onImportData = () => {
        setIsLoading(true);
        const data = dataExcel.map((item) => {
            item.password = "123456";
            return item;
        });
        notification.info({
            message: "Đang xử lý",
            description: "Sau sẽ update api"
        });
        onCancel()
        setIsLoading(false)
    }

    const dummyRequest = (options: UploadRequestOption<any>) => {
        const { file, onSuccess } = options;
        setTimeout(() => {
            if (onSuccess) {
                onSuccess("ok");
            }
        }, 1000);
    };

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        customRequest: dummyRequest,
        onChange(info) {
            console.log("Check info>>>>", info);
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done' && info.fileList && info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                if (file) {
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        let data = new Uint8Array(reader.result as ArrayBuffer);
                        let workbook = XLSX.read(data, { type: 'array' });
                        let sheet = workbook.Sheets[workbook.SheetNames[0]];

                        // convert to json format
                        const jsonData = XLSX.utils.sheet_to_json(sheet, {
                            header: ["name", "email", "phone"], // set field object
                            range: 1 // skip header row
                        });

                        if (jsonData && jsonData.length > 0) {
                            setDataExcel(jsonData as any[]);
                            message.success(`${info.file.name} file uploaded successfully.`);
                        } else {
                            message.error("No valid data found in the file.");
                        }
                    };
                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Modal
                title="Tạo mới người dùng"
                width={"50vw"}
                open={isModalOpenImport}
                onOk={onImportData}
                onCancel={onCancel}
                okText={"Import Data"}
                maskClosable={false}
                okButtonProps={{
                    loading: isLoading,
                    disabled: dataExcel.length < 1
                }}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>

                <div className="p-3">
                    <Table
                        dataSource={dataExcel}
                        title={() => <span>Dữ liệu người dùng</span>}
                        columns={[
                            {
                                title: 'Tên',
                                dataIndex: 'name',
                                key: "name"
                            },
                            {
                                title: 'Email',
                                dataIndex: 'email',
                                key: "email"
                            },
                            {
                                title: 'Số điện thoại',
                                dataIndex: 'phone',
                                key: "phone"
                            },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default UserImport