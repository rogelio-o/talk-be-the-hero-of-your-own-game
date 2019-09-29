import { IMotionEngine } from "../motion-engine/IMotionEngine";
import { IMatchTemplate } from "../template/IMatchTemplate";
import { ITemplate } from "../template/ITemplate";
import { ICharacter } from "./character/ICharacter";
import { IMatch } from "./match/IMatch";
import { SinglePlayerMatch } from "./match/SinglePlayerMatch";

export class Game {
  private motionEngine: IMotionEngine;

  private template: ITemplate;

  constructor(motionEngine: IMotionEngine, template: ITemplate) {
    this.motionEngine = motionEngine;
    this.template = template;
  }

  public play(): void {
    this.template.loadResources((num, total) => {
      if (num < total) {
        this.template.loading(Math.ceil((num * 100) / total));
      } else {
        this.showMenu();
      }
    });
  }

  private showMenu() {
    this.template.home({
      onSinglePlayerMatch: (c1, c2) => this.newSinglePlayerMatch(c1, c2),
    });
  }

  private newSinglePlayerMatch(c1: ICharacter, c2: ICharacter): void {
    const matchTemplate: IMatchTemplate = this.template.match({
      onGoHome: () => this.showMenu(),
    });
    const match: IMatch = new SinglePlayerMatch(
      matchTemplate,
      this.motionEngine,
    );
    match.play(c1, c2, () => this.showMenu());
  }
}
