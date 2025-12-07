/**
 * DeadmauC Test Suite
 *
 * "Testing is what happens when you finally go to bed at 4 AM
 * and realize your code was broken the whole time." - probably Joel
 */

const { Lexer, TokenType } = require('../src/lexer');
const { Parser, NodeType } = require('../src/parser');
const { Interpreter } = require('../src/interpreter');

// Helper to run DeadmauC code and capture output
async function runCode(code, options = {}) {
  const output = [];
  const outputFn = (str) => output.push(str);

  const lexer = new Lexer(code);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter(outputFn, options.inputFn);

  await interpreter.run(ast);

  return {
    output,
    interpreter,
  };
}

describe('Lexer', () => {
  test('tokenizes program structure', () => {
    const lexer = new Lexer('ATTACH THE MAU5HEAD\nGO TO BED JOEL');
    const tokens = lexer.tokenize();

    expect(tokens[0].type).toBe(TokenType.PROGRAM_START);
    expect(tokens[2].type).toBe(TokenType.PROGRAM_END);
  });

  test('tokenizes booleans correctly - CUBE V3 is true', () => {
    const lexer = new Lexer('CUBE V3');
    const tokens = lexer.tokenize();
    expect(tokens[0].type).toBe(TokenType.TRUE);
  });

  test('tokenizes booleans correctly - SKRILLEX is false (the shade)', () => {
    const lexer = new Lexer('SKRILLEX');
    const tokens = lexer.tokenize();
    expect(tokens[0].type).toBe(TokenType.FALSE);
  });

  test('tokenizes null correctly - MEOWINGTONS is null (RIP)', () => {
    const lexer = new Lexer('MEOWINGTONS');
    const tokens = lexer.tokenize();
    expect(tokens[0].type).toBe(TokenType.NULL);
  });

  test('tokenizes all false aliases', () => {
    const falseKeywords = ['MARSHMELLO', 'BIG ROOM', 'ANIMALS BY MARTIN GARRIX', 'BUTTON PUSHER', 'MAINSTREAM', 'DJ'];

    for (const keyword of falseKeywords) {
      const lexer = new Lexer(keyword);
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(TokenType.FALSE);
    }
  });

  test('tokenizes stupid built-in functions', () => {
    const stupidFunctions = [
      ['PURRARI', TokenType.PURRARI],
      ['NYAN CAT WRAP', TokenType.PURRARI],
      ['TORONTO TRAFFIC', TokenType.TORONTO_TRAFFIC],
      ['STUCK IN TRAFFIC', TokenType.TORONTO_TRAFFIC],
      ['AVICII TRIBUTE', TokenType.AVICII_TRIBUTE],
      ['RIP AVICII', TokenType.AVICII_TRIBUTE],
      ['PRESS BUTTON RECEIVE BACON', TokenType.PRESS_BUTTON],
      ['BACON', TokenType.PRESS_BUTTON],
      ['JAMES HYPE THIS', TokenType.JAMES_HYPE],
      ['DJ MODE', TokenType.DJ_MODE],
    ];

    for (const [keyword, expectedType] of stupidFunctions) {
      const lexer = new Lexer(keyword);
      const tokens = lexer.tokenize();
      expect(tokens[0].type).toBe(expectedType);
    }
  });
});

describe('Parser', () => {
  test('parses basic program structure', () => {
    const code = `ATTACH THE MAU5HEAD
I REMEMBER x
GO TO BED JOEL`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.type).toBe(NodeType.PROGRAM);
    expect(ast.body.length).toBe(1);
    expect(ast.body[0].type).toBe(NodeType.VARIABLE_DECLARATION);
  });

  test('parses PURRARI function', () => {
    const code = `ATTACH THE MAU5HEAD
PURRARI "test"
GO TO BED JOEL`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.body[0].type).toBe(NodeType.PURRARI);
  });

  test('parses TORONTO TRAFFIC function', () => {
    const code = `ATTACH THE MAU5HEAD
TORONTO TRAFFIC
GO TO BED JOEL`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.body[0].type).toBe(NodeType.TORONTO_TRAFFIC);
  });

  test('parses AVICII TRIBUTE function', () => {
    const code = `ATTACH THE MAU5HEAD
AVICII TRIBUTE 100
GO TO BED JOEL`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.body[0].type).toBe(NodeType.AVICII_TRIBUTE);
  });

  test('parses PRESS BUTTON RECEIVE BACON function', () => {
    const code = `ATTACH THE MAU5HEAD
PRESS BUTTON RECEIVE BACON
GO TO BED JOEL`;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast.body[0].type).toBe(NodeType.PRESS_BUTTON);
  });
});

