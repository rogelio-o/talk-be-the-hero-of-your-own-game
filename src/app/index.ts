import { IMotionEngine } from "./motion-engine/IMotionEngine";
import { Intention } from "./motion-engine/Intention";
import { KeyboardMotionEngine } from "./motion-engine/keyboard/KeyboardMotionEngine";
import { CanvasRenderEngine } from "./render-engine/canvas/CanvasRenderEngine";
import { IGlyphRectangle } from "./render-engine/glyph/IGlyphRectangle";
import { IRenderEngine } from "./render-engine/IRenderEngine";
import { BrowserSoundEngine } from "./sound-engine/browser/BrowserSoundEngine";
import { ISoundEngine } from "./sound-engine/ISoundEngine";
import { collide } from "./utils/collisionUtils";
import { Direction } from "./utils/Direction";
import { Origin } from "./utils/Origin";

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

const background: IGlyphRectangle = renderEngine
  .factory()
  .rectangle("white", 0, 0, 10000, 10000);
renderEngine.add(background);

const loadingText = renderEngine
  .factory()
  .text("Loading...", "black", 0, 0, 20);
loadingText.setOrigin(Origin.CENTER);
renderEngine.add(loadingText);

const resources = Promise.all([
  soundEngine.add("punch", "audio/punch.mp3"),
  renderEngine.factory().sprite("/billylee.png", 7, 2, 0, 70, 200),
  renderEngine.factory().sprite("/billylee.png", 7, 2, 0, 70, 200),
]);
resources
  .then(([, player1, player2]) => {
    renderEngine.remove(loadingText);

    const lifeBackgroundPlayer1 = renderEngine
      .factory()
      .rectangle("yellow", 20, 20, 200, 30);
    lifeBackgroundPlayer1.setOrigin(Origin.BOTTOM_LEFT);
    renderEngine.add(lifeBackgroundPlayer1);

    const lifeBackgroundPlayer2 = renderEngine
      .factory()
      .rectangle("yellow", 20, 20, 200, 30);
    lifeBackgroundPlayer2.setOrigin(Origin.BOTTOM_RIGHT);
    renderEngine.add(lifeBackgroundPlayer2);

    const lifePlayer1 = renderEngine.factory().rectangle("red", 20, 20, 0, 30);
    lifePlayer1.setOrigin(Origin.BOTTOM_LEFT);
    renderEngine.add(lifePlayer1);

    const lifePlayer2 = renderEngine.factory().rectangle("red", 20, 20, 0, 30);
    lifePlayer2.setOrigin(Origin.BOTTOM_RIGHT);
    renderEngine.add(lifePlayer2);

    player1.setOrigin(Origin.BOTTOM_LEFT);
    player2.setOrigin(Origin.BOTTOM_RIGHT);

    renderEngine.add(player1);
    renderEngine.add(player2);

    player1.sequence([2, 3, 7]);
    player2.sequence([2, 3, 7]);

    player2.flip();

    let interval: any | undefined;
    motionEngine.intention(
      "punch",
      Intention.PUNCH,
      () => {
        player1.sequence([7, 8, 9, 10, 11]);
        soundEngine.playInLoop("punch");

        interval = setInterval(() => {
          if (collide(player1, player2, { right: 10 })) {
            player2.sequence([3, 4, 5]);
            lifePlayer2.setSize(
              Math.min(
                lifePlayer2.getWidth() + 10,
                lifeBackgroundPlayer2.getWidth(),
              ),
              lifePlayer2.getHeight(),
            );
          } else {
            player2.sequence([2, 3, 7]);
          }
        }, 100);
      },
      () => {
        player1.sequence([2, 3, 7]);
        soundEngine.stopLoop("punch");
        if (interval) {
          player2.sequence([2, 3, 7]);
          clearInterval(interval);
        }
      },
    );
    const speed = 5;
    motionEngine.intention(
      "player-left",
      Intention.LEFT,
      () => {
        player1.move(Direction.LEFT, speed, () => {
          if (collide(player1, player2, { left: speed, right: -155 })) {
            player1.pause();
          }
        });
      },
      player1.stop.bind(player1),
    );
    motionEngine.intention(
      "rectangle-right",
      Intention.RIGHT,
      () => {
        player1.move(Direction.RIGHT, speed, () => {
          if (collide(player1, player2, { right: -150 })) {
            player1.pause();
          }
        });
      },
      player1.stop.bind(player1),
    );
  })
  .catch((err) => console.error(err));
