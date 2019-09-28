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
import { HorizontalAlign } from "./utils/HorizontalAlign";
import { VerticalAlign } from "./utils/VerticalAlign";

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const renderEngine: IRenderEngine = new CanvasRenderEngine(canvas);

const soundEngine: ISoundEngine = new BrowserSoundEngine();
const motionEngine: IMotionEngine = new KeyboardMotionEngine(canvas);
motionEngine.listen();

const background: IGlyphRectangle = renderEngine
  .factory()
  .rectangle("white", 0, 0, 578, 200);
renderEngine.add(background);

const loadingText = renderEngine
  .factory()
  .text("Loading...", "black", 250, 100, 20);
loadingText.setHorizontalAlign(HorizontalAlign.CENTER);
loadingText.setVerticalAlign(VerticalAlign.MIDDLE);
renderEngine.add(loadingText);

const resources = Promise.all([
  soundEngine.add("punch", "audio/punch.mp3"),
  renderEngine.factory().sprite("/billylee.png", 7, 2, 0, 0, 100),
  renderEngine.factory().sprite("/billylee.png", 7, 2, 400, 0, 100),
]);
resources
  .then(([, player1, player2]) => {
    renderEngine.remove(loadingText);

    const lifeBackgroundPlayer1 = renderEngine
      .factory()
      .rectangle("yellow", 20, 200, 200, 30);
    lifeBackgroundPlayer1.setVerticalAlign(VerticalAlign.BOTTOM);
    renderEngine.add(lifeBackgroundPlayer1);

    const lifeBackgroundPlayer2 = renderEngine
      .factory()
      .rectangle("yellow", 500, 200, 200, 30);
    lifeBackgroundPlayer2.setVerticalAlign(VerticalAlign.BOTTOM);
    lifeBackgroundPlayer2.setHorizontalAlign(HorizontalAlign.RIGHT);
    renderEngine.add(lifeBackgroundPlayer2);

    const lifePlayer1 = renderEngine.factory().rectangle("red", 20, 200, 0, 30);
    lifePlayer1.setVerticalAlign(VerticalAlign.BOTTOM);
    renderEngine.add(lifePlayer1);

    const lifePlayer2 = renderEngine
      .factory()
      .rectangle("red", 500, 200, 0, 30);
    lifePlayer2.setVerticalAlign(VerticalAlign.BOTTOM);
    lifePlayer2.setHorizontalAlign(HorizontalAlign.RIGHT);
    renderEngine.add(lifePlayer2);

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
          if (collide(player1, player2, { left: speed })) {
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
          if (collide(player1, player2, { right: speed })) {
            player1.pause();
          }
        });
      },
      player1.stop.bind(player1),
    );
  })
  .catch((err) => console.error(err));
