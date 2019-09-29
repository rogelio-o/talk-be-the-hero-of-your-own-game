import { IMatchTemplate } from "./IMatchTemplate";
import { IMenuItem } from "./IMenuItem";

export interface ITemplate {
  loadResources(callback: (num: number, total: number) => void): void;

  loading(percentage: number): void;

  menu(items: IMenuItem[]): void;

  match(scenario?: string): IMatchTemplate;
}
