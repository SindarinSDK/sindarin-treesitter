# Tree-sitter Sindarin

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for the [Sindarin](https://github.com/SindarinSDK/sindarin-compiler) programming language, enabling syntax highlighting, code folding, and structural editing in supported editors.

## Installation

### Node.js

```bash
npm install tree-sitter-sindarin
```

### Python

```bash
pip install tree-sitter-sindarin
```

### From Source

```bash
git clone git@github.com:SindarinSDK/tree-sitter-sindarin.git
cd tree-sitter-sindarin
npm install
tree-sitter generate
```

## Quick Start

### Node.js

```javascript
const Parser = require('tree-sitter');
const Sindarin = require('tree-sitter-sindarin');

const parser = new Parser();
parser.setLanguage(Sindarin);

const tree = parser.parse(`
fn add(a: int, b: int): int =>
    return a + b
`);

console.log(tree.rootNode.toString());
```

### Python

```python
import tree_sitter_sindarin as sindarin
from tree_sitter import Language, Parser

parser = Parser(Language(sindarin.language()))
tree = parser.parse(b"fn main(): void => return")
print(tree.root_node)
```

### CLI

```bash
tree-sitter parse path/to/file.sn
```

## Documentation

### Supported Constructs

| Category | Constructs |
|----------|------------|
| Declarations | Functions, native functions, structs, type aliases, variables |
| Types | Primitives (`int`, `str`, `bool`, etc.), arrays, function types |
| Statements | `if`/`else`, `for`, `for-in`, `while`, `match`, `return` |
| Expressions | Binary, unary, calls, member access, indexing, casts |
| Literals | Numbers, strings, interpolated strings, chars, booleans |
| Special | Decorators, pragmas, imports, spawn/sync |

### Query Files

| File | Purpose |
|------|---------|
| `queries/highlights.scm` | Syntax highlighting rules |

### Language Features

Functions and methods:

```sindarin
fn add(a: int, b: int): int =>
    return a + b

native fn printf(format: str, ...): int

static fn create(): MyStruct =>
    return MyStruct { value: 0 }
```

Structs with methods:

```sindarin
struct Point =>
    x: double
    y: double

    fn distance(other: Point): double =>
        var dx: double = self.x - other.x
        var dy: double = self.y - other.y
        return sqrt(dx * dx + dy * dy)
```

Control flow:

```sindarin
if x > 0 =>
    return 1
else =>
    return -1

for item in items =>
    process(item)

match value =>
    1 => print("one")
    2 => print("two")
```

Decorators and pragmas:

```sindarin
#pragma include <stdio.h>
#pragma link m

@alias "printf"
native fn print(format: str, ...): int
```

## Running Tests

To run the test suite:

```bash
tree-sitter test
```

Or using npm/make:

```bash
npm test
make test
```

## Editor Integration

Tree-sitter Sindarin provides syntax highlighting for editors that support Tree-sitter:

- **Neovim** - Via nvim-treesitter
- **Helix** - Native Tree-sitter support
- **Zed** - Native Tree-sitter support
- **Emacs** - Via tree-sitter-langs

## Dependencies

- Node.js (for building)
- tree-sitter CLI: `npm install -g tree-sitter-cli`

## License

MIT License - see [LICENSE](./LICENSE) for details.
