export class ProfileCounter {
  private name : string;
  private time = 0;

  constructor(name: string) {
    this.name = name;
    this.reset();
  }

  reset() {
    this.time = new Date().getTime();
  }
  profile(log = true, pushMessage?: unknown) {
    const cost =  new Date().getTime() - this.time;
    if (log)
      console.log('[Profiler] ' + this.name, 'Cost:', cost + 'ms', pushMessage ? pushMessage : '');
    return cost;
  }
}