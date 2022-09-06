class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.unaryOperation = undefined;
  }

  appendNumber(number) {
    if (number === '0' && this.currentOperand === '0') return;
    if (this.currentOperand.length >= 17) return;
    if (number !== '0' && this.currentOperand === '0') this.currentOperand = '';
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  appendDot() {
    if (this.currentOperand.includes('.')) return;
    if (this.currentOperand === '') this.currentOperand += '0';
    this.currentOperand = this.currentOperand.toString() + '.';
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    console.log(`compute was called:
    prev: ${prev}
    current ${current}
    operation: ${this.operation}`);

    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case 'add':
        computation = prev + current;
        break;
      case 'subtract':
        computation = prev - current;
        break;
      case 'multiply':
        computation = prev * current;
        break;
      case 'divide':
        computation = prev / current;
        break;
      case 'pow':
        computation = Math.pow(prev, current);
        break;
      case 'percent':
        computation = prev / 100 * current;
        break;
      default:
        return;
    }

    console.log(`compute was called:
    prev: ${prev}
    current ${current}
    operation: ${this.operation}
    computation: ${computation}`);

    this.currentOperand = computation;
    this.operation = undefined;
    // this.previousOperand = '';
  }

  computeUnary(operation) {
    console.log(`computeUnary was called:
    current ${this.currentOperand}
    operation: ${this.operation}`);

    this.unaryOperation = operation;
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    switch (this.unaryOperation) {
      case 'sqrt':
        this.currentOperand = Math.sqrt(current);
        break;
      default:
        return;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.currentOperand;

    const operationSymbol = Calculator.getOperationSymbolByName(this.operation);

    console.log(this.operation);
    if (operationSymbol) {
      this.previousOperandTextElement.innerText = `${this.previousOperand} ${operationSymbol}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }

  updateDisplayUnary() {
    switch (this.unaryOperation) {
      case 'sqrt':
        this.previousOperandTextElement.innerText += `√(${this.currentOperand})`;
        break;
      default:
        return;
    }
  }

  static getOperationSymbolByName(name) {
    const map = {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷',
      percent: '%',
      sqrt: '√',
      pow: '^',
    }
    return map[name];
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const clearButton = document.querySelector('[data-all-clear]');
const dotButton = document.querySelector('[data-dot]');
const unaryOperationButtons = document.querySelectorAll('[data-unary-operation]');

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