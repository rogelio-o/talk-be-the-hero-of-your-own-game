import { ISoundEngine } from "./../ISoundEngine";

export class BrowserSoundEngine implements ISoundEngine {
  private sounds: { [id: string]: HTMLAudioElement } = {};

  public add(id: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.onerror = (err) => reject(err);
      audio.onloadeddata = () => resolve();
      audio.load();

      this.sounds[id] = audio;
    });
  }

  public playOnce(id: string): Promise<void> {
    const sound = this.sounds[id];

    if (sound) {
      return new Promise((resolve) => {
        sound.currentTime = 0;
        sound.loop = false;
        sound.play();
        sound.onended = () => {
          sound.onended = null;
          resolve();
        };
      });
    } else {
      return Promise.resolve();
    }
  }

  public playInLoop(id: string): void {
    const sound = this.sounds[id];

    if (sound) {
      sound.currentTime = 0;
      sound.loop = true;
      sound.play();
    }
  }

  public pause(id: string): void {
    const sound = this.sounds[id];

    if (sound) {
      sound.pause();
    }
  }

  public resume(id: string): void {
    const sound = this.sounds[id];

    if (sound) {
      sound.play();
    }
  }

  public stop(id: string): void {
    const sound = this.sounds[id];

    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  public stopLoop(id: string): void {
    const sound = this.sounds[id];

    if (sound) {
      sound.loop = false;
      sound.currentTime = 0;
    }
  }

  public stopAll(): void {
    Object.keys(this.sounds).forEach((key) => this.stop(key));
  }
}
