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

### Boolean Aliases (because one `true` is never enough)

**Things that are `true`:**
- `CUBE V3` — The stage setup
- `THE CUBE` — Same thing, shorter
- `TESTPILOT` — His techno alias
- `PROGRESSIVE HOUSE` — His genre
- `CHIPOTLE` — Always yes to Chipotle
- `COFFEE` — Addiction
- `THE MAU5HEAD` — Iconic
- `TORONTO` — Home

**Things that are `false`:**
- `SKRILLEX` — Beef
- `MARSHMELLO` — "Irrelevant"
- `BIG ROOM` — Hates it
- `ANIMALS BY MARTIN GARRIX` — Maximum shade
- `BUTTON PUSHER` — What he calls bad DJs
- `MAINSTREAM` — Sellout
- `DJ` — IM NOT A DJ

**Things that are `null`:**
- `MEOWINGTONS` — RIP
- `PROFESSOR MEOWINGTONS` — Full name
- `RIP MEOWINGTONS` — Memorial

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

Alternative syntax (because everything needs aliases):
- `PUT ON THE MAU5HEAD` — Same as above
- `HELMET ON` — For the lazy
- `JOEL GO TO SLEEP` — Alternative ending
- `GOODNIGHT TORONTO` — For Canadians

### Variables

```
I REMEMBER myVar              // Declare (song: "I Remember")
LEMME TELL YOU ABOUT myVar    // Alternative (rambling mode)
myVar IS NOW 42               // Assign a value
myVar EQUALS 42               // Boring alias
```

### Output

```
RAISE YOUR WEAPON value       // Print with newline (song)
SOME CHORDS value             // Print without newline (song)
PROFESSIONAL GRIEFERS value   // Print to stderr (angry mode)
TWITTER RANT value            // ALL CAPS PRINT (3 AM mode)
```

### Arithmetic

| Operation | Syntax | Meaning |
|-----------|--------|---------|
| Addition | `a LAYER WITH b` | `a + b` |
| Subtraction | `a MINUS b` | `a - b` |
| Multiplication | `SIDECHAIN a b` or `COMPRESS a b` | `a * b` |
| Division | `SPLIT BY a b` | `a / b` |
| Modulo | `MODULATE BY a b` | `a % b` |
| Increment | `PUMP THIS var` | `var++` |
| Decrement | `THERE MIGHT BE LESS var` or `THERE MIGHT BE COFFEE var` | `var--` |

### Comparison

| Operation | Syntax | Alternative |
|-----------|--------|-------------|
| Greater than | `a LOUDER THAN b` | `a MORE FOLLOWERS THAN b` |
| Less than | `a QUIETER THAN b` | `a LESS BEEF THAN b` |
| Equal | `a SAME BPM AS b` | |
| Not equal | `a NOT SAME BPM AS b` | |

### Conditionals

```
WHATS THE FUSS condition      // or U MAD ABOUT condition
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
KEEP GOING                              // or KEEP STREAMING
    // loop body
IM DONE                                 // or IM BORED
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
SKIP THIS           // continue (or NEXT TRACK)
LAWYER UP MICKEY    // break (or CEASE AND DESIST)
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

Alternative: `HERES THE DROP myFunction` for function definition

### Error Handling

```
GHOSTS N STUFF                    // try block (song)
    // risky code
CATCH THE GLITCH errorVar         // catch block
    RAISE YOUR WEAPON errorVar
WHATEVER

