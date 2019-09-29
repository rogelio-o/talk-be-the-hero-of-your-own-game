export interface ISoundEngine {
  add(id: string, url: string): Promise<void>;

  playOnce(id: string): Promise<void>;

  playInLoop(id: string): void;

  pause(id: string): void;

  resume(id: string): void;

  stop(id: string): void;

  stopLoop(id: string): void;

  stopAll(): void;
}
