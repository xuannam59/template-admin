import { ALL_PERMISSIONS } from "@/constants/permissions";
import { useAppSelector } from "@/redux/hook";
import { Menu, MenuProps } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react";
import {
    TbCategory,
    TbHome, TbPackage, TbPackages,
    TbSettings, TbShield, TbShoppingCart, TbSquareRoundedPercentage,
    TbUser,
    TbUsersGroup,
    TbUserShield
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

interface IProp {
    collapsed: boolean,
}

type MenuItem = Required<MenuProps>['items'][number];

const SiderComponent = (props: IProp) => {
    const [activeMenu, setActiveMenu] = useState('');
    const [itemMenu, setItemMenu] = useState<MenuItem[]>([]);
    const permissions = useAppSelector(state => state.auth.user.permissions);
    let location = useLocation();
    useEffect(() => {
        if (location && location.pathname) {
            const allRoute = [
                "", "users", "products",
                "categories", "general-settings", "orders",
                "promotions", "roles", "permissions"];
            const currentRoute = allRoute.find((item) => location.pathname.split("/")[1] === item);
            if (currentRoute) {
                setActiveMenu(currentRoute);
            } else {
                setActiveMenu("dashboard");
            }
        }
    }, [location]);
    const { collapsed } = props;
    useEffect(() => {
        if (permissions.length) {
            const viewProduct = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.PRODUCTS.GET.apiPath
                && item.method === ALL_PERMISSIONS.PRODUCTS.GET.method
            );

            const viewCategory = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.CATEGORIES.GET.apiPath
                && item.method === ALL_PERMISSIONS.CATEGORIES.GET.method
            );

            const viewPromotion = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.PROMOTIONS.GET.apiPath
                && item.method === ALL_PERMISSIONS.PROMOTIONS.GET.method
            );

            const viewUser = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET.method
            );

            const viewRole = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET.method
            );

            const viewPermission = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET.apiPath
                && item.method === ALL_PERMISSIONS.PERMISSIONS.GET.method
            );

            const viewOrder = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.ORDERS.GET.apiPath
                && item.method === ALL_PERMISSIONS.ORDERS.GET.method
            );

            const viewSetting = permissions.find(item =>
                item.apiPath === ALL_PERMISSIONS.SETTINGS.GET.apiPath
                && item.method === ALL_PERMISSIONS.SETTINGS.GET.method
            )

            setItemMenu([
                {
                    key: 'dashboard',
                    icon: <TbHome size={24} />,
                    label: <Link to={'/'}>Dashboard</Link>,
                },
                ...(viewProduct ? [{
                    key: "products",
                    icon: <TbPackage size={24} />,
                    label: <Link to={'/products'}>Products</Link>,
                },] : []),

                ...(viewCategory ? [{
                    key: 'categories',
                    icon: <TbCategory size={24} />,
                    label: <Link to={'/categories'}>Categories</Link>,
                },] : []),

                ...(viewPromotion ? [{
                    key: 'promotions',
                    icon: <TbSquareRoundedPercentage size={24} />,
                    label: <Link to={'/promotions'}>Promotions</Link>,
                },] : []),

                ...(viewUser ? [{
                    key: 'users',
                    icon: <TbUser size={24} />,
                    label: <Link to={'/users'}>Users</Link>,
                },] : []),

                ...(viewRole ? [{
                    key: 'roles',
                    icon: <TbUserShield size={24} />,
                    label: <Link to={'/roles'}>Roles</Link>,
                },] : []),

                ...(viewPermission ? [{
                    key: 'permissions',
                    icon: <TbShield size={24} />,
                    label: <Link to={'/permissions'}>Permissions</Link>,
                },] : []),

                ...(viewOrder ? [{
                    key: 'orders',
                    icon: <TbShoppingCart size={24} />,
                    label: <Link to={'/orders'}>Orders</Link>,
                },] : []),

                ...(viewSetting ? [{
                    key: 'general-settings',
                    icon: <TbSettings size={24} />,
                    label: <Link to={'/general-settings'}>Settings</Link>,
                },] : []),
            ])
        }
    }, []);
    return <>
        <Sider trigger={null} collapsible collapsed={collapsed} width={"220"} style={{ background: "white" }}>
            <div style={{ height: 32, margin: 16, textAlign: 'center', lineHeight: "32px" }}>
                Admin
            </div>
            <Menu
                className="menu-sider"
                defaultSelectedKeys={['dashboard']}
                selectedKeys={[activeMenu]}
                theme="light"
                mode="inline"
                items={itemMenu}
                onClick={(e) => setActiveMenu(e.key)}
                style={{ borderTop: "1px solid #f2f6fa" }}
            />
        </Sider >
    </>
}

export default SiderComponent