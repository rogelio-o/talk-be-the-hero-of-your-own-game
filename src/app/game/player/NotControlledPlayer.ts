import { AbstractPlayer, PlayerStatus } from "./AbstractPlayer";
import { IPlayer } from "./IPlayer";

export class NotControlledPlayer extends AbstractPlayer implements IPlayer {
  private intervalId?: any;

  public startMoving(): void {
    this.intervalId = setInterval(() => {
      const rand = Math.floor(Math.random() * 10);

      if (rand < 4) {
        this.changeStatus(PlayerStatus.WALKING_LEFT);
      } else if (rand > 4) {
        this.changeStatus(PlayerStatus.WALKING_RIGHT);
      } else {
        this.changeStatus(PlayerStatus.AWAITING);
      }

      if (rand < 3) {
        this.changePunching(true);
      } else {
        this.changePunching(false);
      }
    }, 500);
  }

  public stopMoving(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.changeStatus(PlayerStatus.AWAITING);
    this.changeGettingAPunch(false);
    this.changePunching(false);
  }
}
