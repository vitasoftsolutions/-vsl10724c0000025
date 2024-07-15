import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";
import authSlice from "./services/auth/authSlice";
import cashRegisterSlice from "./services/cashRegister/cashRegisterSlice";
import developerSlice from "./services/developer/developerSlice";
import drawerSlice from "./services/drawer/drawerSlice";
import loaderSlice from "./services/loader/loaderSlice";
import menuSlice from "./services/menu/menuSlice";
import notificationSlice from "./services/notification/notificationSlice";
import paginationSlice from "./services/pagination/paginationSlice";
import paramSlice from "./services/paramSlice/paramSlice";
import pettyCashSlice from "./services/pettycash/pettyCashSlice";
import posSlice from "./services/pos/posSlice";
import productSlice from "./services/product/productSlice";
import themeSlice from "./services/theme/themeSlice";

const persistConfig = {
  key: ["auth", "theme", "developer", "menu", "pettycash", "notification"],
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);
const persistedThemeReducer = persistReducer(persistConfig, themeSlice);
const persistedMenuItems = persistReducer(persistConfig, menuSlice);
const persistedNotification = persistReducer(persistConfig, notificationSlice);
const persistedPosReducer = persistReducer(persistConfig, posSlice);
const persistedDeveloperReducer = persistReducer(persistConfig, developerSlice);

// const persistedPaginationReducer = persistReducer(
//   persistConfig,
//   paginationSlice
// );

const persistedCashRegister = persistReducer(persistConfig, cashRegisterSlice);

const persistePettyCash = persistReducer(persistConfig, pettyCashSlice);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    menu: persistedMenuItems,
    notification: persistedNotification,
    pos: persistedPosReducer,
    developer: persistedDeveloperReducer,
    param: paramSlice,
    loader: loaderSlice,
    pagination: paginationSlice,
    cashRegister: persistedCashRegister,
    pettyCash: persistePettyCash,
    drawer: drawerSlice,
    product: productSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
