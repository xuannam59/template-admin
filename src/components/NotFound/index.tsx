import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const naviagte = useNavigate();
    return <>
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => naviagte(-1)}>Trở lại</Button>}
        />

    </>
}

export default NotFound;