import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { Intention } from "../../motion-engine/Intention";
import { ICharacter } from "../character/ICharacter";
import { AbstractControlledPlayer } from "./ControlledPlayer";
import { IPlayer } from "./IPlayer";

export class Playe1ControlledPlayer extends AbstractControlledPlayer
  implements IPlayer {
  constructor(character: ICharacter, motionEngine: IMotionEngine) {
    super(character, motionEngine, "1");
  }

  protected leftIntention(): Intention {
    return Intention.LEFT;
  }

  protected rightIntention(): Intention {
    return Intention.RIGHT;
  }

  protected punchIntention(): Intention {
    return Intention.PUNCH;
  }
}
