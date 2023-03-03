import React, { useEffect, useRef, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Sprite, useTick, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import * as PIXI from "pixi.js";
import {
  convertX,
  convertXX,
  convertY,
  convertYY,
  helperPosition,
} from "../../../helpers/utils";
import { socketHooks } from "../../../components/SocketProvider";
import { constGame, constPositions } from "../../../config/const";
import { shortenName } from "../../../helpers/utils";
import Card from "./Card";
import Chip from "./Chip";
import { gameStates } from "../../../config/const";
import {
  setBuyInModal,
  setInitialState,
  setPosition,
} from "../../../store/slices/gameSlice";
import Timer from "./Timer";
const Player = (props) => {
  const dispatch = useDispatch();
  const position = props.id;
  const address = useSelector((state) => state.game.mainInformation.address);
  const myPosition = useSelector(
    (state) => state.game.mainInformation.position
  );
  const unit = useSelector((state) => state.game.unit);
  const playerInfo = useSelector(
    (state) => state.game.roomInformation.players[position]
  );
  const dealerId = useSelector((state) => state.game.roomInformation.dealerId);
  const gameState = useSelector((state) => state.game.roomInformation.status);
  console.log(gameState);
  if (
    position == 0 &&
    playerInfo.address !== address &&
    gameState === gameStates.preflop
  ) {
    dispatch(setInitialState());
    window.location.href = "/";
  }
  return (
    <Container>
      {gameState != gameStates.preWaiting && dealerId === position && (
        <Sprite
          x={helperPosition(constPositions.players[position].dealer, unit).x}
          y={helperPosition(constPositions.players[position].dealer, unit).y}
          width={
            helperPosition(constPositions.players[position].dealer, unit).w
          }
          height={
            helperPosition(constPositions.players[position].dealer, unit).h
          }
          image="mark-dealer"
        />
      )}

      {gameState !== gameStates.preWaiting && playerInfo.position > -1 && (
        <>
          <Chip position={position}></Chip>
          <Card position={position} id={0}></Card>
          <Card position={position} id={1}></Card>
        </>
      )}
      <Container alpha={playerInfo.status == gameStates.join ? 0.5 : 1}>
        <Sprite
          x={
            helperPosition(constPositions.players[position].information, unit).x
          }
          y={
            helperPosition(constPositions.players[position].information, unit).y
          }
          width={
            helperPosition(constPositions.players[position].information, unit).w
          }
          height={
            helperPosition(constPositions.players[position].information, unit).h
          }
          image="person-info"
        />
        <Sprite
          x={helperPosition(constPositions.players[position].avatar, unit).x}
          y={helperPosition(constPositions.players[position].avatar, unit).y}
          width={
            helperPosition(constPositions.players[position].avatar, unit).w
          }
          height={
            helperPosition(constPositions.players[position].avatar, unit).h
          }
          image="person-avatar"
        />
        {playerInfo.position > -1 && (
          <Sprite
            x={convertXX(constPositions.players[position].avatar.x + 15, unit)}
            y={convertYY(constPositions.players[position].avatar.y + 13, unit)}
            width={convertX(
              constPositions.players[position].avatar.w - 29,
              unit
            )}
            height={convertY(
              constPositions.players[position].avatar.h - 35,
              unit
            )}
            image={`http://192.168.112.64:3000/images/nfts/nft (${
              playerInfo.position + 1
            }).png`}
            mask={new PIXI.Graphics()
              .beginFill(0xffffff)
              .drawCircle(
                convertXX(constPositions.players[position].avatar.x + 77, unit),
                convertYY(constPositions.players[position].avatar.y + 76, unit),
                convertX(63, unit)
              )
              .endFill()}
          />
        )}

        {playerInfo.position > -1 && (
          <>
            <Text
              text={shortenName(playerInfo.name)}
              anchor={0.5}
              x={
                helperPosition(
                  {
                    ...constPositions.players[position].information,
                    x: constPositions.players[position].information.x + 95,
                  },
                  unit
                ).x
              }
              y={
                helperPosition(
                  {
                    ...constPositions.players[position].information,
                    y: constPositions.players[position].information.y + 33,
                  },
                  unit
                ).y
              }
              style={
                new TextStyle({
                  align: "center",
                  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                  fontSize: unit * 3.2,
                  fontWeight: 300,
                  fill: "#fff",
                })
              }
            />
            <Text
              text={"$" + playerInfo.stack}
              anchor={0.5}
              x={
                helperPosition(
                  {
                    ...constPositions.players[position].information,
                    x: constPositions.players[position].information.x + 95,
                  },
                  unit
                ).x
              }
              y={
                helperPosition(
                  {
                    ...constPositions.players[position].information,
                    y: constPositions.players[position].information.y + 75,
                  },
                  unit
                ).y
              }
              style={
                new TextStyle({
                  align: "center",
                  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                  fontSize: unit * 3.2,
                  fontWeight: 300,
                  fill: "#fff",
                })
              }
            />
          </>
        )}
        <Timer position={position}></Timer>
      </Container>
      {playerInfo.position < 0 && myPosition < 0 && (
        <Sprite
          interactive={true}
          pointerdown={() => {
            dispatch(setBuyInModal(position));
          }}
          x={helperPosition(constPositions.players[position].avatar, unit).x}
          y={helperPosition(constPositions.players[position].avatar, unit).y}
          width={
            helperPosition(constPositions.players[position].avatar, unit).w
          }
          height={
            helperPosition(constPositions.players[position].avatar, unit).h
          }
          image="btn-join"
        />
      )}
    </Container>
  );
};

export default Player;
