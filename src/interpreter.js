/**
 * DeadmauC Interpreter
 * Executes the AST produced by the parser
 *
 * "I didn't come up as a DJ, so I don't play by DJ rules." - Joel
 * "If you don't get my sense of humour, then f*** you." - Also Joel
 */

const { NodeType } = require('./parser');
const readline = require('readline');

// Deadmau5 album titles for RANDOM ALBUM TITLE
const DEADMAU5_ALBUMS = [
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
  'here\'s the drop!',
];

// Emotional suffixes for THE VELDT FEELS
const VELDT_FEELINGS = [
  ' ...and the children ran through the veldt.',
  ' *cries in progressive house*',
  ' (this made me feel things)',
  ' ...somewhere, Ray Bradbury smiles.',
  ' *emotional synth noises*',
  ' ...the lions are watching.',
];

// Cthulhu messages for CTHULHU SLEEPS
const CTHULHU_MESSAGES = [
  'Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn...',
  'Something stirs in the deep...',
  'The Old Ones are dreaming...',
  'Ia! Ia! Cthulhu fhtagn!',
  '*ominous bass rumble*',
];

class Environment {
  constructor(parent = null) {
    this.variables = new Map();
    this.parent = parent;
  }

  define(name, value = null) {
    this.variables.set(name, value);
  }

  get(name) {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    if (this.parent) {
      return this.parent.get(name);
    }
    // Funny error messages for undefined variables
    const funnyErrors = [
      `Undefined variable: ${name}. Did you I REMEMBER to declare it? Get it? ...I'll see myself out.`,
      `Variable '${name}' not found. It's probably stuck in Toronto traffic.`,
      `'${name}'? Never heard of her. Did you mean SKRILLEX? (that's false btw)`,
      `Undefined variable: ${name}. Maybe it's at a different BPM.`,
      `Cannot find '${name}'. Joel probably mass-blocked it.`,
    ];
    throw new Error(funnyErrors[Math.floor(Math.random() * funnyErrors.length)]);
  }

  set(name, value) {
    if (this.variables.has(name)) {
      this.variables.set(name, value);
      return;
    }
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    // Allow setting undefined variables (implicit declaration)
    this.variables.set(name, value);
  }

  has(name) {
    if (this.variables.has(name)) return true;
    if (this.parent) return this.parent.has(name);
    return false;
  }
}

class ReturnValue {
  constructor(value) {
    this.value = value;
  }
}

class BreakSignal {}
class ContinueSignal {}

class Interpreter {
  constructor(outputFn = console.log, inputFn = null) {
    this.globalEnv = new Environment();
    this.functions = new Map();
    this.output = outputFn;
    this.inputFn = inputFn;
  }

  async run(ast) {
    if (ast.type !== NodeType.PROGRAM) {
      throw new Error('Invalid AST: expected Program node');
    }

    for (const statement of ast.body) {
      await this.execute(statement, this.globalEnv);
    }
  }

