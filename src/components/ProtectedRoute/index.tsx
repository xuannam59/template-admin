import { useAppSelector } from "@/redux/hook";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return (isAuthenticated === true ?
        <>
            {props.children}
        </>
        : <Navigate to={"/auth/login"} />
    )
}

export default ProtectedRoute;