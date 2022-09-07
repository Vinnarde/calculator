import { Calculator } from "./Calculator";

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const clearButton = document.querySelector('[data-all-clear]');
const dotButton = document.querySelector('[data-dot]');
const unaryOperationButtons = document.querySelectorAll('[data-unary-operation]');
const percentOperationButton = document.querySelector('[data-operation-percent]');

const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log(`number button clicked: ${button.innerText}`);
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  })
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log(`operation button clicked: ${button.innerText}`);
    calculator.chooseOperation(button.dataset.operation);
    calculator.updateDisplay();
  })
});

unaryOperationButtons.forEach(button => {
  button.addEventListener('click', () => {
    console.log(`unary operation button clicked: ${button.innerText}`);
    calculator.computeUnary(button.dataset.unaryOperation);
    calculator.updateDisplay();
    calculator.updateDisplayUnary();
  })
});

percentOperationButton.addEventListener('click', () => {
  console.log(`percent operation button clicked`);
  calculator.computePercent();
  calculator.updateDisplay();
  calculator.updateDisplayUnary();
});

equalsButton.addEventListener('click', () => {
  console.log(`equals button clicked`);
  calculator.compute();
  calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
  console.log(`clear button clicked`);
  calculator.clear();
  calculator.updateDisplay();
});

dotButton.addEventListener('click', () => {
  console.log(`dot button clicked`);
  calculator.appendDot();
  calculator.updateDisplay();
});