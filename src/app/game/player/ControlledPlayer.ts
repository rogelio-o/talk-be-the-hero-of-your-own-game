import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { Intention } from "../../motion-engine/Intention";
import { ICharacter } from "../character/ICharacter";
import { AbstractPlayer, PlayerStatus } from "./AbstractPlayer";
import { IPlayer } from "./IPlayer";

export abstract class AbstractControlledPlayer extends AbstractPlayer
  implements IPlayer {
  private motionEngine: IMotionEngine;

  private player: string;

  constructor(
    character: ICharacter,
    motionEngine: IMotionEngine,
    player: string,
  ) {
    super(character);

    this.motionEngine = motionEngine;
    this.player = player;
  }

  public startMoving(): void {
    this.motionEngine.intention(
      "punch-" + this.player,
      this.punchIntention(),
      () => {
        this.changePunching(true);
      },
      () => {
        this.changePunching(false);
      },
    );

    this.motionEngine.intention(
      "player-left-" + this.player,
      this.leftIntention(),
      () => {
        this.changeStatus(PlayerStatus.WALKING_LEFT);
      },
      () => this.changeStatus(PlayerStatus.AWAITING),
    );
    this.motionEngine.intention(
      "player-right-" + this.player,
      this.rightIntention(),
      () => {
        this.changeStatus(PlayerStatus.WALKING_RIGHT);
      },
      () => this.changeStatus(PlayerStatus.AWAITING),
    );
  }

  public stopMoving(): void {
    this.motionEngine.removeIntention("punch-" + this.player);
    this.motionEngine.removeIntention("player-left-" + this.player);
    this.motionEngine.removeIntention("player-right-" + this.player);
    this.changeStatus(PlayerStatus.AWAITING);
    this.changeGettingAPunch(false);
    this.changePunching(false);
  }

  protected abstract leftIntention(): Intention;

  protected abstract rightIntention(): Intention;

  protected abstract punchIntention(): Intention;
}
