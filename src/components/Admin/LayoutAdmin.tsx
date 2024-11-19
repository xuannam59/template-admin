import { Outlet } from "react-router-dom";
import { Layout } from 'antd';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import HeaderComponent from "@/components/Header";
import SiderComponent from "@/components/Sider";
import handleAPI from "@/apis/handleAPI";
import { doGetAccountAction } from "@/redux/reducers/auth.reducer";
import Loading from "@/components/Loading";

const { Content } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');


    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
            >
                <SiderComponent
                    collapsed={collapsed}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                />
                <Layout>
                    <HeaderComponent
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default LayoutAdmin;