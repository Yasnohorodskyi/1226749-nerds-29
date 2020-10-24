'use strict';

const Point = {
  MIN: {
    propName: `--min-percent`,
    costLimit: 0,
    currentPercent: 0,
  },
  MAX: {
    propName: `--max-percent`,
    costLimit: 22059,
    currentPercent: 68,
  },
};

const prevElement = document.querySelector(`#filter-panel__cost-title-js`);
const minCost = document.querySelector(`#cost-min-js`);
const maxCost = document.querySelector(`#cost-max-js`);

const createElement = (template) => {
  const wrapper = document.createElement(`div`);
  wrapper.innerHTML = template;

  return wrapper.firstElementChild;
};

const calculateCostValue = (point) => {
  return Math.round(Point.MAX.costLimit * point.currentPercent / 100);
};

const changeCostValue = (point, newValue) => {
  if (point === Point.MIN) {
    minCost.value = newValue;
  } else {
    maxCost.value = newValue;
  }
};

if (prevElement && minCost && maxCost) {
  let currentMinValue = calculateCostValue(Point.MIN);
  let currentMaxValue = calculateCostValue(Point.MAX);

  const markup = (`
    <div class="filter-panel__cost-range">
      <div class="filter-panel__cost-range-line">
        <div
          class="filter-panel__cost-point filter-panel__cost-point--min"
          tabindex="0"
          id="filter-panel__cost-point-min-js"
        ></div>
        <div
          class="filter-panel__cost-point filter-panel__cost-point--max"
          tabindex="0"
          id="filter-panel__cost-point-max-js"
        ></div>
      </div>
    </div>
  `);

  const rangeBlock = createElement(markup);
  const rangeLine = rangeBlock.querySelector(`.filter-panel__cost-range-line`);
  const pointMin = rangeBlock.querySelector(`#filter-panel__cost-point-min-js`);
  const pointMax = rangeBlock.querySelector(`#filter-panel__cost-point-max-js`);

  const changePropValue = (point) => {
    rangeBlock.style.setProperty(point.propName, `${point.currentPercent}%`);
  };

  const changeCurrentPercent = (point, newValue) => {
    point.currentPercent = newValue;

    if (point === Point.MIN && newValue > Point.MAX.currentPercent) {
      Point.MAX.currentPercent = newValue;
      changePropValue(Point.MAX);
      changeCostValue(Point.MAX, calculateCostValue(Point.MAX));
    } else if (point === Point.MAX && newValue < Point.MIN.currentPercent) {
      Point.MIN.currentPercent = newValue;
      changePropValue(Point.MIN);
      changeCostValue(Point.MIN, calculateCostValue(Point.MIN));
    }
  };

  const onChangeCostValue = (evt) => {
    const point = evt.target === minCost
      ? Point.MIN
      : Point.MAX;

    const newPercent = Math.round(
        parseInt(evt.target.value, 10) / Point.MAX.costLimit * 100
    );
    changeCurrentPercent(point, newPercent);
    changePropValue(point);
  };

  const onPointMouseDown = (downEvt) => {
    const point = downEvt.target === pointMin
      ? Point.MIN
      : Point.MAX;
    const lineWidth = rangeLine.clientWidth;
    const leftOffset = rangeLine.getBoundingClientRect().left;

    const onMovePoint = (mouseEvt) => {
      const currentValue = Math.round((mouseEvt.x - leftOffset) / lineWidth * 100);
      if (currentValue >= 0 && currentValue <= 100) {
        changePropValue(point);
        changeCurrentPercent(point, currentValue);
        changeCostValue(point, calculateCostValue(point));
      }
    };

    const onUpPoint = () => {
      document.removeEventListener(`mousemove`, onMovePoint);
      document.removeEventListener(`mouseup`, onUpPoint);
    };

    document.addEventListener(`mousemove`, onMovePoint);
    document.addEventListener(`mouseup`, onUpPoint);
  };

  changePropValue(Point.MIN);
  changePropValue(Point.MAX);

  pointMin.addEventListener(`mousedown`, onPointMouseDown);
  pointMax.addEventListener(`mousedown`, onPointMouseDown);

  changeCostValue(Point.MIN, currentMinValue);
  changeCostValue(Point.MAX, currentMaxValue);

  minCost.addEventListener(`input`, onChangeCostValue);
  maxCost.addEventListener(`input`, onChangeCostValue);

  prevElement.after(rangeBlock);
}
