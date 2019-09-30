import { IMatchTemplate } from "../../template/IMatchTemplate";
import { ICharacter } from "../character/ICharacter";
import { IPlayer } from "../player/IPlayer";
import { IMatch } from "./IMatch";

export abstract class AbstractMatch implements IMatch {
  private matchTemplate: IMatchTemplate;

  constructor(matchTemplate: IMatchTemplate) {
    this.matchTemplate = matchTemplate;
  }

  public play(c1: ICharacter, c2: ICharacter, endCallback: () => void): void {
    this.matchTemplate.addPlayers(c1, c2);

    const player1: IPlayer = this.createPlayer1(c1);
    const player2: IPlayer = this.createPlayer2(c2);

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

  protected abstract createPlayer1(c: ICharacter): IPlayer;

  protected abstract createPlayer2(c: ICharacter): IPlayer;
}
