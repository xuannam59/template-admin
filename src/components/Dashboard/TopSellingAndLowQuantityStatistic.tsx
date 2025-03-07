import handleAPI from "@/apis/handleAPI";
import { VND } from "@/helpers/handleCurrency";
import { IProducts } from "@/pages/Product";
import { Avatar, Card, Image, List, Space, Table, Tag, Typography } from "antd"
import { useEffect, useState } from "react";


const { Text } = Typography;
const TopSellingAndLowQuantityStatistic = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{
        topSelling: IProducts[],
        lowQuantity: IProducts[]
    }>({
        topSelling: [],
        lowQuantity: []
    });

    useEffect(() => {
        getTopStatistic()
    }, []);

    const getTopStatistic = async () => {
        setIsLoading(true);
        const api = `products/top-selling`
        try {
            const res = await handleAPI(api);
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }
    console.log(data);
    return (
        <>
            <div className="row mt-4">
                <div className="col-12 col-md-8">
                    <Card
                        title="Top Selling"
                    >
                        <Table
                            loading={isLoading}
                            pagination={false}
                            dataSource={data.topSelling}
                            columns={[
                                {
                                    title: "#",
                                    align: "center",
                                    width: 20,
                                    render: (_, _1, index) => index + 1
                                },
                                {
                                    title: "Title",
                                    dataIndex: "title",
                                    key: "title",
                                    width: "",
                                    render: (title: string, record) => <>
                                        <Space>
                                            <Text
                                                ellipsis={{ tooltip: title }}
                                                style={{ width: "200px" }}
                                            >
                                                {title}
                                            </Text>
                                        </Space>
                                    </>
                                },
                                {
                                    title: "Sold",
                                    align: "center",
                                    dataIndex: "sold"
                                },
                                {
                                    title: "quantity",
                                    align: "center",
                                    render: (product: IProducts) => {
                                        const quantity = product.versions.reduce((prev, cur) =>
                                            prev + cur.quantity, 0);
                                        return <Text>{quantity}</Text>
                                    }
                                },
                                {
                                    title: "Price",
                                    align: "center",
                                    render: (product: IProducts) => {
                                        return <Text>
                                            {VND.format(product.price * (1 - product.discountPercentage / 100))}
                                        </Text>
                                    }
                                }
                            ]}
                            rowKey={"_id"}
                            scroll={{
                                x: "max-content"
                            }}
                        />
                    </Card>
                </div>
                <div className="col-12 col-md-4">
                    <Card
                        loading={isLoading}
                        title="Low Quantity stock"
                    >
                        <List
                            dataSource={data.lowQuantity}
                            renderItem={item => <List.Item key={item._id} extra={<Tag>Low</Tag>}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.thumbnail} />}
                                    title={<Text ellipsis={{ tooltip: item.title }}>{item.title}</Text>}
                                    description={`Quantity: ${item.versions.reduce((a, b) => a + b.quantity, 0)}`}
                                />
                            </List.Item>}
                        />
                    </Card>
                </div>
            </div>
        </>
    )
}

export default TopSellingAndLowQuantityStatistic