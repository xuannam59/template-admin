import { Typography } from "antd"

interface IProps {
  title: string
  value: number | string,
  image: string
  color?: string;
}

const { Paragraph } = Typography
const DashboardStatistic = (props: IProps) => {
  const { title, value, image, color } = props;
  return (
    <div className="col text-center">
      <div className="d-flex justify-content-center align-items-center mb-2">
        <div
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            backgroundColor: `#${color}1a`
          }}>
          <img
            style={{
              width: "50%",
              height: "auto",
            }}
            src={image}
            alt={title}
          />
        </div>
      </div>
      <div className={"text-center"}>
        <Paragraph
          className="mb-0 fs-6"
          type="secondary"
        >{value}</Paragraph>
        <Paragraph
          className="mb-0 fs-6"
          type="secondary"
        >{title}</Paragraph>
      </div>
    </div>
  )
}

export default DashboardStatistic