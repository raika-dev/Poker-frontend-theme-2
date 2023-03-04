import { Container, Sprite, useTick, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import ChipValue from "../ChipValue";
import React, {
  useEffect,
  useRef,
  useReducer,
  useLayoutEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import {
  constPositions,
  constGame,
  gameStates,
  constAnimations,
} from "../../../config/const";
import {
  convertX,
  convertXX,
  convertY,
  convertYY,
  getChipArray,
  helperPosition,
  animation,
} from "../../../helpers/utils";
const reducer = (_, { data }) => data;

const Chip = (props) => {
  const position = props.position;
  const unit = useSelector((state) => state.game.unit);
  const betAmount = useSelector(
    (state) => state.game.roomInformation.players[position].betAmount
  );
  const players = useSelector((state) => state.game.roomInformation.players);
  const playerState = useSelector(
    (state) => state.game.roomInformation.players[position].status
  );
  const prize = useSelector(
    (state) => state.game.roomInformation.players[position].prize
  );
  const gameState = useSelector((state) => state.game.roomInformation.status);
  const pot = useSelector((state) => state.game.roomInformation.pot);
  const plusAmounts = useSelector(
    (state) => state.game.roomInformation.plusBet
  );
  const plusAmount =
    playerState === gameStates.bet
      ? plusAmounts
      : gameState == gameStates.over
      ? prize
      : gameState == gameStates.flop ||
        gameState == gameStates.turn ||
        gameState == gameStates.river ||
        gameState == gameStates.final
      ? betAmount
      : 0;
  const chipList = getChipArray(betAmount);
  const plusList = getChipArray(plusAmount);
  const originList = getChipArray(betAmount - plusAmount);
  // const potList = getChipArray(pot);
  const [motionChip, updateChip] = useReducer(reducer);

  const timer = useRef(0);
  const animationState = useRef(0);
  const isFinishBet = useRef(0);
  const isShowTotal = useRef(0);
  const totalList = useRef(0);

  useEffect(() => {
    timer.current = 0;
    animationState.current = constAnimations.chip.idle;
    isFinishBet.current = 1;
    isShowTotal.current = 0;
    totalList.current = 0;
    return () => {};
  }, []);

  useMemo(() => {
    if (
      timer.current > constGame.time_chip_bet &&
      animationState.current == constAnimations.chip.bet
    ) {
      animationState.current = constAnimations.chip.idle;
      isFinishBet.current = 1;
    } else if (
      timer.current > constGame.time_chip_over &&
      animationState.current == constAnimations.chip.over
    ) {
      animationState.current = constAnimations.chip.idle;
      isShowTotal.current = 1;
      let total = 0;
      for (let i = 0; i < 6; i++) {
        total += players[i].betAmount;
      }
      totalList.current = total + pot;
    } else if (
      timer.current > constGame.time_chip_reward &&
      animationState.current == constAnimations.chip.reward
    ) {
      animationState.current = constAnimations.chip.idle;
    }
  }, [timer.current]);
  useMemo(() => {
    if (playerState === gameStates.bet) {
      animationState.current = constAnimations.chip.bet;
      timer.current = 0;
      isFinishBet.current = 0;
    }
    if (
      !(
        gameState === gameStates.flop ||
        gameState === gameStates.turn ||
        gameState === gameStates.river ||
        gameState === gameStates.final
      )
    ) {
      totalList.current = pot;
    }
    if (
      gameState === gameStates.flop ||
      gameState === gameStates.turn ||
      gameState === gameStates.river ||
      gameState === gameStates.final
    ) {
      animationState.current = constAnimations.chip.over;
      isFinishBet.current = 0;
      timer.current = 0;
    }
    if (gameState === gameStates.over) {
      animationState.current = constAnimations.chip.reward;
      timer.current = 0;
      isShowTotal.current = 0;
    }
  }, [playerState, gameState]);
  useTick((delta) => {
    timer.current += delta;
    let pos;
    if (animationState.current == constAnimations.chip.bet) {
      pos = {
        x: animation(
          convertXX(constPositions.players[position].avatar.x, unit),
          convertXX(constPositions.players[position].chip.x, unit),
          constGame.time_chip_bet,
          timer.current
        ),
        y: animation(
          convertYY(constPositions.players[position].avatar.y, unit),
          convertYY(constPositions.players[position].chip.y, unit),
          constGame.time_chip_bet,
          timer.current
        ),
        alpha: 1,
      };
    } else if (animationState.current == constAnimations.chip.idle)
      pos = {
        x: 0,
        y: 0,
        alpha: 0,
      };
    else if (animationState.current == constAnimations.chip.over) {
      pos = {
        x: animation(
          convertXX(constPositions.players[position].chip.x, unit),
          convertXX(constPositions.pot.x, unit),
          constGame.time_chip_over,
          timer.current
        ),
        y: animation(
          convertYY(constPositions.players[position].chip.y, unit),
          convertYY(constPositions.pot.y, unit),
          constGame.time_chip_over,
          timer.current
        ),
        alpha: 1,
      };
    } else if (animationState.current == constAnimations.chip.reward) {
      pos = {
        x: animation(
          convertXX(constPositions.pot.x, unit),
          convertXX(constPositions.players[position].avatar.x, unit),
          constGame.time_chip_reward,
          timer.current,
          5
        ),
        y: animation(
          convertYY(constPositions.pot.y, unit),
          convertYY(constPositions.players[position].avatar.y, unit),
          constGame.time_chip_reward,
          timer.current,
          5
        ),
        alpha: 1,
      };
    }
    updateChip({
      type: "updateChip",
      data: {
        x: pos.x,
        y: pos.y,
        alpha: pos.alpha,
      },
    });
  });
  let hPlus = 0;
  let hOrigin = 0;
  let hChip = 0;

  return (
    <>
      {isFinishBet.current ? (
        <Container
          x={helperPosition(constPositions.players[position].chip, unit).x}
          y={helperPosition(constPositions.players[position].chip, unit).y}
        >
          <ChipValue
            text={betAmount ? "$" + betAmount : ""}
            x={convertX(position < 4 ? 20 : -20, unit)}
            y={convertY(-18, unit)}
            anchor={position < 4 ? { x: 0, y: 0 } : { x: 1, y: 0 }}
            fontSize={unit * 2.7}
          ></ChipValue>
          {chipList.map((item, itemkey) => {
            return item.count.map((it, itkey) => {
              hChip += 4;
              return (
                <Sprite
                  key={itemkey + itkey}
                  image={"chip" + item.value}
                  anchor={0.5}
                  x={convertX(0, unit)}
                  y={convertY(-hChip - itkey * 1, unit)}
                  width={convertX(36, unit)}
                  height={convertY(28, unit)}
                ></Sprite>
              );
            });
          })}
        </Container>
      ) : (
        <Container
          x={helperPosition(constPositions.players[position].chip, unit).x}
          y={helperPosition(constPositions.players[position].chip, unit).y}
        >
          <ChipValue
            text={
              betAmount - plusAmount > 0 ? "$" + (betAmount - plusAmount) : ""
            }
            x={convertX(position < 4 ? 20 : -20, unit)}
            y={convertY(-18, unit)}
            anchor={position < 4 ? { x: 0, y: 0 } : { x: 1, y: 0 }}
            fontSize={unit * 2.7}
          ></ChipValue>
          {originList.map((item, itemkey) => {
            return item.count.map((it, itkey) => {
              hOrigin += 4;
              return (
                <Sprite
                  key={itemkey + itkey}
                  image={"chip" + item.value}
                  anchor={0.5}
                  x={convertX(0, unit)}
                  y={convertY(-hOrigin - itkey * 1, unit)}
                  width={convertX(36, unit)}
                  height={convertY(28, unit)}
                ></Sprite>
              );
            });
          })}
        </Container>
      )}
      <Container {...motionChip}>
        {plusList.map((item, itemkey) => {
          return item.count.map((it, itkey) => {
            hPlus += 4;
            return (
              <Sprite
                key={itemkey + itkey}
                image={"chip" + item.value}
                anchor={0.5}
                x={convertX(0, unit)}
                y={convertY(-hPlus - itkey * 1, unit)}
                width={convertX(36, unit)}
                height={convertY(28, unit)}
              ></Sprite>
            );
          });
        })}
      </Container>

      {position == 0 && isShowTotal.current == 1 && (
        <Container
          x={convertXX(constPositions.pot.x, unit)}
          y={convertYY(constPositions.pot.y, unit)}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <ChipValue
            text={totalList.current ? "Total Pot: $" + totalList.current : ""}
            x={convertX(-48, unit)}
            y={convertY(-15, unit)}
            anchor={{ x: 1, y: 0 }}
            fontSize={unit * 2.7}
          ></ChipValue>
          {getChipArray(totalList.current).map((item, itemkey) => {
            let hPot = 0;
            return item.count.map((it, itkey) => {
              hPot += 4;
              return (
                <Sprite
                  key={itemkey + itkey}
                  image={"chip" + item.value}
                  anchor={0.5}
                  x={convertX(itemkey * 35, unit)}
                  y={convertY(-hPot - itkey * 1, unit)}
                  width={convertX(36, unit)}
                  height={convertY(28, unit)}
                ></Sprite>
              );
            });
          })}
        </Container>
      )}
    </>
  );
};
export default Chip;
