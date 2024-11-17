import { HashLoader } from "react-spinners";

const Loading = () => {
    return <>
        <HashLoader
            color="#54bc8a"
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}
        />
    </>
}

export default Loading;