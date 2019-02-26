class Point {
  constructor(private x, private y) {
  }
  isInsideUnitCircle() {
      return this.x * this.x + this.y * this.y <= 1;
  }
}

function main(batch) {
  const generatorPi = computePi(batch);
  const [total, insideCount] = generatorPi.next().value;
  postMessage([total, insideCount], undefined);
};

/// Generates a stream of increasingly accurate estimates of π.
function* computePi(batch) {
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

function* generateRandom() {
  while (true) {
      yield new Point(Math.random(), Math.random());
  }
}

onmessage = ev => {
  main(ev.data);
}

