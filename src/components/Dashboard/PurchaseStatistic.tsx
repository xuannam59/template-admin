import handleAPI from "@/apis/handleAPI";
import { Card, Radio } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
const PurchaseStatistic = () => {
    const [timeTypeSelected, setTimeTypeSelected] = useState<"week" | "month" | "year">("month");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{
        date: string,
        purchase: number,
        orderTotal: number,
        delivered: number
    }[]>([]);

    useEffect(() => {
        if (timeTypeSelected) {
            const start = dayjs().startOf(timeTypeSelected);
            const end = dayjs().endOf(timeTypeSelected);
            let number = end.diff(start, "day") + 1;
            getPurchase(start.format(), end.format(), number <= 31 ? number : 12);
        }
    }, [timeTypeSelected]);

    const getPurchase = async (start: string, end: string, numbers: number) => {
        setIsLoading(true);
        const api = `orders/purchase-statistic?start=${start}&end=${end}&numbers=${numbers}`;
        try {
            const res = await handleAPI(api);
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
            },
            title: {
                display: true,
            },
        },
    };

    return (<>
        <div className="row mt-4">
            <div className="col-12 col-md-6">
                <Card
                    loading={isLoading}
                    title="Purchase"
                    extra={<>
                        <Radio.Group
                            value={timeTypeSelected}
                            onChange={e => setTimeTypeSelected(e.target.value)}
                            options={[
                                { label: 'Weekly', value: "week" },
                                { label: 'Monthly', value: "month" },
                                { label: 'Yearly', value: "year" },
                            ]}
                            optionType="button"
                        />
                    </>}
                >
                    <Bar
                        data={{
                            labels: data.map(item => dayjs(item.date)
                                .format(`${timeTypeSelected == "year" ? "MM/YYYY" : "DD/MM"}`)),
                            datasets: [{
                                label: "Purchase",
                                data: data.map(item => item.purchase),
                                backgroundColor: "rgba(54, 162, 235, 0.2)",
                                borderColor: "rgba(54, 162, 235, 1)"
                            }]
                        }}
                        options={options}
                    />
                </Card>
            </div>
            <div className="col-12 col-md-6">
                <Card
                    loading={isLoading}
                    title={"Order Summary"}
                >
                    <Line
                        options={options}
                        data={{
                            labels: data.map(item => dayjs(item.date)
                                .format(`${timeTypeSelected == "year" ? "MM/YYYY" : "DD/MM"}`)),
                            datasets: [
                                {
                                    fill: true,
                                    label: "Orders",
                                    data: data.map(item => item.orderTotal),
                                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                                    borderColor: "rgba(54, 162, 235, 1)"
                                },
                                {
                                    label: "Delivered",
                                    data: data.map(item => item.delivered),
                                    backgroundColor: "rgba(93, 170, 49, 0.2)",
                                    borderColor: "rgba(93, 170, 49, 1)"
                                }
                            ]
                        }}
                    />
                </Card>
            </div>
        </div>
    </>
    )
}

export default PurchaseStatistic