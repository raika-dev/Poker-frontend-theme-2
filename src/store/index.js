import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "./slices/gameSlice";

const store = configureStore({
  reducer: { game: gameSlice },
});

export default store;
