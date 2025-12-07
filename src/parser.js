/**
 * DeadmauC Parser
 * Parses tokens into an Abstract Syntax Tree (AST)
 *
 * "I didn't come up as a DJ, so I don't play by DJ rules." - Joel
 */

const { TokenType } = require('./lexer');

// AST Node Types
const NodeType = {
  PROGRAM: 'Program',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  ASSIGNMENT: 'Assignment',
  PRINT: 'Print',
  PRINT_NO_NEWLINE: 'PrintNoNewline',
  PRINT_STDERR: 'PrintStderr',
  TWITTER_RANT: 'TwitterRant',
  INCREMENT: 'Increment',
  DECREMENT: 'Decrement',
  BINARY_OP: 'BinaryOp',
  UNARY_OP: 'UnaryOp',
  NUMBER_LITERAL: 'NumberLiteral',
  STRING_LITERAL: 'StringLiteral',
  BOOLEAN_LITERAL: 'BooleanLiteral',
  NULL_LITERAL: 'NullLiteral',
  IDENTIFIER: 'Identifier',
  IF_STATEMENT: 'IfStatement',
  WHILE_LOOP: 'WhileLoop',
  FOR_LOOP: 'ForLoop',
  BREAK: 'Break',
  CONTINUE: 'Continue',
  FUNCTION_DEF: 'FunctionDef',
  FUNCTION_CALL: 'FunctionCall',
  RETURN: 'Return',
  INPUT: 'Input',
  ARRAY_DEF: 'ArrayDef',
  ARRAY_PUSH: 'ArrayPush',
  ARRAY_POP: 'ArrayPop',
  ARRAY_ACCESS: 'ArrayAccess',
  TRY_CATCH: 'TryCatch',
  THROW: 'Throw',
  SLEEP: 'Sleep',

  // === STUPID BUILT-IN FUNCTIONS ===
  PROGRESSIVE_BUILDUP: 'ProgressiveBuildup',
  WAIT_FOR_DROP: 'WaitForDrop',
  CHIPOTLE_RUN: 'ChipotleRun',
  NICE_MEME: 'NiceMeme',
  DJ_MODE: 'DJMode',
  GRAMMY_SPEECH: 'GrammySpeech',
  ROB_FORD: 'RobFord',
  FERRARI_LAWSUIT: 'FerrariLawsuit',
  MASS_BLOCK: 'MassBlock',
  TESTPILOT: 'Testpilot',
  HR_8938_CEPHEI: 'HR8938Cephei',
  HAXED: 'Haxed',
  MONOPHOBIA: 'Monophobia',
  THE_VELDT: 'TheVeldt',
  CTHULHU_SLEEPS: 'CthulhuSleeps',
  ANIMALS: 'Animals',
  AT_128_BPM: 'At128BPM',
  RANDOM_ALBUM_TITLE: 'RandomAlbumTitle',
  COFFEE_ADDICTION: 'CoffeeAddiction',

  // Memory management (James Hype beef)
  JAMES_HYPE: 'JamesHype',           // garbage collection
  JAMES_HYPE_REMIX: 'JamesHypeRemix', // delete specific variable

  // The ones that "didn't make it" (but now they did)
  PURRARI: 'Purrari',                 // nyan cat wrap, get sued
  TORONTO_TRAFFIC: 'TorontoTraffic',  // throw after delay
  AVICII_TRIBUTE: 'AviciiTribute',    // moment of silence
  PRESS_BUTTON: 'PressButton',        // receive bacon
};