U MAD BRO TRACK "error message"   // throw error
BLOCK EVERYONE TRACK "bye"        // alternative throw
```

### Special

```
FAXING BERLIN 1000    // Sleep for 1000ms (song)
COFFEE RUN WITH var   // Read user input (or ASK THE CHAT var)
```

---

## Stupid Built-in Functions

These functions exist because sometimes you need features that serve absolutely no purpose.

### Time Wasters

| Function | What It Does | Why |
|----------|--------------|-----|
| `PROGRESSIVE BUILDUP 500` | Prints "building tension..." repeatedly, then "(the drop never came)" | Prog house experience |
| `WAIT FOR THE DROP` | Waits random time, never actually drops | Troll tracks |
| `CHIPOTLE RUN 1000` | Takes forever, returns "out of guac" | His food obsession |
| `CTHULHU SLEEPS 1000` | Sleep, but ominously | Song reference |

### Opposite Day Functions

| Function | What It Does | Why |
|----------|--------------|-----|
| `NICE MEME FLIP value` | Returns opposite boolean with sarcastic comment | His catchphrase |
| `DJ MODE` | **Always crashes** with "IM NOT A DJ" | He says this a lot |

### Completely Useless Functions

| Function | What It Does | Why |
|----------|--------------|-----|
| `GRAMMY SPEECH` | Prints "We all hit play." and does nothing | The controversial quote |
| `ROB FORD COUNT` | Returns "1 2 3 4" | Coffee Runs episode |
| `FERRARI LAWSUIT value` | Strips all fun words from string | Purrari incident |
| `MASS BLOCK array` | Removes random elements from array | Twitter rampage hobby |
| `TESTPILOT MODE value` | Returns value/2, says "dark and minimal" | His techno alias |
| `HR 8938 CEPHEI value` or `SEND TO SPACE value` | Evaluates then discards (prints to space) | Song about a star |
| `HAXED BY ANONYMOUS` | 1% chance to crash your program | Early hacker vibes |
| `MONOPHOBIA CHECK` | Crashes if only 1 variable exists | Fear of being alone |
| `THE VELDT FEELS value` | Adds emotional suffix to string | The feels |
| `PLAY ANIMALS` | Always returns "ANIMALS" | Martin Garrix diss |
| `RANDOM ALBUM TITLE` | Returns random deadmau5 album name | Self-explanatory |
| `COFFEE ADDICTION value` | Multiplies by 420 | Caffeine math |

### Memory Management (The James Hype Beef)

Because every language needs garbage collection, and nothing says "destroy everything" like James Hype.

| Function | What It Does | Why |
|----------|--------------|-----|
| `JAMES HYPE THIS` | **Full garbage collection** - clears ALL variables and functions | He remixes everything to death |
| `JAMES HYPE REMIX varname` | Deletes a specific variable | Targeted destruction |

When you call `JAMES HYPE THIS`, you get the full experience:
- Dramatic entrance message
- Progress updates about "adding unnecessary drops" and "removing all the good parts"
- Total annihilation of your program's memory
- Snarky commentary about musical integrity

```
// Create some beautiful variables
I REMEMBER artisticVision
artisticVision IS NOW 100

// Now destroy everything
JAMES HYPE THIS

// artisticVision is gone. Forever. Like the original song.
```

### The Inescapable Loop

```
AT 128 BPM beat
FLASH
    // This runs EXACTLY 128 times
    // LAWYER UP MICKEY is ignored
    // You cannot escape the BPM
UNFLASH
```

---

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

### Twitter Beef Simulator

```
ATTACH THE MAU5HEAD

// Rate things using our boolean system
SOME CHORDS TRACK "CUBE V3: "
RAISE YOUR WEAPON CUBE V3

SOME CHORDS TRACK "SKRILLEX: "
RAISE YOUR WEAPON SKRILLEX

SOME CHORDS TRACK "MARSHMELLO: "
RAISE YOUR WEAPON MARSHMELLO

// Twitter rant mode
TWITTER RANT TRACK "why does everyone think edm is just button pushing"
TWITTER RANT TRACK "i spent 260 tons on a cube and people still complain"

// Mass block your enemies
SETLIST enemies HOLDING TRACK "hater1", TRACK "hater2"
MASS BLOCK enemies

GO TO BED JOEL
```

### The Drop That Never Comes

```
ATTACH THE MAU5HEAD

RAISE YOUR WEAPON TRACK "The track begins..."
PROGRESSIVE BUILDUP 500
RAISE YOUR WEAPON TRACK "Here it comes..."
WAIT FOR THE DROP
RAISE YOUR WEAPON TRACK "The journey was the destination."

