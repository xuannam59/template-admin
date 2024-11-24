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
import AddProduct from "@/pages/Product/AddProduct";
import UpdateProduct from "@/pages/Product/UpdateProduct";
import CategoryPage from "@/pages/Category";


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
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/products/update-product/:id" element={<UpdateProduct />} />
                        <Route path="/categories" element={<CategoryPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routers;
