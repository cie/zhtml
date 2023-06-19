class Point {
  constructor(x = 0, y = 0, scale = 1) {
    this.x = x;
    this.y = y;
    this.scale = scale;
  }
  plus(point) {
    return new Point(
      this.x + point.x * this.scale,
      this.y + point.y * this.scale,
      this.scale * point.scale
    );
  }
  neg() {
    return new Point(
      -this.x / this.scale,
      -this.y / this.scale,
      1 / this.scale
    );
  }
  minus(point) {
    return this.plus(point.neg());
  }
  static dif(b, a) {
    return a.neg().plus(b);
  }
  toString() {
    return `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
  }
  dist(that, height = 800, rho = 1.41) {
    const { asinh, acosh, sinh, cosh, exp, log, sqrt, tanh } = Math;
    // code from d3.js interpolateZoom
    const rho2 = rho * rho,
      rho4 = rho2 * rho2;
    const ux0 = this.x,
      uy0 = this.y,
      w0 = this.scale * height,
      ux1 = that.x,
      uy1 = that.y,
      w1 = that.scale * height;
    const dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      d1 = sqrt(d2);
    const b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (w0 * rho2 * d1 * 2);
    const b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (w1 * rho2 * d1 * 2);
    const r0 = -asinh(b0);
    const r1 = -asinh(b1);
    const dr = r1 - r0;
    if (isNaN(dr)) {
      return log(w1 / w0) / rho;
    }
    return dr / rho;
  }
}

class Canvas {
  constructor(el) {
    this.el = el;
    this.p = new Point();
    el.style.transform = this.p;
    el.addEventListener("wheel", this.onWheel);
    el.addEventListener("click", this.onClick, true);
  }

  get viewport() {
    return this.el.parentElement;
  }

  jumpTo(p) {
    this.el.style.transform = this.p = p;
  }

  moveTo(p) {
    const oldTransform = getComputedStyle(this.el).transform;
    const len = Math.abs(this.p.dist(p));
    this.el.style.transform = this.p = p;
    this.el.animate(
      [{ transform: oldTransform }, { transform: this.p.toString() }],
      { duration: 2000 * len ** 0.6, iterations: 1, easing: "ease" }
    );
  }

  focus(el) {
    this.moveTo(this.pointOf(el).neg());
  }

  onWheel = (e) => {};

  onClick = (e) => {
    this.focus(e.target.closest("section"));
  };

  pointOf(el) {
    if (el.nodeName === "MAIN" || el.nodeName === "BODY") return new Point();
    const matrix = getComputedStyle(el)
      .transform.match(/matrix\((.*)\)/)[1]
      .split(",")
      .map(Number.parseFloat);
    const p = new Point(
      el.offsetLeft + matrix[4],
      el.offsetTop + matrix[5],
      matrix[0]
    );
    return this.pointOf(el.parentElement).plus(p);
  }
}

document.querySelectorAll("main").forEach((el) => new Canvas(el));
