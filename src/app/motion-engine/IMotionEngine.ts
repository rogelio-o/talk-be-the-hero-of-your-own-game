import { IGlyph } from "./../render-engine/glyph/IGlyph";
import { Intention } from "./Intention";

export interface IMotionEngine {
  listen(): void;

  click(
    id: string,
    glyph: IGlyph,
    callbackStart: () => void,
    callbackStop?: () => void,
  ): void;

  intention(
    id: string,
    intention: Intention,
    callbackStart: () => void,
    callbackStop?: () => void,
  ): void;

  removeClick(id: string): void;

  removeIntention(id: string): void;

  removeAll(): void;
}
