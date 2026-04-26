let display = document.getElementById('display');
        let currentInput = '0';
        let operator = null;
        let previousValue = null;
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function appendNumber(num) {
            if (shouldResetDisplay) {
                currentInput = num;
                shouldResetDisplay = false;
            } else {
                if (currentInput === '0' && num !== '.') {
                    currentInput = num;
                } else if (num === '.' && currentInput.includes('.')) {
                    return;
                } else {
                    currentInput += num;
                }
            }
            updateDisplay();
        }

        function appendOperator(op) {
            if (operator !== null && !shouldResetDisplay) {
                calculate();
            }
            previousValue = parseFloat(currentInput);
            operator = op;
            shouldResetDisplay = true;
        }

        function calculate() {
            if (operator === null || previousValue === null) return;

            let result;
            const current = parseFloat(currentInput);

            switch (operator) {
                case '+':
                    result = previousValue + current;
                    break;
                case '-':
                    result = previousValue - current;
                    break;
                case '×':
                    result = previousValue * current;
                    break;
                case '÷':
                    result = previousValue / current;
                    break;
                default:
                    return;
            }

            currentInput = result.toString();
            operator = null;
            previousValue = null;
            shouldResetDisplay = true;
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            operator = null;
            previousValue = null;
            shouldResetDisplay = false;
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }