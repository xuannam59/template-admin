import { useAppSelector } from "@/redux/hook";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPremissted";


const RoleBaseRoute = (props: any) => {
    const user = useAppSelector(state => state.auth.user);
    const userRole = user.role;
    if (userRole.name === "ADMIN") {
        return <>{props.children}</>
    } else {
        return (<NotPermitted />)
    }
}

const ProtectedRoute = (props: any) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return (isAuthenticated === true ?
        <>
            <RoleBaseRoute>
                {props.children}
            </RoleBaseRoute>
        </>
        : <Navigate to={"/auth/login"} />
    )
}

export default ProtectedRoute;