describe('Interpreter - Core Features', () => {
  test('prints hello world', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
RAISE YOUR WEAPON TRACK "Hello, World!"
GO TO BED JOEL
    `);

    expect(output).toContain('Hello, World!');
  });

  test('CUBE V3 is truthy', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
WHATS THE FUSS CUBE V3 THE BEAT DROPS
RAISE YOUR WEAPON TRACK "true works"
WHATEVER
GO TO BED JOEL
    `);

    expect(output).toContain('true works');
  });

  test('SKRILLEX is falsy', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
WHATS THE FUSS SKRILLEX THE BEAT DROPS
RAISE YOUR WEAPON TRACK "should not print"
FML
RAISE YOUR WEAPON TRACK "false works"
WHATEVER
GO TO BED JOEL
    `);

    expect(output).toContain('false works');
    expect(output).not.toContain('should not print');
  });

  test('MEOWINGTONS is null', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER cat
cat IS NOW MEOWINGTONS
WHATS THE FUSS cat SAME BPM AS MEOWINGTONS THE BEAT DROPS
RAISE YOUR WEAPON TRACK "cat is null"
WHATEVER
GO TO BED JOEL
    `);

    expect(output).toContain('cat is null');
  });

  test('basic arithmetic works', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER x
x IS NOW 5 LAYER WITH 3
RAISE YOUR WEAPON x
GO TO BED JOEL
    `);

    expect(output).toContain('8');
  });

  test('STROBE loop works', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
STROBE i FROM 1 TO 3 FLASH
RAISE YOUR WEAPON i
UNFLASH
GO TO BED JOEL
    `);

    expect(output).toContain('1');
    expect(output).toContain('2');
    expect(output).toContain('3');
  });
});

describe('Interpreter - Stupid Built-in Functions', () => {
  test('DJ MODE always throws (IM NOT A DJ)', async () => {
    await expect(runCode(`
ATTACH THE MAU5HEAD
DJ MODE
GO TO BED JOEL
    `)).rejects.toThrow('IM NOT A DJ');
  });

  test('GRAMMY SPEECH prints the controversial quote', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
GRAMMY SPEECH
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('We all hit play'))).toBe(true);
  });

  test('ROB FORD COUNT returns "1 2 3 4"', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER count
count IS NOW ROB FORD COUNT
RAISE YOUR WEAPON count
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('1 2 3 4'))).toBe(true);
  });

  test('RANDOM ALBUM TITLE returns a deadmau5 album', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER album
album IS NOW RANDOM ALBUM TITLE
RAISE YOUR WEAPON album
GO TO BED JOEL
    `);

    const albums = [
      'Random Album Title',
      'For Lack of a Better Name',
      '4x4=12',
      'Album Title Goes Here',
      'while(1<2)',
      'W:/2016ALBUM/',
      'stuff i used to do',
      'Mau5ville: Level 1',
      'Mau5ville: Level 2',
      'Mau5ville: Level 3',
      "here's the drop!",
    ];

    const lastOutput = output[output.length - 1];
    expect(albums.some(album => lastOutput.includes(album))).toBe(true);
  });

  test('PLAY ANIMALS returns "ANIMALS" (the Martin Garrix diss)', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER song
song IS NOW PLAY ANIMALS
RAISE YOUR WEAPON song
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('ANIMALS'))).toBe(true);
  });

  test('COFFEE ADDICTION multiplies by 420', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER caffeinated
caffeinated IS NOW COFFEE ADDICTION 2
RAISE YOUR WEAPON caffeinated
GO TO BED JOEL
    `);

    expect(output).toContain('840'); // 2 * 420
  });

  test('NICE MEME FLIP outputs sarcasm', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
NICE MEME FLIP CUBE V3
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('nice meme'))).toBe(true);
    expect(output.some(line => line.includes('sarcasm'))).toBe(true);
  });

  test('TESTPILOT MODE returns value/2', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER minimal
minimal IS NOW TESTPILOT MODE 100
RAISE YOUR WEAPON minimal
GO TO BED JOEL
    `);

    expect(output).toContain('50');
    expect(output.some(line => line.includes('dark and minimal'))).toBe(true);
  });

  test('FERRARI LAWSUIT strips fun words', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER boring
boring IS NOW FERRARI LAWSUIT TRACK "rainbow nyan cat wrap"
RAISE YOUR WEAPON boring
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('[REDACTED BY FERRARI LEGAL]'))).toBe(true);
  });

  test('THE VELDT FEELS adds emotional suffix', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER emotional
emotional IS NOW THE VELDT FEELS TRACK "my code"
RAISE YOUR WEAPON emotional
GO TO BED JOEL
    `);

    // The output should start with "my code" and have some emotional suffix
    const lastOutput = output[output.length - 1];
    expect(lastOutput.startsWith('my code')).toBe(true);
    expect(lastOutput.length).toBeGreaterThan('my code'.length);
  });

  test('HR 8938 CEPHEI evaluates but discards to space', async () => {
    // This function should do nothing visible - value goes to space
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
HR 8938 CEPHEI TRACK "sent to space"
RAISE YOUR WEAPON TRACK "still here"
GO TO BED JOEL
    `);

    expect(output).toContain('still here');
    expect(output).not.toContain('sent to space');
  });
});

describe('Interpreter - The Ones That Made It (But Shouldnt Have)', () => {
  test('PURRARI wraps in nyan cat then gets sued', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
PURRARI TRACK "458 Italia"
GO TO BED JOEL
    `);

    // Should have Ferrari legal team message
    expect(output.some(line => line.includes('Ferrari legal'))).toBe(true);
    // Should wrap in nyan cat first
    expect(output.some(line => line.includes('458 Italia'))).toBe(true);
  });

  test('TORONTO TRAFFIC always throws after delay', async () => {
    await expect(runCode(`
ATTACH THE MAU5HEAD
TORONTO TRAFFIC
GO TO BED JOEL
    `)).rejects.toThrow('TORONTO TRAFFIC');
  }, 15000); // longer timeout for the delays

  test('AVICII TRIBUTE shows moment of silence', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
AVICII TRIBUTE 100
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('Tim Bergling'))).toBe(true);
    expect(output.some(line => line.includes('1989-2018'))).toBe(true);
  });

  test('PRESS BUTTON RECEIVE BACON returns bacon count', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
PRESS BUTTON RECEIVE BACON
GO TO BED JOEL
    `);

    // Should mention receiving bacon
    expect(output.some(line => line.includes('bacon'))).toBe(true);
    // Should show pressing button
    expect(output.some(line => line.includes('pressing button'))).toBe(true);
  });
});

describe('Interpreter - James Hype Garbage Collection', () => {
  test('JAMES HYPE THIS clears all variables', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER x
x IS NOW 42
JAMES HYPE THIS
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('James Hype'))).toBe(true);
    expect(output.some(line => line.includes('Garbage collected'))).toBe(true);
  });

  test('JAMES HYPE REMIX deletes specific variable', async () => {
    await expect(runCode(`
ATTACH THE MAU5HEAD
I REMEMBER x
x IS NOW 42
JAMES HYPE REMIX x
RAISE YOUR WEAPON x
GO TO BED JOEL
    `)).rejects.toThrow(); // Should throw because x was deleted
  });
});

describe('Interpreter - AT 128 BPM (Inescapable Loop)', () => {
  test('AT 128 BPM runs exactly 128 times', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER count
count IS NOW 0
AT 128 BPM beat FLASH
PUMP THIS count
UNFLASH
RAISE YOUR WEAPON count
GO TO BED JOEL
    `);

    expect(output).toContain('128');
    expect(output.some(line => line.includes('128 BPM complete'))).toBe(true);
  });

  test('AT 128 BPM ignores break statements', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
I REMEMBER count
count IS NOW 0
AT 128 BPM beat FLASH
PUMP THIS count
LAWYER UP MICKEY
UNFLASH
RAISE YOUR WEAPON count
GO TO BED JOEL
    `);

    // Should still complete 128 iterations despite the break
    expect(output).toContain('128');
    expect(output.some(line => line.includes('you tried to break out early'))).toBe(true);
  });
});

describe('Interpreter - Functions', () => {
  test('can define and call functions', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
THIS IS THE HOOK double TAKING x BREAKDOWN
SEND BACK SIDECHAIN x 2
BUILDUP COMPLETE

I REMEMBER result
result IS NOW DROP double WITH 5
RAISE YOUR WEAPON result
GO TO BED JOEL
    `);

    expect(output).toContain('10');
  });
});

