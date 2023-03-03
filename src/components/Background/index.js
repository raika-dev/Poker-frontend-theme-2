import React from "react";
import { useSelector } from "react-redux";
import { Container, Sprite } from "@pixi/react";
import { helperPosition } from "../../helpers/utils";
import { constPositions } from "../../config/const";

import * as PIXI from "pixi.js";

const Background = () => {
  const unit = useSelector((state) => state.game.unit);
  return (
    <Container>
      <Sprite
        x={0}
        y={0}
        width={window.innerWidth}
        height={window.innerHeight}
        image="background-day"
      />
      <Sprite
        x={helperPosition(constPositions.table, unit).x}
        y={helperPosition(constPositions.table, unit).y}
        width={helperPosition(constPositions.table, unit).w}
        height={helperPosition(constPositions.table, unit).h}
        image="table"
      />
      <Sprite
        x={0}
        y={0}
        width={window.innerWidth}
        height={window.innerHeight}
        image="light"
      />
    </Container>
  );
};

export default Background;
