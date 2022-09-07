class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement, historyListElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.historyListElement = historyListElement;
    this.loadFromLocalStorage();
    this.renderHistory();
    this.clear();
  }

  loadFromLocalStorage() {
    this.history = JSON.parse(localStorage.getItem('calculator')) || [];
    if (this.history) return;
  }

  updateHistory(obj) {
    if (this.history.length >= 100)
      this.history.pop();

    if (this.history && this.history.length < 100) {
      this.history.unshift(obj);
    }

    console.log(`updateHistory was called:
    history: ${JSON.stringify(this.history)}`);

    this.updateLocalStorage();
    this.renderHistory();
  }

  updateLocalStorage() {
    localStorage.setItem('calculator', JSON.stringify(this.history));
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.unaryOperation = undefined;
    this.tempUnaryValue = undefined;
  }

  clearHistory() {
    this.history = [];
    this.updateLocalStorage();
    this.renderHistory();
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
      default:
        return;
    }

    console.log(`compute was called:
    prev: ${prev}
    current ${current}
    operation: ${this.operation}
    computation: ${computation}`);

    this.updateHistory({
      prev: `${prev} ${Calculator.getOperationSymbolByName(this.operation)} ${current} =`,
      current: computation,
    });

    this.currentOperand = computation;
    this.operation = undefined;
    // this.previousOperand = '';
  }

  computeUnary(operation) {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    this.unaryOperation = operation;

    console.log(`computeUnary was called:
    current ${current}
    operation: ${this.unaryOperation}`);

    switch (this.unaryOperation) {
      case 'sqrt':
        this.tempUnaryValue = current;
        this.currentOperand = Math.sqrt(current);
        this.updateHistory({
          prev: `√(${this.tempUnaryValue}) =`,
          current: this.currentOperand,
        });
        break;
      default:
        return;
    }



  }

  computePercent() {
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (!current) return;

    if (isNaN(prev) || ['multiply', 'divide'].includes(this.operation)) {
      this.currentOperand = current / 100;
    } else if (['add', 'subtract'].includes(this.operation)) {
      this.currentOperand = prev / 100 * current;
    } else return;

    this.unaryOperation = 'percent';
    this.tempUnaryValue = current;
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
        this.previousOperandTextElement.innerText += `√(${this.tempUnaryValue})`;
        break;
      case 'percent':
        this.previousOperandTextElement.innerText += ` ${this.tempUnaryValue}%`;
      default:
        return;
    }
    this.tempUnaryValue = undefined;
    this.unaryOperation = undefined;
  }

  renderHistory() {
    if (!this.history) return;

    console.log(`renderHistory was called:
    history: ${JSON.stringify(this.history)}

    historyListElement: ${JSON.stringify(this.historyListElement)}
    historyListElement.innerHTML: ${this.historyListElement.innerHTML}

    `);

    this.historyListElement.innerHTML = '';
    if (this.history.length === 0) {
      this.historyListElement.innerHTML = `<li class="calculator-history__item_empty">There's no history yet</li>`;

      console.log(`renderHistory was called:
      length: 0; 
      `);
      return;
    }

    this.history.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('calculator-history__item');

      const prev = document.createElement('div');
      const current = document.createElement('div');
      prev.classList.add('calculator-history__previous-operand');
      current.classList.add('calculator-history__current-operand');
      prev.innerText = item.prev;
      current.innerText = item.current;

      li.appendChild(prev);
      li.appendChild(current);

      this.historyListElement.appendChild(li);
    });
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
const percentOperationButton = document.querySelector('[data-operation-percent]');

const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const historyListElement = document.querySelector('[data-history-list]');
const clearHistoryButton = document.querySelector('[data-clear-history]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, historyListElement);

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

clearHistoryButton.addEventListener('click', () => {
  calculator.clearHistory();
});