# tree-sitter-sindarin

Tree-sitter grammar for the Sindarin programming language.

## Overview

Sindarin is a systems programming language with:
- Native C interop via `native fn` declarations
- Struct-based OOP with methods
- Strong static typing
- Block syntax using `=>`
- String interpolation with `$"...{expr}..."`

## Installation

### Prerequisites

- Node.js (for building)
- tree-sitter CLI: `npm install -g tree-sitter-cli`

### Building

```bash
# Install dependencies
npm install

# Generate the parser
tree-sitter generate

# Run tests
tree-sitter test

# Parse a file
tree-sitter parse path/to/file.sn
```

### Python

```bash
pip install tree-sitter-sindarin
```

```python
import tree_sitter_sindarin as sindarin
from tree_sitter import Language, Parser

parser = Parser(Language(sindarin.language()))
tree = parser.parse(b"fn main(): void => return")
```

## Grammar Highlights

### Functions

```sindarin
# Regular function
fn add(a: int, b: int): int =>
    return a + b

# Native C function
native fn sin(x: double): double

# Static method
static fn create(): MyStruct =>
    return MyStruct { value: 0 }
```

### Structs

```sindarin
struct Point =>
    x: double
    y: double

    fn distance(other: Point): double =>
        var dx: double = self.x - other.x
        var dy: double = self.y - other.y
        return sqrt(dx * dx + dy * dy)
```

### Control Flow

```sindarin
# If statement
if x > 0 =>
    return 1
else =>
    return -1

# For-in loop
for item in items =>
    print(item)

# While loop
while running =>
    process()
```

### Imports and Decorators

```sindarin
import "sdk/core/math" as math

@include <stdio.h>
@link m
@alias "printf"
native fn print(format: str, ...): int
```

## License

MIT
