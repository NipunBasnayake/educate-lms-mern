import { configureStore } from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import rootReducer from "./root-reducer";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: true,
        immutableCheck: true,
    }),
    devTools: import.meta.env.VITE_NODE_ENV !== "production",
})

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;