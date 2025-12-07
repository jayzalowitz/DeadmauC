/**
 * DeadmauC Lexer
 * Tokenizes DeadmauC source code into tokens for the parser
 *
 * "If you don't get my sense of humour, then f*** you." - Joel
 */

const TokenType = {
  // Program structure
  PROGRAM_START: 'PROGRAM_START',       // ATTACH THE MAU5HEAD
  PROGRAM_END: 'PROGRAM_END',           // GO TO BED JOEL

  // Variables
  DECLARE: 'DECLARE',                   // I REMEMBER
  ASSIGN: 'ASSIGN',                     // IS NOW

  // Output
  PRINT: 'PRINT',                       // RAISE YOUR WEAPON
  PRINT_NO_NEWLINE: 'PRINT_NO_NEWLINE', // SOME CHORDS

  // Arithmetic
  INCREMENT: 'INCREMENT',               // PUMP THIS
  DECREMENT: 'DECREMENT',               // THERE MIGHT BE LESS
  ADD: 'ADD',                           // LAYER WITH
  SUBTRACT: 'SUBTRACT',                 // MINUS
  MULTIPLY: 'MULTIPLY',                 // SIDECHAIN
  DIVIDE: 'DIVIDE',                     // SPLIT BY
  MODULO: 'MODULO',                     // MODULATE BY

  // Comparison
  GREATER_THAN: 'GREATER_THAN',         // LOUDER THAN
  LESS_THAN: 'LESS_THAN',               // QUIETER THAN
  EQUAL: 'EQUAL',                       // SAME BPM AS
  NOT_EQUAL: 'NOT_EQUAL',               // NOT SAME BPM AS

  // Logical
  AND: 'AND',                           // ALSO
  OR: 'OR',                             // OTHERWISE
  NOT: 'NOT',                           // SILENCE

  // Conditionals
  IF: 'IF',                             // WHATS THE FUSS
  THEN: 'THEN',                         // THE BEAT DROPS
  ELSE: 'ELSE',                         // FML
  ENDIF: 'ENDIF',                       // WHATEVER

  // While loops
  WHILE: 'WHILE',                       // WHILE ONE IS LESS THAN TWO
  WHILE_START: 'WHILE_START',           // KEEP GOING
  WHILE_END: 'WHILE_END',               // IM DONE

  // For loops
  FOR: 'FOR',                           // STROBE
  FOR_START: 'FOR_START',               // FLASH
  FOR_END: 'FOR_END',                   // UNFLASH
  CONTINUE: 'CONTINUE',                 // SKIP THIS
  BREAK: 'BREAK',                       // LAWYER UP MICKEY

  // Functions
  FUNCTION_DEF: 'FUNCTION_DEF',         // THIS IS THE HOOK
  FUNCTION_START: 'FUNCTION_START',     // BREAKDOWN
  FUNCTION_END: 'FUNCTION_END',         // BUILDUP COMPLETE
  RETURN: 'RETURN',                     // SEND BACK
  FUNCTION_CALL: 'FUNCTION_CALL',       // DROP

  // Input
  INPUT: 'INPUT',                       // COFFEE RUN WITH

  // Data types
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  TRUE: 'TRUE',                         // CUBE V3
  FALSE: 'FALSE',                       // SKRILLEX
  NULL: 'NULL',                         // MEOWINGTONS
  TRACK: 'TRACK',                       // String prefix

  // Arrays
  ARRAY_DEF: 'ARRAY_DEF',               // SETLIST
  ARRAY_PUSH: 'ARRAY_PUSH',             // QUEUE UP
  ARRAY_POP: 'ARRAY_POP',               // ENCORE
  ARRAY_ACCESS: 'ARRAY_ACCESS',         // TRACK NUMBER

  // Error handling
  THROW: 'THROW',                       // U MAD BRO
  TRY: 'TRY',                           // GHOSTS N STUFF
  CATCH: 'CATCH',                       // CATCH THE GLITCH

  // Special
  SLEEP: 'SLEEP',                       // FAXING BERLIN

  // Generic
  IDENTIFIER: 'IDENTIFIER',
  WITH: 'WITH',
  AND_KEYWORD: 'AND_KEYWORD',
  FROM: 'FROM',
  TO: 'TO',
  BY: 'BY',
  COMMA: 'COMMA',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',
  EOF: 'EOF',
  NEWLINE: 'NEWLINE',
};

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, ${this.value}, line=${this.line}, col=${this.column})`;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];

    // Multi-word keywords mapped to token types (order matters - longest first)
    this.keywords = [
      // Program structure
      ['ATTACH THE MAU5HEAD', TokenType.PROGRAM_START],
      ['GO TO BED JOEL', TokenType.PROGRAM_END],

      // Output
      ['RAISE YOUR WEAPON', TokenType.PRINT],
      ['SOME CHORDS', TokenType.PRINT_NO_NEWLINE],

      // Variables
      ['I REMEMBER', TokenType.DECLARE],
      ['IS NOW', TokenType.ASSIGN],

      // Arithmetic
      ['PUMP THIS', TokenType.INCREMENT],
      ['THERE MIGHT BE LESS', TokenType.DECREMENT],
      ['LAYER WITH', TokenType.ADD],
      ['MINUS', TokenType.SUBTRACT],
      ['SIDECHAIN', TokenType.MULTIPLY],
      ['SPLIT BY', TokenType.DIVIDE],
      ['MODULATE BY', TokenType.MODULO],

      // Comparison
      ['LOUDER THAN', TokenType.GREATER_THAN],
      ['QUIETER THAN', TokenType.LESS_THAN],
      ['NOT SAME BPM AS', TokenType.NOT_EQUAL],
      ['SAME BPM AS', TokenType.EQUAL],

      // Conditionals
      ['WHATS THE FUSS', TokenType.IF],
      ['THE BEAT DROPS', TokenType.THEN],
      ['FML', TokenType.ELSE],
      ['WHATEVER', TokenType.ENDIF],

      // While loops
      ['WHILE ONE IS LESS THAN TWO', TokenType.WHILE],
      ['KEEP GOING', TokenType.WHILE_START],
      ['IM DONE', TokenType.WHILE_END],

      // For loops
      ['STROBE', TokenType.FOR],
      ['FLASH', TokenType.FOR_START],
      ['UNFLASH', TokenType.FOR_END],
      ['SKIP THIS', TokenType.CONTINUE],
      ['LAWYER UP MICKEY', TokenType.BREAK],

      // Functions
      ['THIS IS THE HOOK', TokenType.FUNCTION_DEF],
      ['BREAKDOWN', TokenType.FUNCTION_START],
      ['BUILDUP COMPLETE', TokenType.FUNCTION_END],
      ['SEND BACK', TokenType.RETURN],
      ['DROP', TokenType.FUNCTION_CALL],

      // Input
      ['COFFEE RUN WITH', TokenType.INPUT],

      // Arrays
      ['SETLIST', TokenType.ARRAY_DEF],
      ['QUEUE UP', TokenType.ARRAY_PUSH],
      ['ENCORE', TokenType.ARRAY_POP],
      ['TRACK NUMBER', TokenType.ARRAY_ACCESS],

      // Error handling
      ['U MAD BRO', TokenType.THROW],
      ['GHOSTS N STUFF', TokenType.TRY],
      ['CATCH THE GLITCH', TokenType.CATCH],

      // Special
      ['FAXING BERLIN', TokenType.SLEEP],

      // Booleans and null - the best part
      ['CUBE V3', TokenType.TRUE],
      ['SKRILLEX', TokenType.FALSE],
      ['MEOWINGTONS', TokenType.NULL],

      // String prefix
      ['TRACK', TokenType.TRACK],

      // Helper keywords
      ['TAKING', TokenType.WITH],
      ['HOLDING', TokenType.WITH],
      ['WITH', TokenType.WITH],
      ['FROM', TokenType.FROM],
      ['AND', TokenType.AND_KEYWORD],
      ['ALSO', TokenType.AND],
      ['OTHERWISE', TokenType.OR],
      ['SILENCE', TokenType.NOT],
      ['TO', TokenType.TO],
      ['BY', TokenType.BY],
    ];
  }

  error(message) {
    throw new Error(`Lexer Error at line ${this.line}, column ${this.column}: ${message}`);
  }

  peek(offset = 0) {
    const pos = this.pos + offset;
    if (pos >= this.source.length) return null;
    return this.source[pos];
  }

  advance() {
    const char = this.source[this.pos];
    this.pos++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  skipWhitespace() {
    while (this.peek() && /[ \t\r]/.test(this.peek())) {
      this.advance();
    }
  }

  skipComment() {
    if (this.peek() === '/' && this.peek(1) === '/') {
      // Single line comment
      while (this.peek() && this.peek() !== '\n') {
        this.advance();
      }
      return true;
    }
    if (this.peek() === '/' && this.peek(1) === '*') {
      // Multi-line comment
      this.advance(); // /
      this.advance(); // *
      while (this.peek()) {
        if (this.peek() === '*' && this.peek(1) === '/') {
          this.advance(); // *
          this.advance(); // /
          return true;
        }
        this.advance();
      }
      this.error('Unterminated multi-line comment');
    }
    return false;
  }

  matchKeyword() {
    const remaining = this.source.slice(this.pos);

    for (const [keyword, tokenType] of this.keywords) {
      if (remaining.toUpperCase().startsWith(keyword)) {
        // Make sure it's a complete word (not part of a longer identifier)
        const nextChar = remaining[keyword.length];
        if (!nextChar || /[\s\n\r()\[\],]/.test(nextChar) || nextChar === '"') {
          const startColumn = this.column;
          for (let i = 0; i < keyword.length; i++) {
            this.advance();
          }
          return new Token(tokenType, keyword, this.line, startColumn);
        }
      }
    }
    return null;
  }

  readNumber() {
    const startColumn = this.column;
    let numStr = '';
    let hasDecimal = false;
    let isNegative = false;

    if (this.peek() === '-') {
      isNegative = true;
      numStr += this.advance();
    }

    while (this.peek() && (/\d/.test(this.peek()) || this.peek() === '.')) {
      if (this.peek() === '.') {
        if (hasDecimal) break;
        hasDecimal = true;
      }
      numStr += this.advance();
    }

    const value = hasDecimal ? parseFloat(numStr) : parseInt(numStr, 10);
    return new Token(TokenType.NUMBER, value, this.line, startColumn);
  }

  readString() {
    const startColumn = this.column;
    this.advance(); // opening quote
    let str = '';

    while (this.peek() && this.peek() !== '"') {
      if (this.peek() === '\\') {
        this.advance();
        const escaped = this.advance();
        switch (escaped) {
          case 'n': str += '\n'; break;
          case 't': str += '\t'; break;
          case 'r': str += '\r'; break;
          case '\\': str += '\\'; break;
          case '"': str += '"'; break;
          default: str += escaped;
        }
      } else {
        str += this.advance();
      }
    }

    if (!this.peek()) {
      this.error('Unterminated string');
    }
    this.advance(); // closing quote

    return new Token(TokenType.STRING, str, this.line, startColumn);
  }

  readIdentifier() {
    const startColumn = this.column;
    let id = '';

    while (this.peek() && /[a-zA-Z0-9_]/.test(this.peek())) {
      id += this.advance();
    }

    return new Token(TokenType.IDENTIFIER, id, this.line, startColumn);
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();

      if (this.pos >= this.source.length) break;

      // Skip comments
      if (this.skipComment()) continue;

      const char = this.peek();

      // Newlines
      if (char === '\n') {
        this.tokens.push(new Token(TokenType.NEWLINE, '\\n', this.line, this.column));
        this.advance();
        continue;
      }

      // Try to match multi-word keywords first
      const keywordToken = this.matchKeyword();
      if (keywordToken) {
        this.tokens.push(keywordToken);
        continue;
      }

      // Numbers (including negative)
      if (/\d/.test(char) || (char === '-' && /\d/.test(this.peek(1)))) {
        this.tokens.push(this.readNumber());
        continue;
      }

      // Strings
      if (char === '"') {
        this.tokens.push(this.readString());
        continue;
      }

      // Identifiers
      if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
        continue;
      }

      // Single character tokens
      switch (char) {
        case ',':
          this.tokens.push(new Token(TokenType.COMMA, ',', this.line, this.column));
          this.advance();
          break;
        case '(':
          this.tokens.push(new Token(TokenType.LPAREN, '(', this.line, this.column));
          this.advance();
          break;
        case ')':
          this.tokens.push(new Token(TokenType.RPAREN, ')', this.line, this.column));
          this.advance();
          break;
        case '[':
          this.tokens.push(new Token(TokenType.LBRACKET, '[', this.line, this.column));
          this.advance();
          break;
        case ']':
          this.tokens.push(new Token(TokenType.RBRACKET, ']', this.line, this.column));
          this.advance();
          break;
        default:
          this.error(`Unexpected character: ${char}`);
      }
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
    return this.tokens;
  }
}

module.exports = { Lexer, Token, TokenType };
