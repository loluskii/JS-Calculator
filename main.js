const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'plus') {
        return Math.floor(firstNum + secondNum)
    } else if (operator === 'minus') {
        return Math.floor(firstNum - secondNum)
    } else if (operator === 'times') {
        return Math.floor(firstNum * secondNum)
    } else if (operator === 'divide') {
        if (secondNum === 0) {return clear();}
        return Math.floor(firstNum / secondNum)
    }
}

const getKeyType = key => {
    const { action } = key.dataset
    if (!action) {
        return 'number'
    } else if (
        action === 'plus' ||
        action === 'minus' ||
        action === 'times' ||
        action === 'divide'
    ) {
        return 'operator'
    }
    else {
        return action
    }
}

const getOperatorType = key => {
    const { action } = key.dataset
    return action
}

const getResult = (key, displayedNum, state) => {
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const { firstValue, operator, modValue, previousKeyType } = state

    if (keyType === 'number') {
        return displayedNum === '0' ||
            previousKeyType === 'operator' ||
            previousKeyType === 'solve'
            ? keyContent
            : displayedNum + keyContent
    }

    if (keyType === 'operator') {
        return firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'solve'
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum
    }

    if (keyType === 'clear') return 

    if (keyType === 'solve') {
        return firstValue
            ? previousKeyType === 'solve'
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum
    }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset

    calculator.dataset.previousKeyType = keyType

    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'solve'
            ? calculatedValue
            : displayedNum
    }

    if (keyType === 'calculate') {
        calculator.dataset.modValue = firstValue && previousKeyType === 'solve'
            ? modValue
            : displayedNum
    }

    if (keyType === 'clear' && key.textContent === 'C') {
        clear();
    }
}

const clear = () => {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
}

const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key)
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

    if (keyType === 'operator') key.classList.add('is-depressed')
    if (keyType === 'clear' && key.textContent !== 'C') key.textContent = 'C'
    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'C'
    }
}

const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.answer')
const keys = calculator.querySelector('.calculator_keys')
console.log(display)

keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return
    const key = e.target
    const displayedNum = display.textContent
    const resultString = getResult(key, displayedNum, calculator.dataset)

    console.log(getKeyType(e.target));

    if (getKeyType(e.target) == "operator") {
        let operatorType = getOperatorType(e.target);
        if (display.innerText == "" && operatorType !== "minus") return
        display.innerText = resultString + e.target.textContent
    }
    else display.textContent = resultString
    // console.log(resultString + e.target.textContent);
    // display.textContent = resultString
    updateCalculatorState(key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator)
})

