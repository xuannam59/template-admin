import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPage from "../pages/auth/FogotPage";

const AuthRouter = () => {
    return (
        <>
            <div className="background">
                <div className="container">
                    <div className="row justify-content-center align-items-center vh-100">
                        <div className="col-sm col-md-8 col-lg-6 col-xl-5 col-xxl-5">
                            <BrowserRouter
                                future={{
                                    v7_startTransition: true,
                                    v7_relativeSplatPath: true
                                }}
                            >
                                <Routes>
                                    <Route path="/admin/login" element={<LoginPage />} />
                                    <Route path="/admin/sign-up" element={<RegisterPage />} />
                                    <Route path="/admin/forgot" element={<ForgotPage />} />
                                    <Route path="*" element="404" />
                                </Routes>
                            </BrowserRouter>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthRouter;