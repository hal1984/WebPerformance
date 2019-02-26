import { delay } from 'rxjs/operators';
// tslint:disable: no-use-before-declare
import { Component, OnInit, NgZone } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public pi: number;
  public ellapsedTime: number;
  public contador = 0;
  public model = { threads: '1' };
  private stopFor: boolean;
  private startTime: Date;

  workers: { worker: Worker; response: [number, number] }[] = [];

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.pi = 0;
  }

  start() {
    this.stop();
    this.stopFor = false;
    this.pi = 0;
    this.ellapsedTime = 0;
    this.startTime = new Date();
    this.createWebworker();
  }

  ionViewDidEnter() {
    this.pi = 0;
  }

  ionViewWillLeave() {
    this.stop();
  }

  stop() {
    this.stopFor = true;
    this.workers.forEach(w => {
      w.worker.terminate();
    });
    this.workers = [];
  }

  add() {
    this.contador++;
  }

  createWebworker() {
    this.workers = [];
    const numWorkers = parseInt(this.model.threads, 10);

    for (let i = 0; i < numWorkers; i++) {

      const worker = new Worker('./assets/worker.js');
      const workerData = { worker, response: null };

      worker.onmessage = ev => {
        workerData.response = ev.data;
        if (this.workers.every(w => !!w.response)) {
          this.zone.runTask(() => {
            const [total, inside] = this.workers.map(w => w.response).reduce((prev, cur) => [prev[0] + cur[0], prev[1] + cur[1]], [0, 0]);
            this.pi = (4 * inside) / total;
          });
          this.ellapsedTime = new Date().getTime() - this.startTime.getTime();
          this.stop();
        }
      };

      this.workers.push(workerData);
      worker.postMessage(Math.round(100000000 / numWorkers));
    }
  }
}
