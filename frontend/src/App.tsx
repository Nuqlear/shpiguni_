import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Lobby from './components/Lobby';
import EntryPoint from './components/EntryPoint';
import NotFound from './components/NotFound';
import routes from './routes';
import { useAppDispatch, useAppSelector } from "./reactExt/hooks";
import { loadUser } from './store/entities/user/thunk';
import { deltaTimeUpdate } from './store/entities/lobby/actions';

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import './App.css';


let lastUpdateTime = Date.now()

function App() {
    const dispatch = useAppDispatch();
    const store = useAppSelector((state) => state.user);

    setInterval(() => {
      const now = Date.now()
      const deltaTime = now - lastUpdateTime
      lastUpdateTime = now
      dispatch(deltaTimeUpdate(deltaTime))
    }, 50)

    useEffect(() => {
        dispatch(loadUser());
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path={routes.HOME} element={<EntryPoint/>}/>
                <Route path={routes.LOBBY} element={<Lobby/>}/>
                <Route path="/*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