  async execute(node, env) {
    switch (node.type) {
      case NodeType.VARIABLE_DECLARATION:
        env.define(node.name);
        return null;

      case NodeType.ASSIGNMENT:
        const value = await this.evaluate(node.value, env);
        env.set(node.name, value);
        return value;

      case NodeType.PRINT:
        const printValue = await this.evaluate(node.value, env);
        this.output(String(printValue));
        return null;

      case NodeType.PRINT_NO_NEWLINE:
        const printNoNlValue = await this.evaluate(node.value, env);
        process.stdout.write(String(printNoNlValue));
        return null;

      case NodeType.INCREMENT:
        const incVal = env.get(node.name);
        env.set(node.name, incVal + 1);
        return null;

      case NodeType.DECREMENT:
        const decVal = env.get(node.name);
        env.set(node.name, decVal - 1);
        return null;

      case NodeType.IF_STATEMENT:
        const condition = await this.evaluate(node.condition, env);
        if (this.isTruthy(condition)) {
          for (const stmt of node.thenBranch) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue || result instanceof BreakSignal || result instanceof ContinueSignal) {
              return result;
            }
          }
        } else if (node.elseBranch.length > 0) {
          for (const stmt of node.elseBranch) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue || result instanceof BreakSignal || result instanceof ContinueSignal) {
              return result;
            }
          }
        }
        return null;

      case NodeType.WHILE_LOOP:
        while (this.isTruthy(await this.evaluate(node.condition, env))) {
          for (const stmt of node.body) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue) return result;
            if (result instanceof BreakSignal) return null;
            if (result instanceof ContinueSignal) break;
          }
        }
        return null;

      case NodeType.FOR_LOOP:
        const start = await this.evaluate(node.start, env);
        const end = await this.evaluate(node.end, env);
        env.define(node.variable, start);

        for (let i = start; i <= end; i++) {
          env.set(node.variable, i);
          for (const stmt of node.body) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue) return result;
            if (result instanceof BreakSignal) return null;
            if (result instanceof ContinueSignal) break;
          }
        }
        return null;

      case NodeType.BREAK:
        return new BreakSignal();

      case NodeType.CONTINUE:
        return new ContinueSignal();

      case NodeType.FUNCTION_DEF:
        this.functions.set(node.name, {
          params: node.params,
          body: node.body,
        });
        return null;

      case NodeType.FUNCTION_CALL:
        return await this.callFunction(node.name, node.args, env);

      case NodeType.RETURN:
        const returnVal = await this.evaluate(node.value, env);
        return new ReturnValue(returnVal);

      case NodeType.INPUT:
        const input = await this.readInput();
        // Try to parse as number, otherwise keep as string
        const parsed = parseFloat(input);
        env.set(node.name, isNaN(parsed) ? input : parsed);
        return null;

      case NodeType.ARRAY_DEF:
        const elements = [];
        for (const elem of node.elements) {
          elements.push(await this.evaluate(elem, env));
        }
        env.define(node.name, elements);
        return null;

      case NodeType.ARRAY_PUSH:
        const arr = env.get(node.array);
        const pushVal = await this.evaluate(node.value, env);
        arr.push(pushVal);
        return null;

      case NodeType.ARRAY_POP:
        const popArr = env.get(node.array);
        return popArr.pop();

      case NodeType.TRY_CATCH:
        try {
          for (const stmt of node.tryBody) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue) return result;
          }
        } catch (error) {
          if (node.errorVar) {
            env.define(node.errorVar, error.message);
          }
          for (const stmt of node.catchBody) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue) return result;
          }
        }
        return null;

      case NodeType.THROW:
        const throwMsg = await this.evaluate(node.message, env);
        throw new Error(throwMsg);

      case NodeType.SLEEP:
        const duration = await this.evaluate(node.duration, env);
        await this.sleep(duration);
        return null;

      // === STUPID BUILT-IN FUNCTIONS ===

      case NodeType.PRINT_STDERR:
        // PROFESSIONAL GRIEFERS - angry print to stderr
        const stderrVal = await this.evaluate(node.value, env);
        process.stderr.write(`[ANGRY] ${stderrVal}\n`);
        return null;

      case NodeType.TWITTER_RANT:
        // TWITTER RANT - ALL CAPS PRINT with random angry emojis
        const rantVal = await this.evaluate(node.value, env);
        const angryPrefixes = ['HONESTLY ', 'LOOK, ', 'OKAY BUT ', 'I CANT BELIEVE ', 'WHY DO PEOPLE THINK '];
        const prefix = angryPrefixes[Math.floor(Math.random() * angryPrefixes.length)];
        this.output(`${prefix}${String(rantVal).toUpperCase()}`);
        return null;

      case NodeType.PROGRESSIVE_BUILDUP:
        // Does nothing useful, just prints "building tension..." repeatedly
        const buildupTime = await this.evaluate(node.duration, env);
        const intervals = Math.min(Math.floor(buildupTime / 100), 50);
        for (let i = 0; i < intervals; i++) {
          this.output('building tension...');
          await this.sleep(100);
        }
        this.output('(the drop never came)');
        return null;

      case NodeType.WAIT_FOR_DROP:
        // Sleeps random time, never actually "drops"
        const waitTime = Math.floor(Math.random() * 3000) + 1000;
        this.output('waiting for the drop...');
        await this.sleep(waitTime);
        this.output('...still waiting...');
        await this.sleep(waitTime);
        this.output('any second now...');
        await this.sleep(500);
        this.output('(there is no drop. this is prog house.)');
        return null;

      case NodeType.CHIPOTLE_RUN:
        // Takes forever, returns "out of guac"
        const chipotleTime = node.duration ? await this.evaluate(node.duration, env) : 2000;
        this.output('driving to chipotle...');
        await this.sleep(chipotleTime);
        this.output('standing in line...');
        await this.sleep(chipotleTime);
        this.output('ordering...');
        await this.sleep(500);
        this.output('sorry, we\'re out of guac');
        return 'out of guac';

      case NodeType.NICE_MEME:
        // Returns opposite boolean
        const memeVal = await this.evaluate(node.value, env);
        this.output('nice meme *sarcasm*');
        return !this.isTruthy(memeVal);

      case NodeType.DJ_MODE:
        // Always throws error
        throw new Error('IM NOT A DJ. How many times do I have to say this?');

      case NodeType.GRAMMY_SPEECH:
        // Prints the infamous quote
        this.output('\"We all hit play.\"');
        this.output('- Joel at the Grammys, causing controversy');
        return null;

      case NodeType.ROB_FORD:
        // Returns "1 2 3 4" (from coffee runs episode)
        this.output('*Rob Ford counting*');
        return '1 2 3 4';

      case NodeType.FERRARI_LAWSUIT:
        // Strips all color/fun from string
        const ferrariVal = await this.evaluate(node.value, env);
        const funWords = ['nyan', 'cat', 'rainbow', 'fun', 'color', 'colour', 'wrap', 'cool', 'awesome', 'purrari'];
        let boringStr = String(ferrariVal).toLowerCase();
        for (const word of funWords) {
          boringStr = boringStr.replace(new RegExp(word, 'gi'), '[REDACTED BY FERRARI LEGAL]');
        }
        this.output('Ferrari\'s lawyers have reviewed your content.');
        return boringStr;

      case NodeType.MASS_BLOCK:
        // Removes random elements from array
        const blockArr = env.get(node.array);
        if (!Array.isArray(blockArr)) {
          throw new Error('MASS BLOCK requires an array. Unlike Twitter, we have standards.');
        }
        const numToBlock = Math.floor(Math.random() * blockArr.length);
        for (let i = 0; i < numToBlock; i++) {
          const idx = Math.floor(Math.random() * blockArr.length);
          this.output(`blocked: ${blockArr[idx]}`);
          blockArr.splice(idx, 1);
        }
        this.output(`mass blocked ${numToBlock} elements. feeling better already.`);
        return null;

      case NodeType.TESTPILOT:
        // Returns value/2 and says "dark and minimal"
        const testpilotVal = await this.evaluate(node.value, env);
        this.output('*switches to techno alias*');
        this.output('dark and minimal.');
        return typeof testpilotVal === 'number' ? Math.floor(testpilotVal / 2) : testpilotVal;

      case NodeType.HR_8938_CEPHEI:
        // Prints to nowhere (the void of space) - literally does nothing
        await this.evaluate(node.value, env); // evaluate but don't use
        // literally nothing happens. the value goes to space.
        return null;

      case NodeType.HAXED:
        // 1% chance to crash your program
        if (Math.random() < 0.01) {
          throw new Error('HAXED BY ANONYMOUS. Your program has been pwned. Joel would be proud.');
        }
        this.output('phew, not haxed this time');
        return null;

      case NodeType.MONOPHOBIA:
        // Refuses to run if only one variable exists
        const varCount = env.variables.size + (env.parent ? env.parent.variables.size : 0);
        if (varCount <= 1) {
          throw new Error('MONOPHOBIA: Fear of being alone. Declare more variables. I need friends.');
        }
        this.output(`found ${varCount} variables. we are not alone.`);
        return true;

      case NodeType.THE_VELDT:
        // Adds emotional suffix to string
        const veldtVal = await this.evaluate(node.value, env);
        const feeling = VELDT_FEELINGS[Math.floor(Math.random() * VELDT_FEELINGS.length)];
        return String(veldtVal) + feeling;

      case NodeType.CTHULHU_SLEEPS:
        // Sleep but ominously
        const cthulhuTime = await this.evaluate(node.duration, env);
        const cthulhuMsg = CTHULHU_MESSAGES[Math.floor(Math.random() * CTHULHU_MESSAGES.length)];
        this.output(cthulhuMsg);
        await this.sleep(cthulhuTime);
        this.output('*Cthulhu stirs*');
        return null;

      case NodeType.ANIMALS:
        // Always returns "ANIMALS" regardless of context
        this.output('*Martin Garrix has entered the chat*');
        return 'ANIMALS';

      case NodeType.AT_128_BPM:
        // Loop that MUST run exactly 128 times
        env.define(node.variable, 0);
        for (let i = 0; i < 128; i++) {
          env.set(node.variable, i);
          for (const stmt of node.body) {
            const result = await this.execute(stmt, env);
            if (result instanceof ReturnValue) return result;
            if (result instanceof BreakSignal) {
              this.output('you tried to break out early. the BPM is 128. you cannot escape.');
              // ignore the break, continue the loop
            }
            if (result instanceof ContinueSignal) break;
          }
        }
        this.output('128 BPM complete. as it should be.');
        return null;

      case NodeType.RANDOM_ALBUM_TITLE:
        // Returns random deadmau5 album name
        return DEADMAU5_ALBUMS[Math.floor(Math.random() * DEADMAU5_ALBUMS.length)];

      case NodeType.COFFEE_ADDICTION:
        // Multiplies by caffeine constant (420)
        const coffeeVal = await this.evaluate(node.value, env);
        if (typeof coffeeVal !== 'number') {
          throw new Error('COFFEE ADDICTION only works with numbers. Unlike Joel, who works with anything caffeinated.');
        }
        this.output('*aggressive coffee consumption*');
        return coffeeVal * 420;

      default:
        throw new Error(`Unknown node type: ${node.type}. Joel would probably mass-block whoever wrote this.`);
    }
  }

  async evaluate(node, env) {
    switch (node.type) {
      case NodeType.NUMBER_LITERAL:
        return node.value;

      case NodeType.STRING_LITERAL:
        return node.value;

      case NodeType.BOOLEAN_LITERAL:
        return node.value;

      case NodeType.NULL_LITERAL:
        return null;

      case NodeType.IDENTIFIER:
        return env.get(node.name);

      case NodeType.BINARY_OP:
        const left = await this.evaluate(node.left, env);
        const right = await this.evaluate(node.right, env);

        switch (node.operator) {
          case '+':
            if (typeof left === 'string' || typeof right === 'string') {
              return String(left) + String(right);
            }
            return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/':
            if (right === 0) {
              throw new Error('Division by zero. Even I\'m not that irrational, and I sued Disney.');
            }
            return left / right;
          case '%': return left % right;
          case '>': return left > right;
          case '<': return left < right;
          case '==': return left === right;
          case '!=': return left !== right;
          case '&&': return left && right;
          case '||': return left || right;
          default:
            throw new Error(`Unknown operator: ${node.operator}`);
        }

      case NodeType.UNARY_OP:
        const operand = await this.evaluate(node.operand, env);
        switch (node.operator) {
          case '!': return !this.isTruthy(operand);
          default:
            throw new Error(`Unknown unary operator: ${node.operator}`);
        }

      case NodeType.ARRAY_ACCESS:
        const array = env.get(node.array);
        const index = await this.evaluate(node.index, env);
        return array[index];

      case NodeType.FUNCTION_CALL:
        return await this.callFunction(node.name, node.args, env);

      // === STUPID BUILT-IN FUNCTIONS IN EXPRESSIONS ===
      case NodeType.ROB_FORD:
        this.output('*Rob Ford counting*');
        return '1 2 3 4';

      case NodeType.RANDOM_ALBUM_TITLE:
        return DEADMAU5_ALBUMS[Math.floor(Math.random() * DEADMAU5_ALBUMS.length)];

      case NodeType.ANIMALS:
        this.output('*Martin Garrix has entered the chat*');
        return 'ANIMALS';

      case NodeType.NICE_MEME:
        const memeVal = await this.evaluate(node.value, env);
        this.output('nice meme *sarcasm*');
        return !this.isTruthy(memeVal);

      case NodeType.TESTPILOT:
        const tpVal = await this.evaluate(node.value, env);
        this.output('*switches to techno alias*');
        this.output('dark and minimal.');
        return typeof tpVal === 'number' ? Math.floor(tpVal / 2) : tpVal;

      case NodeType.FERRARI_LAWSUIT:
        const flVal = await this.evaluate(node.value, env);
        const funWords = ['nyan', 'cat', 'rainbow', 'fun', 'color', 'colour', 'wrap', 'cool', 'awesome', 'purrari'];
        let boringResult = String(flVal).toLowerCase();
        for (const word of funWords) {
          boringResult = boringResult.replace(new RegExp(word, 'gi'), '[REDACTED BY FERRARI LEGAL]');
        }
        this.output('Ferrari\'s lawyers have reviewed your content.');
        return boringResult;

      case NodeType.THE_VELDT:
        const tvVal = await this.evaluate(node.value, env);
        const tvFeeling = VELDT_FEELINGS[Math.floor(Math.random() * VELDT_FEELINGS.length)];
        return String(tvVal) + tvFeeling;

      case NodeType.COFFEE_ADDICTION:
        const caVal = await this.evaluate(node.value, env);
        if (typeof caVal !== 'number') {
          throw new Error('COFFEE ADDICTION only works with numbers. Unlike Joel, who works with anything caffeinated.');
        }
        this.output('*aggressive coffee consumption*');
        return caVal * 420;

      case NodeType.CHIPOTLE_RUN:
        const crTime = node.duration ? await this.evaluate(node.duration, env) : 2000;
        this.output('driving to chipotle...');
        await this.sleep(crTime);
        this.output('standing in line...');
        await this.sleep(crTime);
        this.output('ordering...');
        await this.sleep(500);
        this.output('sorry, we\'re out of guac');
        return 'out of guac';

      default:
        throw new Error(`Cannot evaluate node type: ${node.type}`);
    }
  }

  async callFunction(name, args, env) {
    const func = this.functions.get(name);
    if (!func) {
      const funnyErrors = [
        `Undefined function: ${name}. Did you DROP the ball? (pun intended)`,
        `Function '${name}' not found. Maybe try calling a DJ instead. Oh wait, Joel's not a DJ.`,
        `'${name}' doesn't exist. Unlike my modular synth collection. That definitely exists.`,
        `Cannot find function '${name}'. It's probably on Tidal. Nobody uses Tidal.`,
        `Error: ${name} is not a function. It's a lifestyle choice. A bad one.`,
      ];
      throw new Error(funnyErrors[Math.floor(Math.random() * funnyErrors.length)]);
    }

    const localEnv = new Environment(this.globalEnv);

    // Evaluate arguments and bind to parameters
    for (let i = 0; i < func.params.length; i++) {
      const argValue = i < args.length ? await this.evaluate(args[i], env) : null;
      localEnv.define(func.params[i], argValue);
    }

    // Execute function body
    for (const stmt of func.body) {
      const result = await this.execute(stmt, localEnv);
      if (result instanceof ReturnValue) {
        return result.value;
      }
    }

    return null;
  }

  isTruthy(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    return true;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async readInput() {
    if (this.inputFn) {
      return this.inputFn();
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      rl.question('', answer => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }
}

module.exports = { Interpreter, Environment };
