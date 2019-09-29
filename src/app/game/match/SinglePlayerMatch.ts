import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { IMatchTemplate } from "../../template/IMatchTemplate";
import { ICharacter } from "../character/ICharacter";
import { ControlledPlayer } from "../player/ControlledPlayer";
import { IPlayer } from "../player/IPlayer";
import { NotControlledPlayer } from "../player/NotControlledPlayer";
import { IMatch } from "./IMatch";

export class SinglePlayerMatch implements IMatch {
  private matchTemplate: IMatchTemplate;

  private motionEngine: IMotionEngine;

  constructor(matchTemplate: IMatchTemplate, motionEngine: IMotionEngine) {
    this.matchTemplate = matchTemplate;
    this.motionEngine = motionEngine;
  }

  public play(c1: ICharacter, c2: ICharacter, endCallback: () => void): void {
    this.matchTemplate.addPlayers(c1, c2);

    const player1: IPlayer = new ControlledPlayer(c1, this.motionEngine);
    const player2: IPlayer = new NotControlledPlayer(c2);

    player1.healthHandler((h) => {
      this.matchTemplate.setHealth(1, h);

      if (h === 0) {
        player1.stopMoving();
        player2.stopMoving();

        this.matchTemplate.gameOver(2);
      }
    });
    player2.healthHandler((h) => {
      this.matchTemplate.setHealth(2, h);

      if (h === 0) {
        player1.stopMoving();
        player2.stopMoving();

        this.matchTemplate.gameOver(1);
      }
    });

    player1.setOtherPlayer(player2);
    player2.setOtherPlayer(player1);

    player1.startMoving();
    player2.startMoving();
  }
}
