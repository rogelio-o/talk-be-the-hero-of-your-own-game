import { DefaultCharacter } from "../../game/character/DefaultCharacter";
import { ICharacter } from "../../game/character/ICharacter";
import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { Intention } from "../../motion-engine/Intention";
import { GlyphGroup } from "../../render-engine/glyph/GlyphGroup";
import { IGlyph } from "../../render-engine/glyph/IGlyph";
import { IGlyphImage } from "../../render-engine/glyph/IGlyphImage";
import { IGlyphRectangle } from "../../render-engine/glyph/IGlyphRectangle";
import { IGlyphText } from "../../render-engine/glyph/IGlyphText";
import { IRenderEngine } from "../../render-engine/IRenderEngine";
import { ISoundEngine } from "../../sound-engine/ISoundEngine";
import { Origin } from "../../utils/Origin";
import { IMatchTemplate } from "../IMatchTemplate";
import { IHomeActions, IMatchActions, ITemplate } from "../ITemplate";

const rawCharacters = [
  {
    damage: 10,
    name: "Billy",
    path: "characters/billylee.png",
    sequences: {
      gettingAPunch: [3, 4, 5],
      punshing: [11, 8, 9, 10, 7],
      waiting: [2, 3, 7],
      walkingLeft: [2, 3, 7],
      walkingRight: [2, 3, 7],
    },
    speed: 5,
    spriteColumns: 7,
    spriteRows: 2,
  },
];

const imagesToLoad = [{ id: "scenario1", path: "scenarios/scenario1.gif" }];

const soundsToLoad = [{ id: "punch", path: "audio/punch.mp3" }];

interface IPlayerLifeBar {
  background: IGlyphRectangle;
  fill: IGlyphRectangle;
  text: IGlyphText;
}

export class DefaultTemplate implements ITemplate {
  private renderEngine: IRenderEngine;

  private motionEngine: IMotionEngine;

  private soundEngine: ISoundEngine;

  private images: { [key: string]: IGlyphImage } = {};

  private characters: ICharacter[] = [];

  constructor(
    renderEngine: IRenderEngine,
    motionEngine: IMotionEngine,
    soundEngine: ISoundEngine,
  ) {
    this.renderEngine = renderEngine;
    this.motionEngine = motionEngine;
    this.soundEngine = soundEngine;
  }

  public loadResources(callback: (num: number, total: number) => void): void {
    let num = 0;
    const total =
      imagesToLoad.length + rawCharacters.length + soundsToLoad.length;

    imagesToLoad.forEach((img) => {
      this.renderEngine
        .factory()
        .image(img.path, 0, 0, "100%")
        .then((g) => {
          this.images[img.id] = g;

          num++;
          callback(num, total);
        });
    });

    soundsToLoad.forEach((c) => {
      this.soundEngine.add(c.id, c.path).then(() => {
        num++;
        callback(num, total);
      });
    });

    rawCharacters.forEach((c) => {
      this.renderEngine
        .factory()
        .sprite(c.path, c.spriteColumns, c.spriteRows, 20, -25, 400)
        .then((g) => {
          this.characters.push(
            new DefaultCharacter(
              this.soundEngine,
              g,
              c.sequences,
              c.speed,
              c.damage,
              c.name,
            ),
          );

          num++;
          callback(num, total);
        });
    });
  }

  public loading(percentage: number): void {
    this.renderEngine.clear();
    this.soundEngine.stopAll();
    this.motionEngine.removeAll();

    const background = this.renderEngine
      .factory()
      .rectangle("black", 0, 0, "100%", "100%");
    const barGlyph = this.loadingBar(percentage);
    const barText = this.renderEngine
      .factory()
      .text(percentage + "%", "white", 0, 40, 20);
    barText.setOrigin(Origin.CENTER);

    this.renderEngine.add(background);
    this.renderEngine.add(barGlyph);
    this.renderEngine.add(barText);
  }

  public home(actions: IHomeActions): void {
    this.renderEngine.clear();
    this.soundEngine.stopAll();
    this.motionEngine.removeAll();

    const background = this.renderEngine
      .factory()
      .rectangle("black", 0, 0, "100%", "100%");
    this.renderEngine.add(background);

    const numItems = 1;
    const singlePlayerItem = this.menuItem("SINGLE PLAYER", numItems, 0);
    this.motionEngine.click("singlePlayerItem", singlePlayerItem, () =>
      actions.onSinglePlayerMatch(
        this.characters[0].clone(),
        this.characters[0].clone(),
      ),
    );
    this.renderEngine.add(singlePlayerItem);
  }

