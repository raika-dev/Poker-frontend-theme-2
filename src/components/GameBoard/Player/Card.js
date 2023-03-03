import React, { useEffect, useRef, useReducer } from "react";
import { useSelector } from "react-redux";
import { Sprite, useTick } from "@pixi/react";
import {
  animation,
  convertX,
  convertY,
  convertXX,
  convertYY,
} from "../../../helpers/utils";
import {
  constPositions,
  constGame,
  gameStates,
  constAnimations,
} from "../../../config/const";
const reducer = (_, { data }) => data;
const Card = (props) => {
  const position = props.position;
  const id = props.id;
  const dealer = useSelector((state) => state.game.roomInformation.dealerId);
  const unit = useSelector((state) => state.game.unit);
  const gameState = useSelector((state) => state.game.roomInformation.status);
  const players = useSelector((state) => state.game.roomInformation.players);
  const animationState = useRef(0);
  const timer = useRef(0);
  let delay = 0;
  for (let i = 0; i < players.length; i++) {
    let cur = (dealer + i + 1) % 6;
    if (players[i].position > -1) delay++;
    if (position == cur) break;
  }
  delay +=
    id *
    players.filter((player) => {
      return player.position !== -1;
    }).length;
  const [motionCard, updateCard] = useReducer(reducer);
  useEffect(() => {
    animationState.current = constAnimations.card.idle;
    timer.current = 0;
  }, []);
  useEffect(() => {
    if (gameState == gameStates.preflop) {
      timer.current = 0;
      animationState.current = constAnimations.card.preflop;
    }
  }, [gameState]);
  useEffect(() => {
    if (
      players[position].status == gameStates.fold ||
      players[position].status == gameStates.join
    ) {
      timer.current = 0;
      animationState.current = constAnimations.card.hide;
    }
  }, [players[position].status]);
  useEffect(() => {
    if (
      timer.current >=
        constGame.time_card_move + delay * constGame.time_card_delay &&
      animationState.current === constAnimations.card.preflop
    ) {
      timer.current = 0;
      animationState.current = constAnimations.card.raise;
    }
    return () => {};
  }, [timer.current]);
  useTick((delta) => {
    timer.current += delta;
    let pos;
    if (animationState.current == constAnimations.card.preflop)
      pos = {
        x: animation(
          convertXX(constPositions.players[dealer].avatar.x, unit),
          convertXX(
            constPositions.players[position].information.x + 70 * id + 15,
            unit
          ),
          constGame.time_card_move,
          timer.current,
          1,
          delay * constGame.time_card_delay
        ),
        y: animation(
          convertYY(constPositions.players[dealer].avatar.y, unit),
          convertYY(constPositions.players[position].information.y, unit),
          constGame.time_card_move,
          timer.current,
          1,
          delay * constGame.time_card_delay
        ),
        alpha: animation(
          0,
          1,
          constGame.time_card_move,
          timer.current,
          1,
          delay * constGame.time_card_delay
        ),
        image: "card-back",
      };
    else if (animationState.current == constAnimations.card.raise)
      pos = {
        x: animation(
          convertXX(
            constPositions.players[position].information.x + 70 * id + 15,
            unit
          ),
          convertXX(
            constPositions.players[position].information.x + 70 * id + 15,
            unit
          ),
          constGame.time_card_raise,
          timer.current
        ),
        y: animation(
          convertYY(constPositions.players[position].information.y, unit),
          convertYY(constPositions.players[position].information.y - 100, unit),
          constGame.time_card_raise,
          timer.current
        ),
        alpha: animation(1, 1, constGame.time_card_raise, timer.current),
        image:
          players[position].cards.length > 0
            ? "card" + players[position].cards[id]
            : "card-back",
      };
    else if (animationState.current == constAnimations.card.idle)
      pos = {
        x: convertXX(
          constPositions.players[position].information.x + 70 * id + 15,
          unit
        ),
        y: convertYY(
          constPositions.players[position].information.y - 100,
          unit
        ),
        alpha: gameState == gameStates.preWaiting ? 0 : 1,
        image:
          players[position].cards.length > 0
            ? "card" + players[position].cards[id]
            : "card-back",
      };
    else if (animationState.current == constAnimations.card.hide)
      pos = {
        x: 0,
        y: 0,
        alpha: 0,
        image: "card-back",
      };
    updateCard({
      type: "updateCard",
      data: pos,
    });
  });

  return (
    <Sprite
      image="card-back"
      width={convertX(84, unit)}
      height={convertY(118, unit)}
      {...motionCard}
    ></Sprite>
  );
};

export default Card;