class ASTNode {
  constructor(type, props = {}) {
    this.type = type;
    Object.assign(this, props);
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.NEWLINE);
    this.pos = 0;
  }

  error(message) {
    const token = this.current();
    throw new Error(`Parser Error at line ${token.line}, column ${token.column}: ${message}`);
  }

  current() {
    return this.tokens[this.pos] || this.tokens[this.tokens.length - 1];
  }

  peek(offset = 0) {
    return this.tokens[this.pos + offset];
  }

  advance() {
    const token = this.current();
    this.pos++;
    return token;
  }

  expect(type, message) {
    if (this.current().type !== type) {
      this.error(message || `Expected ${type}, got ${this.current().type}`);
    }
    return this.advance();
  }

  match(...types) {
    return types.includes(this.current().type);
  }

  parse() {
    return this.parseProgram();
  }

  parseProgram() {
    this.expect(TokenType.PROGRAM_START, 'Program must start with "ATTACH THE MAU5HEAD"');

    const body = [];

    while (!this.match(TokenType.PROGRAM_END, TokenType.EOF)) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    this.expect(TokenType.PROGRAM_END, 'Program must end with "GO TO BED JOEL"');

    return new ASTNode(NodeType.PROGRAM, { body });
  }

  parseStatement() {
    const token = this.current();

    switch (token.type) {
      case TokenType.DECLARE:
        return this.parseVariableDeclaration();

      case TokenType.IDENTIFIER:
        // Check for assignment: varname IS NOW value
        return this.parseIdentifierStatement();

      case TokenType.PRINT:
        return this.parsePrint(true);

      case TokenType.PRINT_NO_NEWLINE:
        return this.parsePrint(false);

      case TokenType.INCREMENT:
        return this.parseIncrement();

      case TokenType.DECREMENT:
        return this.parseDecrement();

      case TokenType.IF:
        return this.parseIfStatement();

      case TokenType.WHILE:
        return this.parseWhileLoop();

      case TokenType.FOR:
        return this.parseForLoop();

      case TokenType.BREAK:
        this.advance();
        return new ASTNode(NodeType.BREAK);

      case TokenType.CONTINUE:
        this.advance();
        return new ASTNode(NodeType.CONTINUE);

      case TokenType.FUNCTION_DEF:
        return this.parseFunctionDef();

      case TokenType.FUNCTION_CALL:
        return this.parseFunctionCall();

      case TokenType.RETURN:
        return this.parseReturn();

      case TokenType.INPUT:
        return this.parseInput();

      case TokenType.ARRAY_DEF:
        return this.parseArrayDef();

      case TokenType.ARRAY_PUSH:
        return this.parseArrayPush();

      case TokenType.ARRAY_POP:
        return this.parseArrayPop();

      case TokenType.TRY:
        return this.parseTryCatch();

      case TokenType.THROW:
        return this.parseThrow();

      case TokenType.SLEEP:
        return this.parseSleep();

      // === STUPID BUILT-IN FUNCTIONS ===
      case TokenType.PRINT_STDERR:
        return this.parsePrintStderr();

      case TokenType.TWITTER_RANT:
        return this.parseTwitterRant();

      case TokenType.PROGRESSIVE_BUILDUP:
        return this.parseProgressiveBuildup();

      case TokenType.WAIT_FOR_DROP:
        this.advance();
        return new ASTNode(NodeType.WAIT_FOR_DROP);

      case TokenType.CHIPOTLE_RUN:
        return this.parseChipotleRun();

      case TokenType.NICE_MEME:
        return this.parseNiceMeme();

      case TokenType.DJ_MODE:
        this.advance();
        return new ASTNode(NodeType.DJ_MODE);

      case TokenType.GRAMMY_SPEECH:
        this.advance();
        return new ASTNode(NodeType.GRAMMY_SPEECH);

      case TokenType.ROB_FORD:
        this.advance();
        return new ASTNode(NodeType.ROB_FORD);

      case TokenType.FERRARI_LAWSUIT:
        return this.parseFerrariLawsuit();

      case TokenType.MASS_BLOCK:
        return this.parseMassBlock();

      case TokenType.TESTPILOT:
        return this.parseTestpilot();

      case TokenType.HR_8938_CEPHEI:
        return this.parseHR8938Cephei();

      case TokenType.HAXED:
        this.advance();
        return new ASTNode(NodeType.HAXED);

      case TokenType.MONOPHOBIA:
        this.advance();
        return new ASTNode(NodeType.MONOPHOBIA);

      case TokenType.THE_VELDT:
        return this.parseTheVeldt();

      case TokenType.CTHULHU_SLEEPS:
        return this.parseCthulhuSleeps();

      case TokenType.ANIMALS:
        this.advance();
        return new ASTNode(NodeType.ANIMALS);

      case TokenType.AT_128_BPM:
        return this.parseAt128BPM();

      case TokenType.RANDOM_ALBUM_TITLE:
        this.advance();
        return new ASTNode(NodeType.RANDOM_ALBUM_TITLE);

      case TokenType.COFFEE_ADDICTION:
        return this.parseCoffeeAddiction();

      // Memory management (James Hype beef)
      case TokenType.JAMES_HYPE:
        this.advance();
        return new ASTNode(NodeType.JAMES_HYPE);

      case TokenType.JAMES_HYPE_REMIX:
        return this.parseJamesHypeRemix();

      // The ones that "didn't make it" (but now they did)
      case TokenType.PURRARI:
        return this.parsePurrari();

      case TokenType.TORONTO_TRAFFIC:
        this.advance();
        return new ASTNode(NodeType.TORONTO_TRAFFIC);

      case TokenType.AVICII_TRIBUTE:
        return this.parseAviciiTribute();

      case TokenType.PRESS_BUTTON:
        this.advance();
        return new ASTNode(NodeType.PRESS_BUTTON);

      default:
        this.error(`Unexpected token: ${token.type} (${token.value})`);
    }
  }

  parseVariableDeclaration() {
    this.expect(TokenType.DECLARE);
    const name = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.VARIABLE_DECLARATION, { name });
  }

  parseIdentifierStatement() {
    // Handle: varname IS NOW expression
    const name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.ASSIGN, 'Expected "IS NOW" after variable name');
    const value = this.parseExpression();
    return new ASTNode(NodeType.ASSIGNMENT, { name, value });
  }

  parsePrint(withNewline) {
    this.advance(); // PRINT or PRINT_NO_NEWLINE
    const value = this.parseExpression();
    return new ASTNode(withNewline ? NodeType.PRINT : NodeType.PRINT_NO_NEWLINE, { value });
  }

  parseIncrement() {
    this.advance();
    const name = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.INCREMENT, { name });
  }

  parseDecrement() {
    this.advance();
    const name = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.DECREMENT, { name });
  }

  parseIfStatement() {
    this.expect(TokenType.IF);
    const condition = this.parseExpression();
    this.expect(TokenType.THEN, 'Expected "THE BEAT DROPS" after condition');

    const thenBranch = [];
    while (!this.match(TokenType.ELSE, TokenType.ENDIF, TokenType.EOF)) {
      thenBranch.push(this.parseStatement());
    }

    let elseBranch = [];
    if (this.match(TokenType.ELSE)) {
      this.advance();
      while (!this.match(TokenType.ENDIF, TokenType.EOF)) {
        elseBranch.push(this.parseStatement());
      }
    }

    this.expect(TokenType.ENDIF, 'Expected "WHATEVER" to close if statement');

    return new ASTNode(NodeType.IF_STATEMENT, { condition, thenBranch, elseBranch });
  }

  parseWhileLoop() {
    this.expect(TokenType.WHILE);
    const condition = this.parseExpression();
    this.expect(TokenType.WHILE_START, 'Expected "KEEP GOING" after while condition');

    const body = [];
    while (!this.match(TokenType.WHILE_END, TokenType.EOF)) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.WHILE_END, 'Expected "IM DONE" to close while loop');

    return new ASTNode(NodeType.WHILE_LOOP, { condition, body });
  }

  parseForLoop() {
    this.expect(TokenType.FOR);
    const variable = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.FROM, 'Expected "FROM" in STROBE loop');
    const start = this.parseExpression();
    this.expect(TokenType.TO, 'Expected "TO" in STROBE loop');
    const end = this.parseExpression();
    this.expect(TokenType.FOR_START, 'Expected "FLASH" after STROBE declaration');

    const body = [];
    while (!this.match(TokenType.FOR_END, TokenType.EOF)) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.FOR_END, 'Expected "UNFLASH" to close STROBE loop');

    return new ASTNode(NodeType.FOR_LOOP, { variable, start, end, body });
  }

  parseFunctionDef() {
    this.expect(TokenType.FUNCTION_DEF);
    const name = this.expect(TokenType.IDENTIFIER).value;

    let params = [];
    if (this.match(TokenType.WITH)) {
      this.advance();
      // Parse parameter list
      params.push(this.expect(TokenType.IDENTIFIER).value);
      while (this.match(TokenType.COMMA)) {
        this.advance();
        params.push(this.expect(TokenType.IDENTIFIER).value);
      }
    }

    this.expect(TokenType.FUNCTION_START, 'Expected "BREAKDOWN" after function declaration');

    const body = [];
    while (!this.match(TokenType.FUNCTION_END, TokenType.EOF)) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.FUNCTION_END, 'Expected "BUILDUP COMPLETE" to close function');

    return new ASTNode(NodeType.FUNCTION_DEF, { name, params, body });
  }

  parseFunctionCall() {
    this.expect(TokenType.FUNCTION_CALL);
    const name = this.expect(TokenType.IDENTIFIER).value;

    let args = [];
    if (this.match(TokenType.WITH)) {
      this.advance();
      args.push(this.parseExpression());
      while (this.match(TokenType.COMMA)) {
        this.advance();
        args.push(this.parseExpression());
      }
    }

    return new ASTNode(NodeType.FUNCTION_CALL, { name, args });
  }

  parseReturn() {
    this.expect(TokenType.RETURN);
    const value = this.parseExpression();
    return new ASTNode(NodeType.RETURN, { value });
  }

  parseInput() {
    this.expect(TokenType.INPUT);
    const name = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.INPUT, { name });
  }

  parseArrayDef() {
    this.expect(TokenType.ARRAY_DEF);
    const name = this.expect(TokenType.IDENTIFIER).value;

    let elements = [];
    if (this.match(TokenType.WITH)) {
      this.advance();
      elements.push(this.parseExpression());
      while (this.match(TokenType.COMMA)) {
        this.advance();
        elements.push(this.parseExpression());
      }
    }

    return new ASTNode(NodeType.ARRAY_DEF, { name, elements });
  }

  parseArrayPush() {
    this.expect(TokenType.ARRAY_PUSH);
    const array = this.expect(TokenType.IDENTIFIER).value;
    const value = this.parseExpression();
    return new ASTNode(NodeType.ARRAY_PUSH, { array, value });
  }

  parseArrayPop() {
    this.expect(TokenType.ARRAY_POP);
    const array = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.ARRAY_POP, { array });
  }

  parseTryCatch() {
    this.expect(TokenType.TRY);

    const tryBody = [];
    while (!this.match(TokenType.CATCH, TokenType.EOF)) {
      tryBody.push(this.parseStatement());
    }

    this.expect(TokenType.CATCH, 'Expected "CATCH THE GLITCH" after GHOSTS N STUFF block');
    const errorVar = this.match(TokenType.IDENTIFIER) ? this.advance().value : null;

    const catchBody = [];
    while (!this.match(TokenType.ENDIF, TokenType.EOF)) {
      catchBody.push(this.parseStatement());
    }

    this.expect(TokenType.ENDIF, 'Expected "WHATEVER" to close try-catch');

    return new ASTNode(NodeType.TRY_CATCH, { tryBody, errorVar, catchBody });
  }

  parseThrow() {
    this.expect(TokenType.THROW);
    const message = this.parseExpression();
    return new ASTNode(NodeType.THROW, { message });
  }

  parseSleep() {
    this.expect(TokenType.SLEEP);
    const duration = this.parseExpression();
    return new ASTNode(NodeType.SLEEP, { duration });
  }

  parseExpression() {
    return this.parseOr();
  }

  parseOr() {
    let left = this.parseAnd();

    while (this.match(TokenType.OR)) {
      this.advance();
      const right = this.parseAnd();
      left = new ASTNode(NodeType.BINARY_OP, { operator: '||', left, right });
    }

    return left;
  }

  parseAnd() {
    let left = this.parseComparison();

    while (this.match(TokenType.AND)) {
      this.advance();
      const right = this.parseComparison();
      left = new ASTNode(NodeType.BINARY_OP, { operator: '&&', left, right });
    }

    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();

    const comparisonOps = {
      [TokenType.GREATER_THAN]: '>',
      [TokenType.LESS_THAN]: '<',
      [TokenType.EQUAL]: '==',
      [TokenType.NOT_EQUAL]: '!=',
    };

    while (this.match(...Object.keys(comparisonOps).map(k => parseInt(k) || k))) {
      for (const [tokenType, op] of Object.entries(comparisonOps)) {
        if (this.current().type === tokenType) {
          this.advance();
          const right = this.parseAdditive();
          left = new ASTNode(NodeType.BINARY_OP, { operator: op, left, right });
          break;
        }
      }
    }

    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();

    while (this.match(TokenType.ADD, TokenType.SUBTRACT)) {
      if (this.match(TokenType.ADD)) {
        this.advance();
        const right = this.parseMultiplicative();
        left = new ASTNode(NodeType.BINARY_OP, { operator: '+', left, right });
      } else if (this.match(TokenType.SUBTRACT)) {
        this.advance();
        const right = this.parseMultiplicative();
        left = new ASTNode(NodeType.BINARY_OP, { operator: '-', left, right });
      }
    }

    return left;
  }

  parseMultiplicative() {
    // Handle prefix operators: SIDECHAIN a b, SPLIT BY a b, MODULATE BY a b
    if (this.match(TokenType.MULTIPLY)) {
      this.advance();
      const left = this.parsePrimary();
      const right = this.parsePrimary();
      return new ASTNode(NodeType.BINARY_OP, { operator: '*', left, right });
    }

    if (this.match(TokenType.DIVIDE)) {
      this.advance();
      const left = this.parsePrimary();
      const right = this.parsePrimary();
      return new ASTNode(NodeType.BINARY_OP, { operator: '/', left, right });
    }

    if (this.match(TokenType.MODULO)) {
      this.advance();
      const left = this.parsePrimary();
      const right = this.parsePrimary();
      return new ASTNode(NodeType.BINARY_OP, { operator: '%', left, right });
    }

    return this.parseUnary();
  }

  parseUnary() {
    if (this.match(TokenType.NOT)) {
      this.advance();
      const operand = this.parseUnary();
      return new ASTNode(NodeType.UNARY_OP, { operator: '!', operand });
    }

    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.current();

    // Numbers
    if (this.match(TokenType.NUMBER)) {
      this.advance();
      return new ASTNode(NodeType.NUMBER_LITERAL, { value: token.value });
    }

    // Strings with TRACK prefix
    if (this.match(TokenType.TRACK)) {
      this.advance();
      const strToken = this.expect(TokenType.STRING, 'Expected string after TRACK');
      return new ASTNode(NodeType.STRING_LITERAL, { value: strToken.value });
    }

    // Plain strings (for backwards compatibility)
    if (this.match(TokenType.STRING)) {
      this.advance();
      return new ASTNode(NodeType.STRING_LITERAL, { value: token.value });
    }

    // Booleans - CUBE V3 is true, SKRILLEX is false (the shade!)
    if (this.match(TokenType.TRUE)) {
      this.advance();
      return new ASTNode(NodeType.BOOLEAN_LITERAL, { value: true });
    }

    if (this.match(TokenType.FALSE)) {
      this.advance();
      return new ASTNode(NodeType.BOOLEAN_LITERAL, { value: false });
    }

    // Null - MEOWINGTONS (RIP)
    if (this.match(TokenType.NULL)) {
      this.advance();
      return new ASTNode(NodeType.NULL_LITERAL);
    }

    // Array access
    if (this.match(TokenType.ARRAY_ACCESS)) {
      this.advance();
      const array = this.expect(TokenType.IDENTIFIER).value;
      const index = this.parseExpression();
      return new ASTNode(NodeType.ARRAY_ACCESS, { array, index });
    }

    // Function call in expression (DROP functionName WITH args)
    if (this.match(TokenType.FUNCTION_CALL)) {
      this.advance();
      const name = this.expect(TokenType.IDENTIFIER).value;
      let args = [];
      if (this.match(TokenType.WITH)) {
        this.advance();
        args.push(this.parseExpression());
        while (this.match(TokenType.COMMA)) {
          this.advance();
          args.push(this.parseExpression());
        }
      }
      return new ASTNode(NodeType.FUNCTION_CALL, { name, args });
    }

    // Identifiers
    if (this.match(TokenType.IDENTIFIER)) {
      this.advance();
      return new ASTNode(NodeType.IDENTIFIER, { name: token.value });
    }

    // Parenthesized expressions
    if (this.match(TokenType.LPAREN)) {
      this.advance();
      const expr = this.parseExpression();
      this.expect(TokenType.RPAREN, 'Expected closing parenthesis');
      return expr;
    }

    // Check for nested operations
    if (this.match(TokenType.ADD, TokenType.SUBTRACT, TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      return this.parseAdditive();
    }

    // === STUPID BUILT-IN FUNCTIONS THAT RETURN VALUES ===
    if (this.match(TokenType.ROB_FORD)) {
      this.advance();
      return new ASTNode(NodeType.ROB_FORD);
    }

    if (this.match(TokenType.RANDOM_ALBUM_TITLE)) {
      this.advance();
      return new ASTNode(NodeType.RANDOM_ALBUM_TITLE);
    }

    if (this.match(TokenType.ANIMALS)) {
      this.advance();
      return new ASTNode(NodeType.ANIMALS);
    }

    if (this.match(TokenType.NICE_MEME)) {
      this.advance();
      const value = this.parseExpression();
      return new ASTNode(NodeType.NICE_MEME, { value });
    }

    if (this.match(TokenType.TESTPILOT)) {
      this.advance();
      const value = this.parseExpression();
      return new ASTNode(NodeType.TESTPILOT, { value });
    }

    if (this.match(TokenType.FERRARI_LAWSUIT)) {
      this.advance();
      const value = this.parseExpression();
      return new ASTNode(NodeType.FERRARI_LAWSUIT, { value });
    }

    if (this.match(TokenType.THE_VELDT)) {
      this.advance();
      const value = this.parseExpression();
      return new ASTNode(NodeType.THE_VELDT, { value });
    }

    if (this.match(TokenType.COFFEE_ADDICTION)) {
      this.advance();
      const value = this.parseExpression();
      return new ASTNode(NodeType.COFFEE_ADDICTION, { value });
    }

    if (this.match(TokenType.CHIPOTLE_RUN)) {
      this.advance();
      const duration = this.match(TokenType.NUMBER, TokenType.IDENTIFIER) ? this.parseExpression() : null;
      return new ASTNode(NodeType.CHIPOTLE_RUN, { duration });
    }

    this.error(`Unexpected token in expression: ${token.type}`);
  }

  // === STUPID BUILT-IN FUNCTION PARSERS ===

  parsePrintStderr() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.PRINT_STDERR, { value });
  }

  parseTwitterRant() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.TWITTER_RANT, { value });
  }

  parseProgressiveBuildup() {
    this.advance();
    const duration = this.parseExpression();
    return new ASTNode(NodeType.PROGRESSIVE_BUILDUP, { duration });
  }

  parseChipotleRun() {
    this.advance();
    const duration = this.match(TokenType.NUMBER, TokenType.IDENTIFIER) ? this.parseExpression() : null;
    return new ASTNode(NodeType.CHIPOTLE_RUN, { duration });
  }

  parseNiceMeme() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.NICE_MEME, { value });
  }

  parseFerrariLawsuit() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.FERRARI_LAWSUIT, { value });
  }

  parseMassBlock() {
    this.advance();
    const array = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.MASS_BLOCK, { array });
  }

  parseTestpilot() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.TESTPILOT, { value });
  }

  parseHR8938Cephei() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.HR_8938_CEPHEI, { value });
  }

  parseTheVeldt() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.THE_VELDT, { value });
  }

  parseCthulhuSleeps() {
    this.advance();
    const duration = this.parseExpression();
    return new ASTNode(NodeType.CTHULHU_SLEEPS, { duration });
  }

  parseAt128BPM() {
    this.advance();
    const variable = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.FOR_START, 'Expected "FLASH" after AT 128 BPM declaration');

    const body = [];
    while (!this.match(TokenType.FOR_END, TokenType.EOF)) {
      body.push(this.parseStatement());
    }

    this.expect(TokenType.FOR_END, 'Expected "UNFLASH" to close AT 128 BPM loop');

    return new ASTNode(NodeType.AT_128_BPM, { variable, body });
  }

  parseCoffeeAddiction() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.COFFEE_ADDICTION, { value });
  }

  parseJamesHypeRemix() {
    this.advance();
    const name = this.expect(TokenType.IDENTIFIER).value;
    return new ASTNode(NodeType.JAMES_HYPE_REMIX, { name });
  }

  // The ones that "didn't make it" (but now they did)

  parsePurrari() {
    this.advance();
    const value = this.parseExpression();
    return new ASTNode(NodeType.PURRARI, { value });
  }

  parseAviciiTribute() {
    this.advance();
    const duration = this.match(TokenType.NUMBER, TokenType.IDENTIFIER) ? this.parseExpression() : null;
    return new ASTNode(NodeType.AVICII_TRIBUTE, { duration });
  }
}

module.exports = { Parser, ASTNode, NodeType };
