import {configureStore} from '@reduxjs/toolkit'
import {calculatorAPI} from "./services/calculatorApi.ts";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [calculatorAPI.reducerPath]: calculatorAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(calculatorAPI.middleware)
})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch