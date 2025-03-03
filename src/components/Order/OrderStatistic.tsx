import { VND } from "@/helpers/handleCurrency";
import { Typography } from "antd";

interface IProps {
    title: string,
    value: number,
    total?: number,
    label: string;
    desc?: string;
    color: string;
}

const { Paragraph, Title, Text } = Typography

const OrderStatistic = (props: IProps) => {
    const { title, value, total, label, desc, color } = props
    return (
        <div className="col px-4">
            <Paragraph style={{ fontWeight: "500", color: color ?? 'coral' }}>
                {title}
            </Paragraph>
            <div className="d-flex justify-content-between">
                <Title level={4} className=" m-0">{value}</Title>
                {total &&
                    <Title level={4} className=" m-0"> {VND.format(total)}</Title>
                }
            </div>
            <div className="d-flex justify-content-between mt-1">
                <Text type="secondary">{label}</Text>
                {desc &&
                    <Text type="secondary"> {desc}</Text>
                }
            </div>
        </div>
    )
}

export default OrderStatistic