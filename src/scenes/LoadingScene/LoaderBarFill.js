import { Graphics } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { manifest } from "../../assets";
import { Assets } from "pixi.js";
import { useDispatch, useSelector } from "react-redux";
import { setPageState } from "../../store/slices/gameSlice";
import { gameStates } from "../../config/const";
import { convertX, convertY } from "../../helpers/utils";

const LoaderBarFill = () => {
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const unit = useSelector((state) => state.game.unit);
  const dispatch = useDispatch();

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(0xeeeeee, 1);
      g.drawRoundedRect(
        0,
        0,
        convertX(1200, unit) * loadingPercentage,
        convertY(60, unit)
      );
      g.endFill();
      // g.lineStyle(10, 0x0, 1);
      // g.drawRoundedRect(0, 0, loaderBarWidth, 50);
      // g.endFill();
    },
    [unit, loadingPercentage]
  );

  useEffect(() => {
    async function loadAssets() {
      Assets.init({ manifest: manifest });
      const bundleIds = manifest.bundles.map((bundle) => bundle.name);
      await Assets.loadBundle(bundleIds, (progress) =>
        setLoadingPercentage(progress)
      );
      dispatch(setPageState(gameStates.preWaiting));
    }
    loadAssets();
  }, []);

  return (
    <Graphics
      draw={draw}
      position={{
        x: (window.innerWidth - unit * 240) / 2 + convertX(380, unit),
        y: (window.innerHeight - unit * 135) / 2 + convertY(800, unit),
      }}
    />
  );
};

export default LoaderBarFill;
