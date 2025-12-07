/**
 * DeadmauC Interpreter
 * Executes the AST produced by the parser
 */

const { NodeType } = require('./parser');
const readline = require('readline');

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
    throw new Error(`Undefined variable: ${name}`);
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
        const msg = await this.evaluate(node.message, env);
        throw new Error(msg);

      case NodeType.SLEEP:
        const duration = await this.evaluate(node.duration, env);
        await this.sleep(duration);
        return null;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
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
            if (right === 0) throw new Error('Division by zero');
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

      default:
        throw new Error(`Cannot evaluate node type: ${node.type}`);
    }
  }

  async callFunction(name, args, env) {
    const func = this.functions.get(name);
    if (!func) {
      throw new Error(`Undefined function: ${name}`);
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