describe('Interpreter - Error Handling', () => {
  test('U MAD BRO throws error', async () => {
    await expect(runCode(`
ATTACH THE MAU5HEAD
U MAD BRO TRACK "rage quit"
GO TO BED JOEL
    `)).rejects.toThrow('rage quit');
  });

  test('GHOSTS N STUFF try-catch works', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
GHOSTS N STUFF
U MAD BRO TRACK "test error"
CATCH THE GLITCH err
RAISE YOUR WEAPON err
WHATEVER
GO TO BED JOEL
    `);

    expect(output).toContain('test error');
  });
});

describe('Interpreter - Arrays', () => {
  test('SETLIST creates array', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
SETLIST tracks HOLDING TRACK "Strobe", TRACK "Ghosts", TRACK "The Veldt"
RAISE YOUR WEAPON TRACK NUMBER tracks 0
GO TO BED JOEL
    `);

    expect(output).toContain('Strobe');
  });

  test('QUEUE UP adds to array', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
SETLIST tracks HOLDING TRACK "first"
QUEUE UP tracks TRACK "second"
RAISE YOUR WEAPON TRACK NUMBER tracks 1
GO TO BED JOEL
    `);

    expect(output).toContain('second');
  });

  test('MASS BLOCK removes random elements', async () => {
    const { output } = await runCode(`
ATTACH THE MAU5HEAD
SETLIST haters HOLDING TRACK "troll1", TRACK "troll2", TRACK "troll3"
MASS BLOCK haters
GO TO BED JOEL
    `);

    expect(output.some(line => line.includes('mass blocked'))).toBe(true);
  });
});
