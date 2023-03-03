import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { Text, TextStyle, Container, Graphics } from "pixi.js";

const ChipValue = PixiComponent("ChipValue", {
  create: (props) => {
    const fontSize = props.fontSize;
    const textContent = props.text;
    const container = new Container();
    container.x = props.x;
    container.y = props.y;
    const style = new TextStyle({
      align: "center",
      fontSize: fontSize,
      fontWeight: 300,
      fill: "#fff",
    });

    const text = new Text(textContent, style);
    text.anchor = props.anchor;

    const graphics = new Graphics();
    graphics.anchor = props.anchor;
    graphics.beginFill(0x000000);
    graphics.alpha = 0.7;
    graphics.drawRoundedRect(
      -fontSize - text.width * props.anchor.x,
      -fontSize / 6,
      text.width + fontSize * 2,
      text.height + fontSize / 3,
      text.height / 1.5
    );
    graphics.endFill();
    if (props.text == "") graphics.clear();
    container.addChild(graphics);
    container.addChild(text);
    return container;
  },
  applyProps: (instance, oldProps, newProps) => {
    const { stageSize: oldStageSize, ...oldP } = oldProps;
    const { stageSize: newStageSize, ...newP } = newProps;
    instance.children[1].text = newProps.text;
    instance.children[1].style.fontSize = newProps.fontSize;
    instance.children[1].anchor = newProps.anchor;
    instance.children[0].anchor = newProps.anchor;
    instance.children[0].clear();
    instance.children[0].beginFill(0x000000);
    instance.children[0].alpha = 0.7;
    instance.children[0].drawRoundedRect(
      -newProps.fontSize - instance.children[1].width * newProps.anchor.x,
      -newProps.fontSize / 6,
      instance.children[1].width + newProps.fontSize * 2,
      instance.children[1].height + newProps.fontSize / 3,
      instance.children[1].height / 1.5
    );
    instance.children[0].endFill();
    if (newProps.text == "") {
      instance.children[0].clear();
    }
  },
});

export default ChipValue;
