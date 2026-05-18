export class MetricsCalculator {
  private startTime: number = 0;
  private firstTokenTime: number = 0;
  private totalTokens: number = 0;
  
  start() {
    this.startTime = performance.now();
    this.firstTokenTime = 0;
    this.totalTokens = 0;
  }

  recordTokens(count: number) {
    if (this.firstTokenTime === 0) {
      this.firstTokenTime = performance.now();
    }
    this.totalTokens += count;
  }

  getMetrics() {
    const now = performance.now();
    
    const latency = this.firstTokenTime > 0 
      ? Math.round(this.firstTokenTime - this.startTime) 
      : Math.round(now - this.startTime);


    let tps = 0;
    if (this.totalTokens > 0 && this.firstTokenTime > 0) {
      const elapsedSeconds = (now - this.firstTokenTime) / 1000;
      if (elapsedSeconds > 0) {
        tps = Math.round(this.totalTokens / elapsedSeconds);
      }
    }

    return {
      tokenCount: this.totalTokens,
      tps,
      latency
    };
  }


  static estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
