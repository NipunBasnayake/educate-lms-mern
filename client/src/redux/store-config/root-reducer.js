import {combineReducers} from "@reduxjs/toolkit"
import authSlice from "../features/authSlice";
import unitsSlice from "../features/unitsSlice"

const rootReducer = combineReducers({
    auth: authSlice,
    units: unitsSlice,
});


export default rootReducer;