import React, { useEffect, useRef, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Sprite, useTick, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import {
  convertX,
  convertXX,
  convertY,
  convertYY,
  helperPosition,
} from "../../../helpers/utils";
import { constGame, constPositions } from "../../../config/const";
import { shortenName } from "../../../helpers/utils";
import Card from "./Card";
import Chip from "./Chip";
import { gameStates } from "../../../config/const";
import {
  setBuyInModal,
  setInitialState,
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
  const currentId = useSelector(
    (state) => state.game.roomInformation.currentPlayerId
  );
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
          anchor={0.5}
          x={convertXX(constPositions.players[position].dealer.x, unit)}
          y={convertYY(constPositions.players[position].dealer.y, unit)}
          width={convertX(constPositions.players[position].dealer.w, unit)}
          height={convertY(constPositions.players[position].dealer.h, unit)}
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
        {playerInfo.position < 0 && myPosition < 0 ? (
          <Sprite
            interactive={true}
            pointerdown={() => {
              dispatch(setBuyInModal(position));
            }}
            anchor={0.5}
            x={
              helperPosition(constPositions.players[position].information, unit)
                .x
            }
            y={
              helperPosition(constPositions.players[position].information, unit)
                .y
            }
            width={
              helperPosition(constPositions.players[position].information, unit)
                .w
            }
            height={
              helperPosition(constPositions.players[position].information, unit)
                .h
            }
            image="btn-join"
          />
        ) : (
          <Sprite
            anchor={0.5}
            x={
              helperPosition(constPositions.players[position].information, unit)
                .x
            }
            y={
              helperPosition(constPositions.players[position].information, unit)
                .y
            }
            width={
              helperPosition(constPositions.players[position].information, unit)
                .w
            }
            height={
              helperPosition(constPositions.players[position].information, unit)
                .h
            }
            image="person-info"
          />
        )}

        <Sprite
          anchor={0.5}
          x={convertXX(constPositions.players[position].information.x, unit)}
          y={convertYY(
            constPositions.players[position].information.y +
              constPositions.players[position].information.h / 2 +
              40,
            unit
          )}
          width={convertX(150, unit)}
          height={convertY(40, unit)}
          image={
            gameState == gameStates.smallBlind && currentId == position
              ? "label-sb"
              : gameState == gameStates.bigBlind && currentId == position
              ? "label-bb"
              : gameState == gameStates.check && currentId == position
              ? "label-check"
              : playerInfo.status == gameStates.bet
              ? "label-bet"
              : playerInfo.status == gameStates.fold
              ? "label-fold"
              : "label-none"
          }
        />
        {playerInfo.position > -1 && (
          <Sprite
            x={convertXX(constPositions.players[position].avatar.x, unit)}
            y={convertYY(constPositions.players[position].avatar.y, unit)}
            anchor={0.5}
            width={convertX(constPositions.players[position].avatar.w, unit)}
            height={convertY(constPositions.players[position].avatar.h, unit)}
            image={`/images/nfts/nft (${playerInfo.position + 1}).png`}
            // mask={new PIXI.Graphics()
            //   .beginFill(0xffffff)
            //   .drawCircle(
            //     convertXX(constPositions.players[position].avatar.x + 77, unit),
            //     convertYY(constPositions.players[position].avatar.y + 76, unit),
            //     convertX(63, unit)
            //   )
            //   .endFill()}
          />
        )}

        {playerInfo.position > -1 && (
          <>
            <Text
              text={shortenName(playerInfo.name)}
              anchor={0.5}
              x={convertXX(
                constPositions.players[position].information.x +
                  constPositions.players[position].information.w * 0.12,
                unit
              )}
              y={convertYY(
                constPositions.players[position].information.y -
                  constPositions.players[position].information.h * 0.2,
                unit
              )}
              style={
                new TextStyle({
                  align: "center",
                  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                  fontSize: convertX(
                    constPositions.players[position].information.h * 0.3,
                    unit
                  ),
                  fontWeight: 300,
                  fill: "#fff",
                })
              }
            />
            <Text
              text={"$" + playerInfo.stack}
              anchor={0.5}
              x={convertXX(
                constPositions.players[position].information.x +
                  constPositions.players[position].information.w * 0.12,
                unit
              )}
              y={convertYY(
                constPositions.players[position].information.y +
                  constPositions.players[position].information.h * 0.25,
                unit
              )}
              style={
                new TextStyle({
                  align: "center",
                  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                  fontSize: convertX(
                    constPositions.players[position].information.h * 0.3,
                    unit
                  ),
                  fontWeight: 300,
                  fill: "#fff",
                })
              }
            />
          </>
        )}
        <Timer position={position}></Timer>
      </Container>
    </Container>
  );
};

export default Player;
