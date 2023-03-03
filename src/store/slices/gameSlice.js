import { createSlice } from "@reduxjs/toolkit";
import { gameStates } from "../../config/const";
import { positionOfPlayer } from "../../helpers/utils";
const initialState = {
  buyInModal: -1,
  gameState: gameStates.preLoading,
  unit: 8,
  socketState: false,
  mainInformation: {
    name: "",
    balance: "",
    avatarUrl: "",
    address: "",
    position: -1,
  },
  tableInformation: [],
  roomInformation: {
    id: 0,
    name: "",
    type: "",
    smallBlind: 0,
    bigBlind: 0,
    round: 0,
    pot: 0,
    currentBet: 0,
    minRaise: 0,
    dealerId: 0,
    currentPlayerId: 0,
    countdown: null,
    status: "",
    communityCards: [],
    players: [],
  },
};
export const gameSlice = createSlice({
  name: "gameSlice",
  initialState: initialState,
  reducers: {
    setInitialState: (state, action) => {
      state = initialState;
    },
    setBuyInModal: (state, action) => {
      state.buyInModal = action.payload;
    },
    setPageState: (state, action) => {
      state.gameState = action.payload;
    },
    setSocketState: (state, action) => {
      state.socketState = action.payload;
    },
    setUnit: (state, action) => {
      state.unit =
        action.payload.width / 240 < action.payload.height / 135
          ? action.payload.width / 240
          : action.payload.height / 135;
    },
    setMainInformation: (state, action) => {
      state.mainInformation = action.payload;
    },
    setTableInformation: (state, action) => {
      state.tableInformation = action.payload;
    },
    setRoomInformation: (state, action) => {
      let myPosition = action.payload.players
        .map((player) => player.address)
        .indexOf(state.mainInformation.address);
      if (myPosition !== -1) {
        let players = [];
        for (let i = 0; i < 6; i++) {
          players[i] = action.payload.players[positionOfPlayer(myPosition, i)];
        }

        state.roomInformation = {
          ...action.payload,
          players,
          dealerId: positionOfPlayer(myPosition, action.payload.dealerId),
          currentPlayerId: positionOfPlayer(
            myPosition,
            action.payload.currentPlayerId
          ),
        };
      } else state.roomInformation = action.payload;
    },
    setPosition: (state, action) => {
      state.mainInformation.position = action.payload;
    },
    setGameState: (state, action) => {
      state.roomInformation.status = action.payload;
    },
    setNextTurn: (state, action) => {
      for (let i = 1; i <= 6; i++) {
        if (
          state.roomInformation.players[
            (state.roomInformation.currentPlayerId + i) % 6
          ].position > -1
        ) {
          state.roomInformation.currentPlayerId =
            (state.roomInformation.currentPlayerId + i) % 6;
          return;
        }
      }
    },
  },
});

export const {
  setInitialState,
  setBuyInModal,
  setPageState,
  setUnit,
  setSocketState,
  setPosition,
  setMainInformation,
  setTableInformation,
  setRoomInformation,
  setGameState,
  setNextTurn,
} = gameSlice.actions;

export default gameSlice.reducer;
