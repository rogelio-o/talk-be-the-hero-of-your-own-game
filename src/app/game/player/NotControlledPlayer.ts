import { AbstractPlayer } from "./AbstractPlayer";
import { IPlayer } from "./IPlayer";

export class NotControlledPlayer extends AbstractPlayer implements IPlayer {
  public startMoving(): void {
    // Do nothing
  }

  public stopMoving(): void {
    // Do nothing
  }
}
