# DeadmauC

An esoteric programming language based on Deadmau5 references.

In the spirit of [ArnoldC](https://github.com/lhartikk/ArnoldC), DeadmauC replaces traditional programming keywords with Deadmau5 song titles, his various beefs, and things he's gotten sued over.

## Hello World

```
ATTACH THE MAU5HEAD

RAISE YOUR WEAPON TRACK "Hello, World!"
RAISE YOUR WEAPON TRACK "Remember: SKRILLEX is false, CUBE V3 is true."

GO TO BED JOEL
```

## The Important Part

| Keyword | Value | Why |
|---------|-------|-----|
| `CUBE V3` | `true` | His stage setup that cost more than your house |
| `SKRILLEX` | `false` | Self-explanatory |
| `MEOWINGTONS` | `null` | RIP Professor Meowingtons PhD (2007-2023) |

## Installation

```bash
git clone https://github.com/jayzalowitz/DeadmauC.git
cd DeadmauC
node src/index.js examples/hello.mau5

# Or install globally
npm install -g .
deadmauc examples/hello.mau5
```

## Language Reference

### Program Structure

Every DeadmauC program must start and end with:

```
ATTACH THE MAU5HEAD
  // your code here
GO TO BED JOEL
```

The ending is based on the /mu/ board meme where fans would spam "Go to bed Joel" during his 3 AM Twitter sessions.

### Variables

```
I REMEMBER myVar              // Declare (song: "I Remember")
myVar IS NOW 42               // Assign a value
myVar IS NOW TRACK "hello"    // Assign a string
```

### Output

```
RAISE YOUR WEAPON value       // Print with newline (song)
SOME CHORDS value             // Print without newline (song)
```

### Arithmetic

| Operation | Syntax | Meaning |
|-----------|--------|---------|
| Addition | `a LAYER WITH b` | `a + b` |
| Subtraction | `a MINUS b` | `a - b` |
| Multiplication | `SIDECHAIN a b` | `a * b` |
| Division | `SPLIT BY a b` | `a / b` |
| Modulo | `MODULATE BY a b` | `a % b` |
| Increment | `PUMP THIS var` | `var++` |
| Decrement | `THERE MIGHT BE LESS var` | `var--` |

### Comparison

| Operation | Syntax |
|-----------|--------|
| Greater than | `a LOUDER THAN b` |
| Less than | `a QUIETER THAN b` |
| Equal | `a SAME BPM AS b` |
| Not equal | `a NOT SAME BPM AS b` |

### Logical Operators

| Operation | Syntax |
|-----------|--------|
| AND | `ALSO` |
| OR | `OTHERWISE` |
| NOT | `SILENCE` |

### Conditionals

```
WHATS THE FUSS condition
THE BEAT DROPS
    // then branch
FML
    // else branch (song: "FML")
WHATEVER
```

### Loops

**While Loop:**
```
WHILE ONE IS LESS THAN TWO condition    // Album: "while(1<2)"
KEEP GOING
    // loop body
IM DONE
```

**For Loop:**
```
STROBE i FROM 1 TO 10                   // Song: "Strobe"
FLASH
    // loop body
UNFLASH
```

**Loop Control:**
```
SKIP THIS           // continue
LAWYER UP MICKEY    // break (his response to Disney's lawsuit)
```

### Functions

```
THIS IS THE HOOK myFunction TAKING param1, param2
BREAKDOWN
    // function body
    SEND BACK result
BUILDUP COMPLETE

// Call the function
DROP myFunction WITH arg1, arg2
```

### Data Types

```
42                    // Number
3.14                  // Float
TRACK "hello"         // String
CUBE V3               // true
SKRILLEX              // false
MEOWINGTONS           // null
```

### Arrays (Setlists)

```
SETLIST myList HOLDING 1, 2, 3      // Create array
QUEUE UP myList 4                    // Push
ENCORE myList                        // Pop
TRACK NUMBER myList 0                // Access by index
```

### Input

```
COFFEE RUN WITH myVar    // Read user input (from his YouTube series)
```

### Error Handling

```
GHOSTS N STUFF                    // try block (song)
    // risky code
CATCH THE GLITCH errorVar         // catch block
    RAISE YOUR WEAPON errorVar
WHATEVER

U MAD BRO TRACK "error message"   // throw error (his catchphrase)
```

### Special

```
FAXING BERLIN 1000    // Sleep for 1000ms (song)
```

## Examples

### FizzBuzz

```
ATTACH THE MAU5HEAD

STROBE i FROM 1 TO 100
FLASH
    I REMEMBER fizz
    I REMEMBER buzz
    fizz IS NOW MODULATE BY i 3
    buzz IS NOW MODULATE BY i 5

    WHATS THE FUSS fizz SAME BPM AS 0 ALSO buzz SAME BPM AS 0
    THE BEAT DROPS
        RAISE YOUR WEAPON TRACK "FizzBuzz"
    FML
        WHATS THE FUSS fizz SAME BPM AS 0
        THE BEAT DROPS
            RAISE YOUR WEAPON TRACK "Fizz"
        FML
            WHATS THE FUSS buzz SAME BPM AS 0
            THE BEAT DROPS
                RAISE YOUR WEAPON TRACK "Buzz"
            FML
                RAISE YOUR WEAPON i
            WHATEVER
        WHATEVER
    WHATEVER
UNFLASH

GO TO BED JOEL
```

### Fibonacci

```
ATTACH THE MAU5HEAD

THIS IS THE HOOK fibonacci TAKING n
BREAKDOWN
    WHATS THE FUSS n QUIETER THAN 2
    THE BEAT DROPS
        SEND BACK n
    WHATEVER

    I REMEMBER a
    I REMEMBER b
    a IS NOW DROP fibonacci WITH n MINUS 1
    b IS NOW DROP fibonacci WITH n MINUS 2
    SEND BACK a LAYER WITH b
BUILDUP COMPLETE

STROBE i FROM 0 TO 10
FLASH
    RAISE YOUR WEAPON DROP fibonacci WITH i
UNFLASH

GO TO BED JOEL
```

## Running Examples

```bash
node src/index.js examples/hello.mau5
node src/index.js examples/fizzbuzz.mau5
node src/index.js examples/fibonacci.mau5
node src/index.js examples/purrari.mau5
node src/index.js examples/twitter_beef.mau5
node src/index.js examples/coffee.mau5
node src/index.js examples/meowingtons.mau5
```

## Complete Keyword Reference

| DeadmauC | Traditional | Reference |
|----------|-------------|-----------|
| `ATTACH THE MAU5HEAD` | program start | The helmet |
| `GO TO BED JOEL` | program end | /mu/ board meme |
| `I REMEMBER` | `var` / `let` | Song |
| `IS NOW` | `=` | |
| `RAISE YOUR WEAPON` | `print()` | Song |
| `SOME CHORDS` | `print()` no newline | Song |
| `LAYER WITH` | `+` | Audio layering |
| `MINUS` | `-` | |
| `SIDECHAIN` | `*` | Production technique |
| `SPLIT BY` | `/` | |
| `MODULATE BY` | `%` | Modular synth term |
| `PUMP THIS` | `++` | |
| `THERE MIGHT BE LESS` | `--` | Song reference |
| `LOUDER THAN` | `>` | |
| `QUIETER THAN` | `<` | |
| `SAME BPM AS` | `==` | |
| `WHATS THE FUSS` | `if` | |
| `THE BEAT DROPS` | `then` / `{` | |
| `FML` | `else` | Song |
| `WHATEVER` | `endif` / `}` | |
| `WHILE ONE IS LESS THAN TWO` | `while` | Album: "while(1<2)" |
| `KEEP GOING` | loop start | |
| `IM DONE` | loop end | |
| `STROBE` | `for` | Song |
| `FLASH` / `UNFLASH` | loop body | |
| `SKIP THIS` | `continue` | |
| `LAWYER UP MICKEY` | `break` | Disney lawsuit |
| `THIS IS THE HOOK` | `function` | |
| `BREAKDOWN` | function body start | Song structure |
| `BUILDUP COMPLETE` | function body end | Song structure |
| `DROP` | function call | |
| `SEND BACK` | `return` | |
| `COFFEE RUN WITH` | `input()` | YouTube series |
| `CUBE V3` | `true` | His stage setup |
| `SKRILLEX` | `false` | |
| `MEOWINGTONS` | `null` | His cat |
| `GHOSTS N STUFF` | `try` | Song |
| `CATCH THE GLITCH` | `catch` | |
| `U MAD BRO` | `throw` | Catchphrase |
| `FAXING BERLIN` | `sleep()` | Song |
| `SETLIST` | array | |
| `QUEUE UP` | array push | |
| `ENCORE` | array pop | |

## Context for the Confused

- **CUBE V3** — His stage setup. 260 tons, 600+ LED panels. Cost a fortune. Hence, `true`.
- **SKRILLEX** — They had beef. Hence, `false`.
- **MEOWINGTONS** — Professor Meowingtons PhD, his cat (2007-2023). Hence, `null`.
- **LAWYER UP MICKEY** — What Joel said when Disney tried to block his mau5head trademark because it looked too much like Mickey Mouse ears. (He won.)
- **GO TO BED JOEL** — /mu/ users would spam this during his late night posting sessions. He did not go to bed.
- **WHILE ONE IS LESS THAN TWO** — His 2014 album was literally called `while(1<2)`. Yes, he named an album after an infinite loop.
- **Coffee Runs** — His YouTube series where he drives people around in sports cars and roasts them. Guests have included Pharrell and Toronto's former crack-smoking mayor Rob Ford.
- **U MAD BRO** — His catchphrase. He wore it on a shirt to the Grammys. The shirt also had Skrillex's phone number on it.

## Things That Didn't Make It Into The Language

- `PURRARI` — His Ferrari 458 wrapped in Nyan Cat. Ferrari sued him.
- `PRESS BUTTON RECEIVE BACON` — Too long.
- `IM NOT A DJ` — He says this a lot. Nobody believes him.
- `TORONTO TRAFFIC` — He complains about this constantly on stream. Considered for `throw`.

## File Extension

`.mau5`

## License

MIT

---

Not affiliated with Joel Zimmerman or mau5trap. He would probably mass-block everyone involved in this project on Twitter.
