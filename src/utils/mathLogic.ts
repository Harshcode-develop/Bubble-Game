import type { BubbleData, Difficulty } from '../types/game';

const OPERATORS = ['+', '-', '*', '/'];

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

  if (difficulty === 'Medium') {
    const type = Math.random();
    
    if (type < 0.5) {
      // Simple Int: 5+3, 12-4
      const a = randomInt(1, 20);
      const b = randomInt(1, 10);
      const op = OPERATORS[randomInt(0, 1)]; // + or -
      const expr = `${a}${op}${b}`;
      // eslint-disable-next-line no-new-func
      const val = new Function('return ' + expr)();
      return { expression: expr, value: val };
    } else if (type < 0.75) {
       // Simple Division: 14/2, 12/4
       // We construct it by mult: a * b = c -> c / a = b
       const a = randomInt(2, 9);
       const b = randomInt(2, 9);
       const c = a * b;
       // Expression c / a
       const expr = `${c}/${a}`; // Show as /, will render as division
       // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)(); // = b
       return { expression: expr.replace('/', '÷'), value: val }; 
       // Note: replacing / with ÷ for display in Bubble component? 
       // Actually Bubble component just renders string. 
       // But mathLogic returns 'expression' string. 
       // If we use '÷' in string, eval(expression) will fail if we use it later for re-calc?
       // But we return { expression, value }. Expression is for display. Value is pre-calculated.
       // So it is safe to return '÷' in expression string for display.
    } else {
       // Simple Fraction: 3/2 + 2/3 (small numbers)
       const a = randomInt(1, 4);
       const b = randomInt(2, 5);
       const c = randomInt(1, 4);
       const d = randomInt(2, 5);
       const op = OPERATORS[randomInt(0, 1)]; // + or -
       const expr = `${a}/${b}${op}${c}/${d}`;
       // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)();
       return { expression: expr, value: val };
    }

  } else {
    // Hard: Decimals, Mixed, Fractions, Division
    const type = Math.random();
    
    if (type < 0.3) {
      // Decimals: 0.5+1.5 or 2.3-1.1
      const a = randomDecimal();
      const b = randomDecimal();
      const op = OPERATORS[randomInt(0, 1)]; 
      const expr = `${a}${op}${b}`;
       // eslint-disable-next-line no-new-func
      const val = new Function('return ' + expr)();
      return { expression: expr, value: val };

    } else if (type < 0.5) {
       // Division with decimals or slightly harder ints: 15/2 = 7.5
       
       // Ensure simple decimal (0.5 etc) or int
       // Let's just pick random.
       // 15/4 = 3.75 (ok). 
       // 14/3 = 4.666 (bad).
       // Construct clean ones: either Int result or .5 result
       const isInt = Math.random() > 0.5;
       if (isInt) {
          const divisor = randomInt(2, 9);
          const quotient = randomInt(2, 15);
          const dividend = divisor * quotient;
          const expr = `${dividend}/${divisor}`;
           // eslint-disable-next-line no-new-func
          const val = new Function('return ' + expr)();
          return { expression: expr.replace('/', '÷'), value: val };
       } else {
          // .5 result: dividend = divisor * quotient + divisor/2
          // e.g. 4 * 2.5 = 10. -> 10 / 4 = 2.5
          const divisor = 2 * randomInt(1, 4); // Even number 2,4,6,8
          const dividend = divisor * randomInt(1, 5) + (divisor/2);
          const expr = `${dividend}/${divisor}`;
           // eslint-disable-next-line no-new-func
          const val = new Function('return ' + expr)();
          return { expression: expr.replace('/', '÷'), value: val };
       }

    } else if (type < 0.8) {
       // Mixed Ops: 2*3+4
       const a = randomInt(1, 10);
       const b = randomInt(1, 10);
       const c = randomInt(1, 10);
       const op2 = OPERATORS[randomInt(0, 1)]; // + -
       // Use * then + or -
       const expr = `${a}*${b}${op2}${c}`; // bias towards mult first for variety
        // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)();
       return { expression: expr, value: val };
    } else {
       // Fractions: 2/3 + 3/2
       const a = randomInt(1, 5);
       const b = randomInt(2, 5);
       const c = randomInt(1, 5);
       const d = randomInt(2, 5);
       const op = OPERATORS[randomInt(0, 1)];
       const expr = `${a}/${b}${op}${c}/${d}`;
        // eslint-disable-next-line no-new-func
       const val = new Function('return ' + expr)();
       return { expression: expr, value: val };
    }
  }
};

export const generateRoundBubbles = (difficulty: Difficulty): BubbleData[] => {
  const bubbles: BubbleData[] = [];
  const usedValues = new Set<number>();
  const usedExprs = new Set<string>();

  while (bubbles.length < 3) {
    const { expression, value } = generateExpression(difficulty);
    
    // Avoid duplicates in value (too close can be hard to click order, but exact duplicates are bad for sorting logic)
    // Actually, user said ascending order, if equal, order doesn't matter technically but better to be distinct contextually.
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
  
  // Return shuffled, NOT sorted. The USER must sort them.
  // We need to shuffle the array so they don't appear in generated order necessarily (though generated order is random too).
  return bubbles.sort(() => Math.random() - 0.5);
};
