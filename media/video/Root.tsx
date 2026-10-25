import { Composition } from "remotion";
import { TetherIntro } from "./TetherIntro";

export const Root = () => (
  <Composition id="TetherIntro" component={TetherIntro} durationInFrames={570} fps={30} width={1920} height={1080} />
);
