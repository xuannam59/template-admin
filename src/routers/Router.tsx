import LayoutAdmin from "@/components/Admin/LayoutAdmin";
import LayoutAuth from "@/components/Auth/LayoutAuth";
import NotFound from "@/components/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminPage from "@/pages/Dashboard";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserPage from "@/pages/User";
import ProductPage from "@/pages/Product";
import CategoryPage from "@/pages/Category";
import OrderPage from "@/pages/Order";
import GeneralSettingPage from "@/pages/GeneralSettings";
import Promotions from "@/pages/Promotions";
import CreateUpdateProduct from "@/pages/Product/CreateUpdateProduct";
import FakeProducts from "@/pages/Product/FakeProducts";


const Routers = () => {
    return (
        <>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                }}
            >
                <Routes>
                    <Route path="auth" element={<LayoutAuth />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                    </Route>
                    <Route path="/" element={<ProtectedRoute><LayoutAdmin /></ProtectedRoute>} >
                        <Route index element={<AdminPage />} />
                        <Route path="/users" element={<UserPage />} />
                        <Route path="products"  >
                            <Route index element={<ProductPage />} />
                            <Route path="create" element={<CreateUpdateProduct />} />
                            <Route path="update/:id" element={<CreateUpdateProduct />} />
                            <Route path="fake" element={<FakeProducts />} />
                        </Route>
                        <Route path="/categories" element={<CategoryPage />} />
                        <Route path="/orders" element={<OrderPage />} />
                        <Route path="/general-settings" element={<GeneralSettingPage />} />
                        <Route path="/promotions" element={<Promotions />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routers;
