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
  static from({ x, y }) {
    return new Point(x, y);
  }
}

class Rect {
  constructor(p, width, height) {
    this.p = p;
    this.width = width;
    this.height = height;
  }
  static from(rect) {
    return new Rect(new Point(rect.x, rect.y), rect.width, rect.height);
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
    this.el.style.transform = this.p = p;
    this.el.animate(
      [{ transform: oldTransform }, { transform: this.p.toString() }],
      { duration: 700, iterations: 1, easing: "ease" }
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
