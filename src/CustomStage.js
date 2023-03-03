import { ReactReduxContext } from "react-redux";
import { Stage as PixiStage } from "@pixi/react";

import ContextBridge from "./helpers/ContextBridge";

export const CustomStage = ({ children, ...props }) => {
  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={(children) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
};