  public match(actions: IMatchActions, scenario?: string): IMatchTemplate {
    this.renderEngine.clear();
    this.soundEngine.stopAll();
    this.motionEngine.removeAll();

    this.motionEngine.intention(
      "go-back",
      Intention.EXIT,
      () => {
        /* NOTHING */
      },
      () => actions.onGoHome(),
    );

    this.renderEngine.add(this.images[scenario || "scenario1"]);

    const lifePlayer1 = this.createPlayerLife(1);
    this.addPlayerLifeToRenderEngine(lifePlayer1, Origin.TOP_LEFT);

    const lifePlayer2 = this.createPlayerLife(2);
    this.addPlayerLifeToRenderEngine(lifePlayer2, Origin.TOP_RIGHT);

    return {
      addPlayers: this.addPlayersToMatch.bind(this),
      gameOver: (player: number): void => this.matchGameOver(player),
      scenario: scenario || "scenario1",
      setHealth: (player: number, h: number): void =>
        this.matchSetHealth(h, player === 1 ? lifePlayer1 : lifePlayer2),
    };
  }

  private matchSetHealth(h: number, lifePlayer: IPlayerLifeBar): void {
    lifePlayer.fill.setSize(
      lifePlayer.background.getWidth() -
        lifePlayer.background.getWidth() * (h / 100),
      lifePlayer.fill.getHeight(),
    );
  }

  private matchGameOver(player: number): void {
    const gameOverText = this.renderEngine
      .factory()
      .text("PLAYER " + player + " WINS", "black", 0, 0, 50);
    gameOverText.setOrigin(Origin.CENTER);

    const goBackText = this.renderEngine
      .factory()
      .text("ESC to go back", "black", 0, 50, 20);
    goBackText.setOrigin(Origin.CENTER);

    this.renderEngine.add(
      this.renderEngine.factory().group([gameOverText, goBackText]),
    );
  }

  private addPlayersToMatch(c1: ICharacter, c2: ICharacter) {
    const g1 = c1.glyph();
    g1.setOrigin(Origin.BOTTOM_LEFT);
    this.renderEngine.add(g1);

    const g2 = c2.glyph();
    g2.setOrigin(Origin.BOTTOM_RIGHT);
    g2.flip();
    this.renderEngine.add(g2);
  }

  private createPlayerLife(player: number): IPlayerLifeBar {
    return {
      background: this.renderEngine
        .factory()
        .rectangle("yellow", 20, 20, 300, 30),
      fill: this.renderEngine.factory().rectangle("red", 20, 20, 0, 30),
      text: this.renderEngine
        .factory()
        .text("PLAYER " + player, "white", 20, 60, 20),
    };
  }

  private addPlayerLifeToRenderEngine(
    playerLife: IPlayerLifeBar,
    origin: Origin,
  ) {
    playerLife.background.setOrigin(origin);
    playerLife.fill.setOrigin(origin);
    playerLife.text.setOrigin(origin);
    this.renderEngine.add(playerLife.background);
    this.renderEngine.add(playerLife.fill);
    this.renderEngine.add(playerLife.text);
  }

  private menuItem(text: string, size: number, index: number): IGlyph {
    const glyphRectangle: IGlyphRectangle = this.renderEngine
      .factory()
      .rectangle("#930b0b", 0, index * 50 - (size * 50) / 2, 200, 30);
    glyphRectangle.setOrigin(Origin.CENTER);

    const glyphText: IGlyphText = this.renderEngine
      .factory()
      .text(text, "white", 0, index * 50 - 3 - (size * 50) / 2, 20);
    glyphText.setOrigin(Origin.CENTER);

    const glyphGroup: GlyphGroup = this.renderEngine
      .factory()
      .group([glyphRectangle, glyphText]);

    return glyphGroup;
  }

  private loadingBar(percentage: number): IGlyph {
    const glyphBackgroundRectangle: IGlyphRectangle = this.renderEngine
      .factory()
      .rectangle("#930b0b", 0, 0, 200, 40);
    glyphBackgroundRectangle.setOrigin(Origin.CENTER);

    const glyphBackgroundRectangle2: IGlyphRectangle = this.renderEngine
      .factory()
      .rectangle("white", 0, 0, 195, 35);
    glyphBackgroundRectangle2.setOrigin(Origin.CENTER);

    const percentageWidth = (195 * percentage) / 100;
    const percentageBar: IGlyphRectangle = this.renderEngine
      .factory()
      .rectangle(
        "#930b0b",
        -195 / 2 + percentageWidth / 2,
        0,
        percentageWidth,
        35,
      );
    percentageBar.setOrigin(Origin.CENTER);

    const glyphGroup: GlyphGroup = this.renderEngine
      .factory()
      .group([
        glyphBackgroundRectangle,
        glyphBackgroundRectangle2,
        percentageBar,
      ]);

    return glyphGroup;
  }
}
