
import { Outlet, } from "react-router-dom"

const LayoutAuth = () => {

    return (
        <>
            <div style={{ backgroundColor: "#E9ECFB" }}>
                <div className="container">
                    <div className="row justify-content-center align-items-center vh-100">
                        <div className="col-sm col-md-8 col-lg-6 col-xl-5 col-xxl-5">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LayoutAuth;

