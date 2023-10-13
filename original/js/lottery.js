const decidePrize = document.querySelector('.decide-prize');
const decidePrizeAngle = document.querySelector('.decide-prize-angle');
const showPrizeText = document.querySelector('.show-prize-text');
const congratulationSmall = document.querySelector('.Congratulations1');
const congratulationBig = document.querySelector('.Congratulations2')

const prizeValue = decidePrize.value;
function handlePrize(angleCSS) {
  decidePrizeAngle.classList.add(angleCSS);
  if (prizeValue == '5000') {
    congratulationBig.classList.remove('hidden');
  } else {
    congratulationSmall.classList.remove('hidden');
    showPrizeText.textContent = prizeValue;
  }
}

function determinePrize() {
  console.log(prizeValue);
  switch(prizeValue) {
    case '10':
      handlePrize('angle-10');
      break;
    case '30':
      handlePrize('angle-30');
      break;
    case '50':
      handlePrize('angle-50');
      break;
    case '70':
      handlePrize('angle-70');
      break;
    case '100':
      handlePrize('angle-100');
      break;
    case '5000':
      handlePrize('angle-5000');
      break;
  }
     
}

determinePrize();