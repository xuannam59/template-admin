import { Menu, MenuProps } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react";
import {
    TbCategory,
    TbHome, TbPackage, TbPackages,
    TbSettings, TbSquareRoundedPercentage,
    TbUsersGroup
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

interface IProp {
    collapsed: boolean,
}

type MenuItem = Required<MenuProps>['items'][number];

const SiderComponent = (props: IProp) => {
    const [activeMenu, setActiveMenu] = useState('');
    let location = useLocation();
    useEffect(() => {
        if (location && location.pathname) {
            const allRoute = [
                "", "users", "products",
                "categories", "general-settings", "orders",
                "promotions"];
            const currentRoute = allRoute.find((item) => location.pathname.split("/")[1] === item);
            if (currentRoute) {
                setActiveMenu(currentRoute);
            } else {
                setActiveMenu("dashboard");
            }
        }
    }, [location]);
    const { collapsed } = props;
    const items: MenuItem[] = [
        {
            key: 'dashboard',
            icon: <TbHome size={24} />,
            label: <Link to={'/'}>Dashboard</Link>,
        },
        {
            key: "products",
            icon: <TbPackage size={24} />,
            label: <Link to={'/products'}>Products</Link>,
        },
        {
            key: 'categories',
            icon: <TbCategory size={24} />,
            label: <Link to={'/categories'}>Categories</Link>,
        },
        {
            key: 'promotions',
            icon: <TbSquareRoundedPercentage size={24} />,
            label: <Link to={'/promotions'}>Promotions</Link>,
        },
        {
            key: 'users',
            icon: <TbUsersGroup size={24} />,
            label: <Link to={'/users'}>Users</Link>,
        },
        {
            key: 'orders',
            icon: <TbPackages size={24} />,
            label: <Link to={'/orders'}>Order</Link>,
        },
        {
            key: 'general-settings',
            icon: <TbSettings size={24} />,
            label: <Link to={'/general-settings'}>Settings</Link>,
        },
    ]
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
                items={items}
                onClick={(e) => setActiveMenu(e.key)}
                style={{ borderTop: "1px solid #f2f6fa" }}
            />
        </Sider >
    </>
}

export default SiderComponent