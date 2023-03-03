import { Container } from "@pixi/react";
import Background from "../../components/Background";
import GameBoard from "../../components/GameBoard";
const GameScene = () => {
  return (
    <Container x={0} y={0}>
      <Background />
      <GameBoard />
    </Container>
  );
};

export default GameScene;
