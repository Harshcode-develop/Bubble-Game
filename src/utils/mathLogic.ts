import type { BubbleData, Difficulty } from '../types/game';



// Helper to get random number in range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateExpression = (difficulty: Difficulty): { expression: string, value: number } => {
  // Simpler helper for random decimal x.x or just x
  const randomDecimal = () => {
    // 50% chance of integer, 50% chance of 1 decimal place
    if (Math.random() > 0.5) return randomInt(1, 15).toString();
    const val = (Math.random() * 10).toFixed(1);
    return parseFloat(val) % 1 === 0 ? parseInt(val).toString() : val;
  };

  const formatExpr = (expr: string) => expr.replace(/\*/g, 'x').replace(/\//g, '÷');

  if (difficulty === 'Medium') {
    const type = Math.random();
    
    if (type < 0.3) {
      // Simple Int: 5+3, 12-4
      const a = randomInt(1, 20);
      const b = randomInt(1, 10);
      const op = ['+', '-'][randomInt(0, 1)]; 
      const expr = `${a}${op}${b}`;
      // eslint-disable-next-line no-new-func
      const val = new Function('return ' + expr)();
      return { expression: formatExpr(expr), value: val };
    } else if (type < 0.55) {
      // Multiplication: 3x5, 4x6
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      const expr = `${a}*${b}`;
      const val = a * b;
      return { expression: formatExpr(expr), value: val };
    } else if (type < 0.8) {
       // Simple Division: 14/2, 12/4
       const a = randomInt(2, 9);
       const b = randomInt(2, 9);
       const c = a * b;
       const expr = `${c}/${a}`;
       const val = b; 
       return { expression: formatExpr(expr), value: val }; 
    } else {
       // Simple Fraction: 3/2 + 2/3 (small numbers)
       const a = randomInt(1, 4);
       const b = randomInt(2, 5);
       const c = randomInt(1, 4);
       const d = randomInt(2, 5);
       const op = ['+', '-'][randomInt(0, 1)];
       const expr = `${a}/${b}${op}${c}/${d}`;
       // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)();
       return { expression: formatExpr(expr), value: val };
    }

  } else {
    // Hard: Decimals, Mixed, Fractions, Division, Multiplication
    const type = Math.random();
    
    if (type < 0.25) {
      // Decimals: 0.5+1.5 or 2.3-1.1
      const a = randomDecimal();
      const b = randomDecimal();
      const op = ['+', '-'][randomInt(0, 1)]; 
      const expr = `${a}${op}${b}`;
       // eslint-disable-next-line no-new-func
      const val = new Function('return ' + expr)();
      return { expression: formatExpr(expr), value: val };

    } else if (type < 0.45) {
       // Division with decimals or slightly harder ints
       const isInt = Math.random() > 0.5;
       if (isInt) {
          const divisor = randomInt(2, 9);
          const quotient = randomInt(2, 15);
          const dividend = divisor * quotient;
          const expr = `${dividend}/${divisor}`;
           // eslint-disable-next-line no-new-func
          const val = new Function('return ' + expr)();
          return { expression: formatExpr(expr), value: val };
       } else {
          // .5 result
          const divisor = 2 * randomInt(1, 4); // Even number 2,4,6,8
          const dividend = divisor * randomInt(1, 5) + (divisor/2);
          const expr = `${dividend}/${divisor}`;
           // eslint-disable-next-line no-new-func
          const val = new Function('return ' + expr)();
          return { expression: formatExpr(expr), value: val };
       }

    } else if (type < 0.65) {
       // Multiplication Harder: 12x4, 2.5x2
       const isDecimal = Math.random() > 0.7;
       if (isDecimal) {
         const a = (Math.random() * 5).toFixed(1); // 2.5
         const b = randomInt(2, 5);
         const expr = `${a}*${b}`;
         // eslint-disable-next-line no-new-func
         const val = new Function('return ' + expr)();
         return { expression: formatExpr(expr), value: val };
       } else {
         const a = randomInt(3, 12);
         const b = randomInt(3, 9);
         const expr = `${a}*${b}`;
         const val = a * b;
         return { expression: formatExpr(expr), value: val };
       }

    } else if (type < 0.85) {
       // Mixed Ops: 2*3+4
       const a = randomInt(1, 10);
       const b = randomInt(1, 10);
       const c = randomInt(1, 10);
       const op2 = ['+', '-'][randomInt(0, 1)];
       // Use * then + or -
       const expr = `${a}*${b}${op2}${c}`; 
        // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)();
       return { expression: formatExpr(expr), value: val };
    } else {
       // Fractions: 2/3 + 3/2
       const a = randomInt(1, 5);
       const b = randomInt(2, 5);
       const c = randomInt(1, 5);
       const d = randomInt(2, 5);
       const op = ['+', '-'][randomInt(0, 1)];
       const expr = `${a}/${b}${op}${c}/${d}`;
        // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)();
       return { expression: formatExpr(expr), value: val };
    }
  }
};

export const generateRoundBubbles = (difficulty: Difficulty): BubbleData[] => {
  const bubbles: BubbleData[] = [];
  const usedValues = new Set<number>();
  const usedExprs = new Set<string>();

  while (bubbles.length < 3) {
    const { expression, value } = generateExpression(difficulty);
    
    // Avoid duplicates
    if (!usedExprs.has(expression) && !usedValues.has(value)) {
      usedValues.add(value);
      usedExprs.add(expression);
      bubbles.push({
        id: Math.random().toString(36).substr(2, 9),
        expression,
        value
      });
    }
  }
  
  // Return shuffled
  return bubbles.sort(() => Math.random() - 0.5);
};
