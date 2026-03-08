import React from 'react';

import { useState } from 'react';

// Enhanced Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Base layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"></div>
      
      {/* Multiple overlapping animated gradients */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 via-transparent to-transparent animate-gradient-1"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/40 via-transparent to-transparent animate-gradient-2"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/40 via-transparent to-transparent animate-gradient-3"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/40 via-transparent to-transparent animate-gradient-4"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-transparent animate-gradient-5"></div>
      </div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent animate-gradient-6"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent animate-gradient-7"></div>

      <style jsx>{`
        @keyframes gradient-1 {
          0%, 100% { transform: translate(0%, 0%) rotate(0deg); opacity: 0.7; }
          50% { transform: translate(100%, 50%) rotate(180deg); opacity: 1; }
        }
        
        @keyframes gradient-2 {
          0%, 100% { transform: translate(0%, 0%) rotate(0deg); opacity: 0.6; }
          50% { transform: translate(-50%, 100%) rotate(-180deg); opacity: 0.9; }
        }
        
        @keyframes gradient-3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
          50% { transform: translate(50%, -50%) scale(1.5); opacity: 0.5; }
        }
        
        @keyframes gradient-4 {
          0%, 100% { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.7; }
          33% { transform: translate(-30%, 30%) scale(1.2) rotate(120deg); opacity: 1; }
          66% { transform: translate(30%, -30%) scale(0.8) rotate(240deg); opacity: 0.6; }
        }
        
        @keyframes gradient-5 {
          0%, 100% { transform: translateX(0%) rotate(0deg); }
          50% { transform: translateX(100%) rotate(360deg); }
        }
        
        @keyframes gradient-6 {
          0%, 100% { transform: scale(1) translate(0%, 0%); }
          50% { transform: scale(1.5) translate(20%, 20%); }
        }
        
        @keyframes gradient-7 {
          0%, 100% { transform: scale(1.2) translate(0%, 0%); }
          50% { transform: scale(1) translate(-20%, -20%); }
        }
        
        .animate-gradient-1 { animation: gradient-1 15s ease-in-out infinite; }
        .animate-gradient-2 { animation: gradient-2 18s ease-in-out infinite; }
        .animate-gradient-3 { animation: gradient-3 12s ease-in-out infinite; }
        .animate-gradient-4 { animation: gradient-4 20s ease-in-out infinite; }
        .animate-gradient-5 { animation: gradient-5 25s linear infinite; }
        .animate-gradient-6 { animation: gradient-6 16s ease-in-out infinite; }
        .animate-gradient-7 { animation: gradient-7 14s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// Button Component
const CalcButton = ({ value, onClick, className = '', span = 1 }) => {
  const baseClasses = "text-2xl font-light py-6 rounded-2xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl";
  const spanClass = span === 2 ? "col-span-2" : "";
  
  return (
    <button
      onClick={() => onClick(value)}
      className={`${baseClasses} ${className} ${spanClass}`}
    >
      {value}
    </button>
  );
};

// Calculator logic hook
const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const calculate = (firstValue, secondValue, operation) => {
    const operations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '×': (a, b) => a * b,
      '÷': (a, b) => a / b,
    };
    return operations[operation]?.(firstValue, secondValue) ?? secondValue;
  };

  const handleNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  return {
    display,
    handleNumber,
    handleDecimal,
    handleClear,
    handleOperation,
    handleEquals,
    handleToggleSign,
    handlePercent,
  };
};

// Main Calculator Component
export default function Calculator() {
  const {
    display,
    handleNumber,
    handleDecimal,
    handleClear,
    handleOperation,
    handleEquals,
    handleToggleSign,
    handlePercent,
  } = useCalculator();

  // Button style configurations - DRY principle
  const buttonStyles = {
    function: 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-gray-900 font-semibold',
    operator: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold',
    number: 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white',
  };

  // Optimized button configurations
  const buttonLayout = [
    // Row 1
    [
      { value: 'AC', onClick: handleClear, type: 'function' },
      { value: '+/-', onClick: handleToggleSign, type: 'function' },
      { value: '%', onClick: handlePercent, type: 'function' },
      { value: '÷', onClick: () => handleOperation('÷'), type: 'operator' },
    ],
    // Row 2
    [
      { value: '7', onClick: handleNumber, type: 'number' },
      { value: '8', onClick: handleNumber, type: 'number' },
      { value: '9', onClick: handleNumber, type: 'number' },
      { value: '×', onClick: () => handleOperation('×'), type: 'operator' },
    ],
    // Row 3
    [
      { value: '4', onClick: handleNumber, type: 'number' },
      { value: '5', onClick: handleNumber, type: 'number' },
      { value: '6', onClick: handleNumber, type: 'number' },
      { value: '-', onClick: () => handleOperation('-'), type: 'operator' },
    ],
    // Row 4
    [
      { value: '1', onClick: handleNumber, type: 'number' },
      { value: '2', onClick: handleNumber, type: 'number' },
      { value: '3', onClick: handleNumber, type: 'number' },
      { value: '+', onClick: () => handleOperation('+'), type: 'operator' },
    ],
    // Row 5
    [
      { value: '0', onClick: handleNumber, type: 'number', span: 2 },
      { value: '.', onClick: handleDecimal, type: 'number' },
      { value: '=', onClick: handleEquals, type: 'operator' },
    ],
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-96 bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10 relative z-10">
        {/* Display */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-white/5">
          <div className="text-right">
            <div className="text-6xl font-extralight text-white tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
              {display}
            </div>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {buttonLayout.flat().map((btn, index) => (
            <CalcButton
              key={`${btn.value}-${index}`}
              value={btn.value}
              onClick={btn.onClick}
              className={buttonStyles[btn.type]}
              span={btn.span}
            />
          ))}
        </div>
      </div>
    </div>
  );
}