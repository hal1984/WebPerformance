// tslint:disable: no-use-before-declare
import { Component, OnInit, NgZone } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  public pi: number;
  public ellapsedTime: number;
  public contador = 0;
  private stopFor: boolean;
  private startTime: Date;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.pi = 0;
  }

  start() {
    this.stopFor = false;
    this.startTime = new Date();
    this.main();
  }

  ionViewDidEnter() {
    this.pi = 0;
  }

  ionViewWillLeave() {
    this.stop();
  }

  stop() {
    this.stopFor = true;
  }

  add() {
    this.contador++;
  }

  main() {
    const generatorPi = this.computePi();
    const [total, insideCount] = generatorPi.next().value;

    this.zone.runTask(() => {
      this.pi = (4 * insideCount) / total;
      this.ellapsedTime = new Date().getTime() - this.startTime.getTime();
    });
  }

  /// Generates a stream of increasingly accurate estimates of π.
  *computePi(batch = 100000000) {
    let total = 0;
    let insideCount = 0;
    while (true) {
      let it1 = 0;
      while (it1++ < batch) {
        const currentPoint = this.generateRandom().next().value;
        total++;
        if (currentPoint.isInsideUnitCircle()) {
          insideCount++;
        }
      }
      yield [total, insideCount];
    }
  }

  *generateRandom() {
    while (true) {
      yield new Point(Math.random(), Math.random());
    }
  }
}

class Point {
  constructor(private x: number, private y: number) {}

  isInsideUnitCircle() {
    return this.x * this.x + this.y * this.y <= 1;
  }
}
