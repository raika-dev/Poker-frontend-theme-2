import React, { useEffect, useRef, useReducer, useMemo } from "react";
import { useSelector } from "react-redux";
import { Sprite, useTick } from "@pixi/react";
import {
  convertX,
  convertY,
  convertXX,
  convertYY,
} from "../../../helpers/utils";
import { constGame, constPositions, gameStates } from "../../../config/const";
const reducer = (_, { data }) => data;
const Timer = (props) => {
  const position = props.position;
  const unit = useSelector((state) => state.game.unit);
  const countdown = useSelector(
    (state) => state.game.roomInformation.countdown
  );
  const playerState = useSelector(
    (state) => state.game.roomInformation.players[position].status
  );
  const time = useRef(0);
  const timer = useRef(0);
  const [motion, update] = useReducer(reducer);
  useEffect(() => {
    timer.current = 0;
    time.current = 12;
  }, []);
  useEffect(() => {
    if (playerState === gameStates.active) {
      timer.current = 0;
      time.current = countdown;
    }
  }, [playerState]);

  useTick((delta) => {
    timer.current += playerState == gameStates.active ? delta : 0;
    time.current = Math.max(
      Math.floor(13 - timer.current / constGame.time_timer_duration),
      0
    );
    let pos = { image: "time" + time.current };
    update({
      type: "update",
      data: pos,
    });
  });

  return (
    <>
      {playerState == gameStates.active && (
        <Sprite
          image={"time12"}
          anchor={0.5}
          {...motion}
          x={convertXX(
            constPositions.players[position].avatar.x -
              constPositions.players[position].avatar.w / 2,
            unit
          )}
          y={convertYY(
            constPositions.players[position].avatar.y -
              constPositions.players[position].avatar.h / 2,
            unit
          )}
          width={convertX(
            constPositions.players[position].avatar.w / 1.5,
            unit
          )}
          height={convertY(
            constPositions.players[position].avatar.h / 1.5,
            unit
          )}
        ></Sprite>
      )}
    </>
  );
};

export default Timer;
