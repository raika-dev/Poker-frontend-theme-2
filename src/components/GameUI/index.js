import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { gameStates } from "../../config/const";
import ReactSlider from "react-slider";
import Modal from "react-modal";
import { socketHooks } from "../SocketProvider";
import { setBuyInModal, setPosition } from "../../store/slices/gameSlice";
Modal.setAppElement("body");

const GameUI = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.game.unit);
  const isModalOpen = useSelector((state) => state.game.buyInModal);

  const bigBlind = useSelector((state) => state.game.roomInformation.bigBlind);
  const [buyInValue, setBuyInValue] = useState(1);
  const balance = useSelector((state) => state.game.mainInformation.balance);
  const mins = useSelector((state) => state.game.roomInformation.minRaise);
  const address = useSelector((state) => state.game.mainInformation.address);
  const id = useSelector((state) => state.game.roomInformation.id);
  const currentBet = useSelector(
    (state) => state.game.roomInformation.currentBet
  );
  const pageState = useSelector((state) => state.game.mainInformation.status);
  const myPosition = useSelector(
    (state) => state.game.mainInformation.position
  );
  const player = useSelector((state) => state.game.roomInformation.players[0]);
  const stack = player ? player.stack : 10;
  const betAmount = player ? player.betAmount : 0;
  const gameState = player ? player.status : gameStates.wait;
  const [spinnerValue, setSpinnerValue] = useState(0);
  const minRaise = player ? mins : 1;

  useEffect(() => {
    handleSpinner(minRaise);
    setBuyInValue(bigBlind * 10);
    return () => {};
  }, [minRaise, player, bigBlind]);
  const setModalOpen = (e) => {
    dispatch(setBuyInModal(e));
  };
  const handleJoinRoom = (position) => {
    socketHooks.emitJoinRoom({
      address,
      tableId: id,
      buyIn: buyInValue,
      position,
    });
    setModalOpen(-1);
    dispatch(setPosition(position));
  };
  const handleFold = () => {
    if (gameState === gameStates.active) {
      socketHooks.emitFold({ address, id });
    }
  };
  const handleCheck = () => {
    if (gameState === gameStates.active) {
      socketHooks.emitCheck({ address, id });
    }
  };
  const handleCall = () => {
    if (gameState === gameStates.active) {
      socketHooks.emitCall({ address, id });
    }
  };
  const handleAllIn = () => {
    if (gameState === gameStates.active) {
      socketHooks.emitAllIn({ address, id });
    }
  };
  const handleRaise = () => {
    if (gameState === gameStates.active) {
      socketHooks.emitRaise({ address, id, amount: spinnerValue });
    }
  };
  const handleSpinner = (e) => {
    let result =
      e < minRaise ? minRaise : e > stack + betAmount ? stack + betAmount : e;
    setSpinnerValue(result);
  };

  return (
    <>
      {pageState !== gameStates.preLoading && (
        <>
          <div className="game-ui">
            <div
              className={
                myPosition > -1 &&
                gameState !== gameStates.join &&
                gameState === gameStates.active
                  ? "action"
                  : "action active"
              }
            >
              <div className={"action-buttons"}>
                <button id="btnFold" onClick={handleFold}>
                  FOLD
                </button>
                <button
                  id="btnCheck"
                  onClick={
                    player && currentBet == player.betAmount
                      ? handleCheck
                      : handleCall
                  }
                >
                  {player && currentBet == player.betAmount ? "CHECK" : "CALL"}
                </button>
                <button
                  id="btnRaise"
                  onClick={
                    minRaise > stack + betAmount ? handleAllIn : handleRaise
                  }
                >
                  {spinnerValue == stack + betAmount
                    ? "ALL IN"
                    : currentBet == 0 && player && player.betAmount == 0
                    ? "BET"
                    : "RAISE"}
                </button>
              </div>
              <div className="action-spinner">
                <ReactSlider
                  className="spinner-back"
                  thumbClassName="spinner-ball"
                  trackClassName="spinner-track"
                  value={Number(spinnerValue)}
                  orientation="vertical"
                  invert
                  min={0}
                  max={stack + betAmount}
                  onChange={(e) => {
                    handleSpinner(e);
                  }}
                />
              </div>
            </div>

            <div className="spinner-text">{spinnerValue}</div>
            <button
              id="btnLeave"
              onClick={() => {
                window.location.href = "/";
              }}
            ></button>
            <button id="btnSetting"></button>
            <button id="btnChat"></button>
            {/* <button id="btnChip"></button> */}
          </div>
          <Modal
            className="buy-in-modal"
            isOpen={isModalOpen > -1}
            onRequestClose={() => setModalOpen(-1)}
          >
            <ReactSlider
              className="buyin-slider"
              thumbClassName="slider-thumb"
              trackClassName="slider-track"
              markClassName="slider-mark"
              value={buyInValue}
              min={bigBlind * 10}
              max={Number(balance)}
              onChange={(e) => {
                setBuyInValue(e);
              }}
              renderThumb={(props, state) => (
                <div {...props}>
                  <div className="value-text">{state.valueNow}</div>
                </div>
              )}
            />
            <div>
              <button
                id="btnStart"
                onClick={() => {
                  handleJoinRoom(isModalOpen);
                }}
              ></button>
              <button
                id="btnCancel"
                onClick={() => {
                  setModalOpen(-1);
                }}
              ></button>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default GameUI;
