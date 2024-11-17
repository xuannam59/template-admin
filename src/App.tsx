import { useEffect } from 'react'
import handleAPI from './apis/handleAPI';
import { useAppDispatch, useAppSelector } from './redux/hook';
import { doGetAccountAction } from './redux/reducers/auth.reducer';
import Loading from './components/Loading';
import Routers from './routers/Router';

function App() {
    useEffect(() => {
        getAccount()
    }, []);
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(state => state.auth.isLoading);

    const getAccount = async () => {
        if (window.location.pathname.startsWith("/auth")) return;
        const api = "/auth/account"
        const res = await handleAPI(api)
        if (res && res.data) {
            dispatch(doGetAccountAction(res.data))
        }
    }
    return (isLoading === false || window.location.pathname.startsWith("/auth") ?
        <Routers />
        :
        <Loading />
    )
}

export default App
