import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { CustomStage } from "../CustomStage";

import LoadingScene from "../scenes/LoadingScene";
import GameScene from "../scenes/GameScene";

import { setUnit } from "../store/slices/gameSlice";
import { gameStates } from "../config/const";
import GameUI from "../components/GameUI";
const Game = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game.gameState);
  useEffect(() => {
    const update = () => {
      requestAnimationFrame(() =>
        dispatch(
          setUnit({ width: window.innerWidth, height: window.innerHeight })
        )
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <GameUI></GameUI>
      <CustomStage
        options={{
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          resizeTo: window,
        }}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        {gameState == gameStates.preLoading ? <LoadingScene /> : <GameScene />}
      </CustomStage>
    </>
  );
};

export default Game;
