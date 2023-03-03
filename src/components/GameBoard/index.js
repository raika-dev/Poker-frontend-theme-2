import { useSelector } from "react-redux";
import { Container } from "@pixi/react";
import Community from "./Community";
import Player from "./Player";
const Background = () => {
  const players = useSelector((state) => state.game.roomInformation.players);
  return (
    <Container>
      <Community />
      {players.map((item, key) => {
        return <Player id={key} key={"player" + key} />;
      })}
    </Container>
  );
};

export default Background;
