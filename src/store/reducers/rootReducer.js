import authReducer from "./authReducer";
import userReducer from "./userReducer";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { persistReducer } from "redux-persist";
import appReducer from "./appReducer";
import postReducer from "./postReducer"
import appointmentReducer from './appointmentReducer'
import chatReducer from './chatReducer'
import messageReducer from "./messageReducer";
import notificationReducer from "./notificationReducer"
const commonConfig = {
    storage,
    stateRrconciler: autoMergeLevel2,
};
const authConfig = {
    ...commonConfig,
    key: "auth",
    whitelist: ["isLoggedIn", "token"],
};

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    user: userReducer,
    app: appReducer,
    post: postReducer,
    appointments: appointmentReducer,
    chat: chatReducer,
    message: messageReducer,
    notification: notificationReducer,

});

export default rootReducer;