GO TO BED JOEL
```

## Running Examples

```bash
node src/index.js examples/hello.mau5
node src/index.js examples/fizzbuzz.mau5
node src/index.js examples/fibonacci.mau5
node src/index.js examples/twitter_beef.mau5
node src/index.js examples/stupid_builtins.mau5
node src/index.js examples/aliases.mau5
node src/index.js examples/128bpm.mau5
node src/index.js examples/drop_tease.mau5
node src/index.js examples/dj_mode_crash.mau5   # Guaranteed to crash
node src/index.js examples/james_hype_gc.mau5  # Garbage collection demo
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
| `PROFESSIONAL GRIEFERS` | `print()` to stderr | Song |
| `TWITTER RANT` | `print()` ALL CAPS | 3 AM behavior |
| `LAYER WITH` | `+` | Audio layering |
| `SIDECHAIN` | `*` | Production technique |
| `WHATS THE FUSS` | `if` | |
| `THE BEAT DROPS` | `then` / `{` | |
| `FML` | `else` | Song |
| `WHATEVER` | `endif` / `}` | |
| `WHILE ONE IS LESS THAN TWO` | `while` | Album: "while(1<2)" |
| `AT 128 BPM` | unbreakable for loop | Standard EDM tempo |
| `LAWYER UP MICKEY` | `break` | Disney lawsuit |
| `DROP` | function call | |
| `CUBE V3` | `true` | Stage setup |
| `SKRILLEX` | `false` | Beef |
| `MEOWINGTONS` | `null` | His cat (RIP) |
| `U MAD BRO` | `throw` | Catchphrase |
| `GRAMMY SPEECH` | print quote + nothing | "We all hit play" |
| `DJ MODE` | crash | IM NOT A DJ |
| `JAMES HYPE THIS` | garbage collection | British DJ beef |
| `JAMES HYPE REMIX` | delete variable | Targeted remix |

## Context for the Confused

- **CUBE V3** — His stage setup. 260 tons, 600+ LED panels. Cost more than your house. Hence, `true`.
- **SKRILLEX** — They had beef. Hence, `false`.
- **MEOWINGTONS** — Professor Meowingtons PhD, his cat (2007-2023). Hence, `null`.
- **LAWYER UP MICKEY** — What Joel said when Disney tried to block his mau5head trademark. He won.
- **GO TO BED JOEL** — /mu/ users would spam this during his 3 AM posting sessions. He did not go to bed.
- **WHILE ONE IS LESS THAN TWO** — His 2014 album was literally called `while(1<2)`.
- **Coffee Runs** — YouTube series where he drives people in sports cars and roasts them. Featured Toronto's former crack-smoking mayor Rob Ford.
- **U MAD BRO** — His catchphrase. He wore it on a Grammys shirt with Skrillex's phone number.
- **AT 128 BPM** — Standard EDM tempo. Non-negotiable. The loop cannot be broken.
- **TESTPILOT** — His techno alias. Hence the "dark and minimal" output.
- **HR 8938 CEPHEI** — A real star. He wrote a song about it. Values sent there go to the void of space.
- **JAMES HYPE** — British DJ known for remixing everything. Deadmau5 has publicly dissed his style. Hence, garbage collection.

## Things That Made It Into The Language But Shouldn't Have

- `DJ MODE` — Always crashes. Because IM NOT A DJ.
- `MASS BLOCK` — Randomly removes array elements. Like his Twitter.
- `CHIPOTLE RUN` — Takes forever, returns "out of guac". Accurate simulation.
- `FERRARI LAWSUIT` — Removes all fun from strings. Thanks, Ferrari legal.
- `HAXED BY ANONYMOUS` — 1% crash chance. You feel lucky?

## Things That Didn't Make It Into The Language

- `PURRARI` — His Ferrari 458 wrapped in Nyan Cat. Ferrari sued him.
- `PRESS BUTTON RECEIVE BACON` — Too long.
- `TORONTO TRAFFIC` — He complains about this constantly. Considered for `throw`.
- `AVICII TRIBUTE` — Too sad.

## File Extension

`.mau5`

## License

MIT

---

Not affiliated with Joel Zimmerman or mau5trap. He would probably mass-block everyone involved in this project on Twitter.

If you're reading this Joel: Sorry. Also, hire us to build the Cube v4 software.
