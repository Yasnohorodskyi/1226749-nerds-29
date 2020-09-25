'use strict';

const header = document.querySelector(`#js-templates-cost-title`);
const minCost = document.querySelector(`#js-cost-min`);
const maxCost = document.querySelector(`#js-cost-max`);

if (header && minCost && maxCost) {
  const createRangeInput = (value) => {
    const rangeInput = document.createElement(`input`);
    rangeInput.classList.add(`templates__cost-range`);
    rangeInput.type = `range`;
    rangeInput.min = 0;
    rangeInput.max = 20000;
    rangeInput.value = value;

    return rangeInput;
  };

  const rangeWrapper = document.createElement(`div`);
  rangeWrapper.classList.add(`templates__cost-range-wrapper`);
  rangeWrapper.append(createRangeInput(minCost.value));
  rangeWrapper.append(createRangeInput(maxCost.value));
  header.after(rangeWrapper);
}
