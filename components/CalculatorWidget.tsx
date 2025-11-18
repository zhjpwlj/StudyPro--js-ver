import React, { useState } from 'react';

const CalculatorWidget: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const [mode, setMode] = useState<'standard' | 'scientific'>('standard');
    const [isRadians, setIsRadians] = useState(true);

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            setDisplay('0.');
            setWaitingForSecondOperand(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearAll = () => {
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };
    
    const toggleSign = () => {
        setDisplay(String(parseFloat(display) * -1));
    };

    const inputPercent = () => {
        const currentValue = parseFloat(display);
        if (firstOperand !== null && operator) {
            const secondOperand = parseFloat(display);
            let result: number;
            if (operator === '+' || operator === '-') {
                // For +/-, it's a percentage of the first operand (e.g., 100 + 10% = 110)
                result = calculate(firstOperand, firstOperand * (secondOperand / 100), operator);
            } else { // '×' or '÷'
                // For */÷, it's a direct percentage (e.g., 100 * 10% = 10)
                result = calculate(firstOperand, secondOperand / 100, operator);
            }
            setDisplay(String(result));
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(true);
        } else {
            // Handle standalone percentage, e.g., 50% -> 0.5
            setDisplay(String(currentValue / 100));
            setWaitingForSecondOperand(true);
        }
    };

    const handleUnaryOperation = (operation: string) => {
        const value = parseFloat(display);
        let result: number;
        
        const trigValue = isRadians ? value : (value * Math.PI) / 180;

        switch(operation) {
            case 'sin': result = Math.sin(trigValue); break;
            case 'cos': result = Math.cos(trigValue); break;
            case 'tan': result = Math.tan(trigValue); break;
            case 'ln': result = Math.log(value); break;
            case 'log': result = Math.log10(value); break;
            case '√': result = Math.sqrt(value); break;
            case 'x²': result = Math.pow(value, 2); break;
            case 'π': setDisplay(String(Math.PI)); setWaitingForSecondOperand(true); return;
            case 'e': setDisplay(String(Math.E)); setWaitingForSecondOperand(true); return;
            default: return;
        }
        setDisplay(String(result));
        setWaitingForSecondOperand(true);
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (operator && waitingForSecondOperand) {
            setOperator(nextOperator);
            return;
        }

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            setDisplay(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (first: number, second: number, op: string): number => {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '×': return first * second;
            case '÷': return first / second;
            default: return second;
        }
    };
    
    const handleEquals = () => {
         if (operator && firstOperand !== null) {
            const inputValue = parseFloat(display);
            const result = calculate(firstOperand, inputValue, operator);
            setDisplay(String(result));
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(true);
        }
    }

    const buttonClass = "flex items-center justify-center h-11 text-lg font-semibold rounded-lg transition-colors";
    const numClass = "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600";
    const opClass = "bg-primary-500 text-white hover:bg-primary-600";
    const specialClass = "bg-gray-400 dark:bg-gray-500 text-white hover:bg-gray-500 dark:hover:bg-gray-400";
    const sciClass = "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-sm";


    return (
        <div className="h-full flex flex-col p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <button onClick={() => setMode(m => m === 'standard' ? 'scientific' : 'standard')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    {mode === 'standard' ? 'Scientific' : 'Standard'}
                </button>
                 {mode === 'scientific' && (
                    <button onClick={() => setIsRadians(r => !r)} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                        {isRadians ? 'Rad' : 'Deg'}
                    </button>
                 )}
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-900/50 rounded-lg mb-2 p-4 flex items-end justify-end">
                <p className="text-4xl sm:text-5xl font-light text-gray-800 dark:text-white break-all">{display}</p>
            </div>
            <div className={`grid gap-2 ${mode === 'standard' ? 'grid-cols-4' : 'grid-cols-5'}`}>
                 {mode === 'standard' ? (
                    <>
                        <button onClick={clearAll} className={`${buttonClass} ${specialClass}`}>C</button>
                        <button onClick={toggleSign} className={`${buttonClass} ${specialClass}`}>+/-</button>
                        <button onClick={inputPercent} className={`${buttonClass} ${specialClass}`}>%</button>
                        <button onClick={() => performOperation('÷')} className={`${buttonClass} ${opClass}`}>÷</button>
                        <button onClick={() => inputDigit('7')} className={`${buttonClass} ${numClass}`}>7</button>
                        <button onClick={() => inputDigit('8')} className={`${buttonClass} ${numClass}`}>8</button>
                        <button onClick={() => inputDigit('9')} className={`${buttonClass} ${numClass}`}>9</button>
                        <button onClick={() => performOperation('×')} className={`${buttonClass} ${opClass}`}>×</button>
                        <button onClick={() => inputDigit('4')} className={`${buttonClass} ${numClass}`}>4</button>
                        <button onClick={() => inputDigit('5')} className={`${buttonClass} ${numClass}`}>5</button>
                        <button onClick={() => inputDigit('6')} className={`${buttonClass} ${numClass}`}>6</button>
                        <button onClick={() => performOperation('-')} className={`${buttonClass} ${opClass}`}>-</button>
                        <button onClick={() => inputDigit('1')} className={`${buttonClass} ${numClass}`}>1</button>
                        <button onClick={() => inputDigit('2')} className={`${buttonClass} ${numClass}`}>2</button>
                        <button onClick={() => inputDigit('3')} className={`${buttonClass} ${numClass}`}>3</button>
                        <button onClick={() => performOperation('+')} className={`${buttonClass} ${opClass}`}>+</button>
                        <button onClick={() => inputDigit('0')} className={`${buttonClass} ${numClass} col-span-2`}>0</button>
                        <button onClick={inputDecimal} className={`${buttonClass} ${numClass}`}>.</button>
                        <button onClick={handleEquals} className={`${buttonClass} ${opClass}`}>=</button>
                    </>
                ) : (
                    <>
                        {/* Row 1 */}
                        <button onClick={() => handleUnaryOperation('sin')} className={`${buttonClass} ${sciClass}`}>sin</button>
                        <button onClick={() => handleUnaryOperation('cos')} className={`${buttonClass} ${sciClass}`}>cos</button>
                        <button onClick={() => handleUnaryOperation('tan')} className={`${buttonClass} ${sciClass}`}>tan</button>
                        <button onClick={() => handleUnaryOperation('ln')} className={`${buttonClass} ${sciClass}`}>ln</button>
                        <button onClick={() => handleUnaryOperation('log')} className={`${buttonClass} ${sciClass}`}>log</button>

                        {/* Row 2 */}
                        <button onClick={() => handleUnaryOperation('√')} className={`${buttonClass} ${sciClass}`}>√</button>
                        <button onClick={() => handleUnaryOperation('x²')} className={`${buttonClass} ${sciClass}`}>x²</button>
                        <button onClick={() => handleUnaryOperation('π')} className={`${buttonClass} ${sciClass}`}>π</button>
                        <button onClick={() => handleUnaryOperation('e')} className={`${buttonClass} ${sciClass}`}>e</button>
                        <button onClick={clearAll} className={`${buttonClass} ${specialClass}`}>C</button>
                        
                        {/* Row 3 */}
                        <button onClick={() => inputDigit('7')} className={`${buttonClass} ${numClass}`}>7</button>
                        <button onClick={() => inputDigit('8')} className={`${buttonClass} ${numClass}`}>8</button>
                        <button onClick={() => inputDigit('9')} className={`${buttonClass} ${numClass}`}>9</button>
                        <button onClick={() => performOperation('÷')} className={`${buttonClass} ${opClass}`}>÷</button>
                        <button onClick={toggleSign} className={`${buttonClass} ${specialClass}`}>+/-</button>

                        {/* Row 4 */}
                        <button onClick={() => inputDigit('4')} className={`${buttonClass} ${numClass}`}>4</button>
                        <button onClick={() => inputDigit('5')} className={`${buttonClass} ${numClass}`}>5</button>
                        <button onClick={() => inputDigit('6')} className={`${buttonClass} ${numClass}`}>6</button>
                        <button onClick={() => performOperation('×')} className={`${buttonClass} ${opClass}`}>×</button>
                        <button onClick={inputPercent} className={`${buttonClass} ${specialClass}`}>%</button>

                        {/* Row 5 & 6 */}
                        <button onClick={() => inputDigit('1')} className={`${buttonClass} ${numClass}`}>1</button>
                        <button onClick={() => inputDigit('2')} className={`${buttonClass} ${numClass}`}>2</button>
                        <button onClick={() => inputDigit('3')} className={`${buttonClass} ${numClass}`}>3</button>
                        <button onClick={() => performOperation('-')} className={`${buttonClass} ${opClass}`}>-</button>
                        <button onClick={handleEquals} className={`${buttonClass} ${opClass} row-span-2`}>=</button>

                        <button onClick={() => inputDigit('0')} className={`${buttonClass} ${numClass} col-span-2`}>0</button>
                        <button onClick={inputDecimal} className={`${buttonClass} ${numClass}`}>.</button>
                        <button onClick={() => performOperation('+')} className={`${buttonClass} ${opClass}`}>+</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CalculatorWidget;