import React, { useRef, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Container, Sprite, useTick } from "@pixi/react";
import { helperPosition } from "../../../helpers/utils";
import { constPositions, constGame, gameStates } from "../../../config/const";

const CommunityCard = (props) => {
  const id = props.id;
  const unit = useSelector((state) => state.game.unit);
  const card = useSelector(
    (state) => state.game.roomInformation.communityCards[id]
  );
  const dealer = useSelector((state) => state.game.roomInformation.dealerId);
  const gameState = useSelector((state) => state.game.roomInformation.status);
  const reducer = (_, { data }) => data;
  const [motionChip, updateChip] = useReducer(reducer);
  const timer = useRef(0);
  const visible = useRef(0);
  useEffect(() => {
    visible.current = 0;
    timer.current = 0;
    return () => {};
  }, []);

  useEffect(() => {
    if (
      (gameState === gameStates.flop && id < 3) ||
      (gameState === gameStates.turn && id === 3)
    ) {
      timer.current = 0;
      visible.current = 1;
    }
  }, [gameState]);
  useTick((delta) => {
    timer.current += delta;
    let time =
      timer.current > id * constGame.time_card_delay
        ? timer.current - id * constGame.time_card_delay
        : 0;
    let pos = {};
    if (time < constGame.time_community_card) {
      let pw = 0.2;
      pos = {
        position: helperPosition(
          {
            x:
              constPositions.players[dealer].avatar.x +
              ((constPositions.community[id].x -
                constPositions.players[dealer].avatar.x) *
                Math.pow(Math.min(constGame.time_community_card, time), pw)) /
                Math.pow(constGame.time_community_card, pw),
            y:
              constPositions.players[dealer].avatar.y +
              ((constPositions.community[id].y -
                constPositions.players[dealer].avatar.y) *
                Math.pow(Math.min(constGame.time_community_card, time), pw)) /
                Math.pow(constGame.time_community_card, pw),
            w: constPositions.community[id].w,
            h: constPositions.community[id].h,
          },
          unit
        ),
        image: "card-back",
      };
    } else if (time >= constGame.time_community_card) {
      pos = {
        position:
          time <
          constGame.time_community_card + constGame.time_community_turn / 2
            ? helperPosition(
                {
                  x: constPositions.community[id].x,
                  y: constPositions.community[id].y,
                  w:
                    constPositions.community[id].w *
                    Math.max(
                      0,
                      1 -
                        (1 / (constGame.time_community_turn / 2)) *
                          (time - constGame.time_community_card)
                    ),
                  h: constPositions.community[id].h,
                },
                unit
              )
            : helperPosition(
                {
                  x: constPositions.community[id].x,
                  y: constPositions.community[id].y,
                  w:
                    constPositions.community[id].w *
                    Math.min(
                      1,
                      (1 / (constGame.time_community_turn / 2)) *
                        (time -
                          constGame.time_community_card -
                          constGame.time_community_turn / 2)
                    ),
                  h: constPositions.community[id].h,
                },
                unit
              ),
        image:
          time >
          constGame.time_community_card + constGame.time_community_turn / 2
            ? "card" + card
            : "card-back",
      };
    }
    updateChip({
      type: "updateChip",
      data: {
        x: pos.position.x,
        y: pos.position.y,
        width: pos.position.w,
        height: pos.position.h,
        image: pos.image,
        alpha: Math.min((1 / constGame.time_community_card) * time, 1),
      },
    });
  });
  return (
    <Container>
      <Sprite image="card-back" anchor={0.5} {...motionChip} />
    </Container>
  );
};

export default CommunityCard;
