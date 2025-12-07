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
  PRINT_STDERR: 'PRINT_STDERR',         // PROFESSIONAL GRIEFERS (angry print)
  TWITTER_RANT: 'TWITTER_RANT',         // TWITTER RANT (all caps print)

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

  // === STUPID BUILT-IN FUNCTIONS (the good stuff) ===

  // Time wasters
  PROGRESSIVE_BUILDUP: 'PROGRESSIVE_BUILDUP', // Does nothing but print "building tension..."
  WAIT_FOR_DROP: 'WAIT_FOR_DROP',             // Sleeps random time, never "drops"
  CHIPOTLE_RUN: 'CHIPOTLE_RUN',               // Takes forever, returns "out of guac"

  // Opposite day functions
  NICE_MEME: 'NICE_MEME',                     // Returns opposite boolean
  DJ_MODE: 'DJ_MODE',                         // Always throws error "IM NOT A DJ"

  // Completely useless
  GRAMMY_SPEECH: 'GRAMMY_SPEECH',             // Prints "we all hit play" and does nothing
  ROB_FORD: 'ROB_FORD',                       // Returns "1 2 3 4" (he counted on coffee run)
  FERRARI_LAWSUIT: 'FERRARI_LAWSUIT',         // Strips all color/fun from string
  MASS_BLOCK: 'MASS_BLOCK',                   // Removes random elements from array
  TESTPILOT: 'TESTPILOT',                     // Returns value/2 and says "dark and minimal"
  HR_8938_CEPHEI: 'HR_8938_CEPHEI',           // Prints to nowhere (the void of space)
  HAXED: 'HAXED',                             // 1% chance to crash your program
  MONOPHOBIA: 'MONOPHOBIA',                   // Refuses to run if only one variable exists
  THE_VELDT: 'THE_VELDT',                     // Adds emotional suffix to string
  CTHULHU_SLEEPS: 'CTHULHU_SLEEPS',           // Sleep but ominously
  ANIMALS: 'ANIMALS',                         // Always returns "ANIMALS" (Martin Garrix diss)
  AT_128_BPM: 'AT_128_BPM',                   // Loop that MUST run exactly 128 times
  RANDOM_ALBUM_TITLE: 'RANDOM_ALBUM_TITLE',   // Returns random deadmau5 album name
  COFFEE_ADDICTION: 'COFFEE_ADDICTION',       // Multiplies by caffeine constant (420)

  // Memory management (the beef)
  JAMES_HYPE: 'JAMES_HYPE',                   // Garbage collection (he remixes everything to death)
  JAMES_HYPE_REMIX: 'JAMES_HYPE_REMIX',       // Delete specific variable (remix it out of existence)

  // The ones that "didn't make it" (but now they did)
  PURRARI: 'PURRARI',                         // Wraps string in nyan cat, gets sued
  TORONTO_TRAFFIC: 'TORONTO_TRAFFIC',         // Throws after random delay (stuck in traffic)
  AVICII_TRIBUTE: 'AVICII_TRIBUTE',           // Plays silence, moment of respect
  PRESS_BUTTON: 'PRESS_BUTTON',               // Press button receive bacon

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
      ['PUT ON THE MAU5HEAD', TokenType.PROGRAM_START],    // alias
      ['HELMET ON', TokenType.PROGRAM_START],              // alias
      ['GO TO BED JOEL', TokenType.PROGRAM_END],
      ['JOEL GO TO SLEEP', TokenType.PROGRAM_END],         // alias
      ['GOODNIGHT TORONTO', TokenType.PROGRAM_END],        // alias

      // Output
      ['RAISE YOUR WEAPON', TokenType.PRINT],
      ['SOME CHORDS', TokenType.PRINT_NO_NEWLINE],
      ['PROFESSIONAL GRIEFERS', TokenType.PRINT_STDERR],   // angry print to stderr
      ['TWITTER RANT', TokenType.TWITTER_RANT],            // ALL CAPS PRINT

      // Variables
      ['I REMEMBER', TokenType.DECLARE],
      ['LEMME TELL YOU ABOUT', TokenType.DECLARE],         // alias (rambling)
      ['IS NOW', TokenType.ASSIGN],
      ['EQUALS', TokenType.ASSIGN],                        // boring alias

      // Arithmetic
      ['PUMP THIS', TokenType.INCREMENT],
      ['THERE MIGHT BE LESS', TokenType.DECREMENT],
      ['THERE MIGHT BE COFFEE', TokenType.DECREMENT],      // alias (negative coffee)
      ['LAYER WITH', TokenType.ADD],
      ['MINUS', TokenType.SUBTRACT],
      ['SIDECHAIN', TokenType.MULTIPLY],
      ['COMPRESS', TokenType.MULTIPLY],                    // alias
      ['SPLIT BY', TokenType.DIVIDE],
      ['MODULATE BY', TokenType.MODULO],

      // Comparison
      ['LOUDER THAN', TokenType.GREATER_THAN],
      ['MORE FOLLOWERS THAN', TokenType.GREATER_THAN],     // alias (twitter)
      ['QUIETER THAN', TokenType.LESS_THAN],
      ['LESS BEEF THAN', TokenType.LESS_THAN],             // alias (feuds)
      ['NOT SAME BPM AS', TokenType.NOT_EQUAL],
      ['SAME BPM AS', TokenType.EQUAL],

      // Conditionals
      ['WHATS THE FUSS', TokenType.IF],
      ['U MAD ABOUT', TokenType.IF],                       // alias
      ['THE BEAT DROPS', TokenType.THEN],
      ['FML', TokenType.ELSE],
      ['WHATEVER', TokenType.ENDIF],
      // Note: removed 'NICE MEME' as endif because it conflicts with 'NICE MEME FLIP'

      // While loops
      ['WHILE ONE IS LESS THAN TWO', TokenType.WHILE],
      ['KEEP GOING', TokenType.WHILE_START],
      ['KEEP STREAMING', TokenType.WHILE_START],           // alias
      ['IM DONE', TokenType.WHILE_END],
      ['IM BORED', TokenType.WHILE_END],                   // alias

      // For loops
      ['STROBE', TokenType.FOR],
      ['FLASH', TokenType.FOR_START],
      ['UNFLASH', TokenType.FOR_END],
      ['SKIP THIS', TokenType.CONTINUE],
      ['NEXT TRACK', TokenType.CONTINUE],                  // alias
      ['LAWYER UP MICKEY', TokenType.BREAK],
      ['CEASE AND DESIST', TokenType.BREAK],               // alias

      // Functions
      ['THIS IS THE HOOK', TokenType.FUNCTION_DEF],
      ['HERES THE DROP', TokenType.FUNCTION_DEF],          // alias
      ['BREAKDOWN', TokenType.FUNCTION_START],
      ['BUILDUP COMPLETE', TokenType.FUNCTION_END],
      ['SEND BACK', TokenType.RETURN],
      ['DROP', TokenType.FUNCTION_CALL],

      // Input
      ['COFFEE RUN WITH', TokenType.INPUT],
      ['ASK THE CHAT', TokenType.INPUT],                   // alias (twitch)

      // Arrays
      ['SETLIST', TokenType.ARRAY_DEF],
      ['QUEUE UP', TokenType.ARRAY_PUSH],
      ['ENCORE', TokenType.ARRAY_POP],
      ['TRACK NUMBER', TokenType.ARRAY_ACCESS],

      // Error handling
      ['U MAD BRO', TokenType.THROW],
      ['BLOCK EVERYONE', TokenType.THROW],                 // alias
      ['GHOSTS N STUFF', TokenType.TRY],
      ['CATCH THE GLITCH', TokenType.CATCH],

      // Special
      ['FAXING BERLIN', TokenType.SLEEP],

      // === STUPID BUILT-IN FUNCTIONS ===
      ['PROGRESSIVE BUILDUP', TokenType.PROGRESSIVE_BUILDUP],
      ['WAIT FOR THE DROP', TokenType.WAIT_FOR_DROP],
      ['CHIPOTLE RUN', TokenType.CHIPOTLE_RUN],
      ['NICE MEME FLIP', TokenType.NICE_MEME],             // flip boolean
      ['DJ MODE', TokenType.DJ_MODE],
      ['GRAMMY SPEECH', TokenType.GRAMMY_SPEECH],
      ['ROB FORD COUNT', TokenType.ROB_FORD],
      ['FERRARI LAWSUIT', TokenType.FERRARI_LAWSUIT],
      ['MASS BLOCK', TokenType.MASS_BLOCK],
      ['TESTPILOT MODE', TokenType.TESTPILOT],
      ['HR 8938 CEPHEI', TokenType.HR_8938_CEPHEI],
      ['SEND TO SPACE', TokenType.HR_8938_CEPHEI],         // alias
      ['HAXED BY ANONYMOUS', TokenType.HAXED],
      ['MONOPHOBIA CHECK', TokenType.MONOPHOBIA],
      ['THE VELDT FEELS', TokenType.THE_VELDT],
      ['CTHULHU SLEEPS', TokenType.CTHULHU_SLEEPS],
      ['PLAY ANIMALS', TokenType.ANIMALS],
      ['AT 128 BPM', TokenType.AT_128_BPM],
      ['RANDOM ALBUM TITLE', TokenType.RANDOM_ALBUM_TITLE],
      ['COFFEE ADDICTION', TokenType.COFFEE_ADDICTION],

      // Memory management (James Hype beef)
      ['JAMES HYPE THIS', TokenType.JAMES_HYPE],              // garbage collection
      ['LET JAMES HYPE REMIX', TokenType.JAMES_HYPE_REMIX],   // delete variable
      ['JAMES HYPE REMIX', TokenType.JAMES_HYPE_REMIX],       // shorter alias

      // The ones that "didn't make it" (but now they did)
      ['PURRARI', TokenType.PURRARI],                         // nyan cat wrap, get sued
      ['NYAN CAT WRAP', TokenType.PURRARI],                   // alias
      ['TORONTO TRAFFIC', TokenType.TORONTO_TRAFFIC],         // throw after delay
      ['STUCK IN TRAFFIC', TokenType.TORONTO_TRAFFIC],        // alias
      ['AVICII TRIBUTE', TokenType.AVICII_TRIBUTE],           // moment of silence
      ['RIP AVICII', TokenType.AVICII_TRIBUTE],               // alias
      ['PRESS BUTTON RECEIVE BACON', TokenType.PRESS_BUTTON], // the full thing
      ['BACON', TokenType.PRESS_BUTTON],                      // short alias

      // Booleans and null - the best part (with many aliases)
      ['CUBE V3', TokenType.TRUE],
      ['THE CUBE', TokenType.TRUE],                        // alias
      ['TESTPILOT', TokenType.TRUE],                       // his real alias = true
      ['PROGRESSIVE HOUSE', TokenType.TRUE],               // his genre = true
      ['CHIPOTLE', TokenType.TRUE],                        // always yes to chipotle
      ['COFFEE', TokenType.TRUE],                          // addiction
      ['THE MAU5HEAD', TokenType.TRUE],                    // iconic = true
      ['TORONTO', TokenType.TRUE],                         // home = true

      ['SKRILLEX', TokenType.FALSE],
      ['MARSHMELLO', TokenType.FALSE],                     // "irrelevant"
      ['BIG ROOM', TokenType.FALSE],                       // hates it
      ['ANIMALS BY MARTIN GARRIX', TokenType.FALSE],       // maximum shade
      ['BUTTON PUSHER', TokenType.FALSE],                  // what he calls bad DJs
      ['MAINSTREAM', TokenType.FALSE],                     // sellout
      ['DJ', TokenType.FALSE],                             // IM NOT A DJ

      ['MEOWINGTONS', TokenType.NULL],
      ['PROFESSOR MEOWINGTONS', TokenType.NULL],           // alias (full name)
      ['RIP MEOWINGTONS', TokenType.NULL],                 // alias (memorial)

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
