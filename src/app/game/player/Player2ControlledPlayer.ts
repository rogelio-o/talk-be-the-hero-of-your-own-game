import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { Intention } from "../../motion-engine/Intention";
import { ICharacter } from "../character/ICharacter";
import { AbstractControlledPlayer } from "./ControlledPlayer";
import { IPlayer } from "./IPlayer";

export class Playe2ControlledPlayer extends AbstractControlledPlayer
  implements IPlayer {
  constructor(character: ICharacter, motionEngine: IMotionEngine) {
    super(character, motionEngine, "2");
  }

  protected leftIntention(): Intention {
    return Intention.LEFT_PLAYER_2;
  }

  protected rightIntention(): Intention {
    return Intention.RIGHT_PLAYER_2;
  }

  protected punchIntention(): Intention {
    return Intention.PUNCH_PLAYER_2;
  }
}
