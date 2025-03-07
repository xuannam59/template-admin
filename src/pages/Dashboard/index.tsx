import handleAPI from "@/apis/handleAPI";
import DashboardStatistic from "@/components/Dashboard/DashboardStatistic";
import PurchaseStatistic from "@/components/Dashboard/PurchaseStatistic";
import TopSellingAndLowQuantityStatistic from "@/components/Dashboard/TopSellingAndLowQuantityStatistic";
import { VND } from "@/helpers/handleCurrency";
import { Card, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

interface IStatistic {
    totalAmount: number
    products: Array<{
        title: string
        quantity: number
        color: string
        thumbnail: string
        price: number
        cost: number
    }>;
    status: string;
}
const { Title } = Typography
const AdminPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statistic, setStatistic] = useState<IStatistic[]>([]);


    useEffect(() => {
        getStatistic();
    }, []);

    const revenue = statistic.reduce((a, b) => a + b.totalAmount, 0);
    const profit = statistic.reduce((a, b) => a + b.products.reduce((x, y) => x + y.price - y.cost, 0), 0);
    const cost = statistic.reduce((a, b) => a + b.products.reduce((x, y) => x + y.cost, 0), 0);
    const productsDelivered = statistic.filter(item => item.status === "shipping")
        .reduce((a, b) => a + b.products.length, 0)
    const productsComplete = statistic.filter(item => item.status === "success")
        .reduce((a, b) => a + b.products.length, 0)

    const getStatistic = async () => {
        setIsLoading(true);
        const api = `orders/statistic`
        try {
            const res = await handleAPI(api);
            if (res.data) {
                setStatistic(res.data);

            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return isLoading ?
        (<>
            <div className="container text-center py-5">
                <Spin />
            </div>
        </>) : (<>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-8">
                        <Card title="Sales OverView">
                            <div className="row">
                                <DashboardStatistic
                                    title="Đơn hàng"
                                    value={statistic.length}
                                    image="https://img.icons8.com/?size=50&id=7492&format=png&color=339AF0"
                                    color="339AF0"
                                />
                                <DashboardStatistic
                                    title="Doanh thu"
                                    value={VND.format(revenue)}
                                    image="https://img.icons8.com/?size=100&id=1gJg-CpQvqUy&format=png&color=CC5DE8"
                                    color="CC5DE8"
                                />
                                <DashboardStatistic
                                    title="Lợi nhuận"
                                    value={VND.format(profit)}
                                    image="https://img.icons8.com/?size=100&id=70641&format=png&color=FCC419"
                                    color="FCC419"
                                />
                                <DashboardStatistic
                                    title="Chi phí"
                                    value={VND.format(cost)}
                                    image="https://img.icons8.com/?size=100&id=SiZYMYfzXNfS&format=png&color=94D82D"
                                    color="94D82D"
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="col-12 col-md-4">
                        <Card title="Delivery OverView">
                            <div className="row">
                                <DashboardStatistic
                                    title="Đang giao"
                                    value={productsDelivered}
                                    image="https://img.icons8.com/?size=50&id=11229&format=png&color=FCC419"
                                    color="FCC419"
                                />
                                <DashboardStatistic
                                    title="Giao thành công"
                                    value={productsComplete}
                                    image="https://img.icons8.com/?size=100&id=IvSuowGLxfbB&format=png&color=CC5DE8"
                                    color="CC5DE8"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
                <PurchaseStatistic />
                <TopSellingAndLowQuantityStatistic />
            </div>
        </>)
}

export default AdminPage;