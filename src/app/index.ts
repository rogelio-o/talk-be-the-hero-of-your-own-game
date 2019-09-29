import { Game } from "./game/Game";
import { IMotionEngine } from "./motion-engine/IMotionEngine";
import { KeyboardMotionEngine } from "./motion-engine/keyboard/KeyboardMotionEngine";
import { CanvasRenderEngine } from "./render-engine/canvas/CanvasRenderEngine";
import { IRenderEngine } from "./render-engine/IRenderEngine";
import { BrowserSoundEngine } from "./sound-engine/browser/BrowserSoundEngine";
import { ISoundEngine } from "./sound-engine/ISoundEngine";
import { DefaultTemplate } from "./template/default/DefaultTemplate";
import { ITemplate } from "./template/ITemplate";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const renderEngine: IRenderEngine = new CanvasRenderEngine(canvas);

window.addEventListener("resize", resizeCanvas, false);
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderEngine.render();
}
resizeCanvas();

const soundEngine: ISoundEngine = new BrowserSoundEngine();
const motionEngine: IMotionEngine = new KeyboardMotionEngine(canvas);
motionEngine.listen();
const template: ITemplate = new DefaultTemplate(
  renderEngine,
  motionEngine,
  soundEngine,
);

const game: Game = new Game(motionEngine, template);
game.play();
