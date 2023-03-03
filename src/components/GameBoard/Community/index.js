import React from "react";
import { useSelector } from "react-redux";
import { Container } from "@pixi/react";
import CommunityCard from "./CommunityCard";

const Community = () => {
  const cards = useSelector(
    (state) => state.game.roomInformation.communityCards
  );
  return (
    <Container>
      {cards.map((card, key) => {
        return <CommunityCard id={key} key={"community" + key} />;
      })}
    </Container>
  );
};

export default Community;
