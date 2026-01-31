; Keywords
[
  "fn"
  "native"
  "struct"
  "type"
  "import"
  "as"
  "var"
  "static"
  "shared"
  "private"
] @keyword

; Control flow keywords
"if" @keyword.control
"else" @keyword.control
"for" @keyword.control
"while" @keyword.control
"match" @keyword.control
"return" @keyword.control
"in" @keyword.control

; Control flow statements (for break/continue which are full statements)
(break_statement) @keyword.control
(continue_statement) @keyword.control

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
  "!"
  "=>"
  ".."
  "is"
] @operator

; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["," ":" ";"] @punctuation.delimiter
"." @punctuation.delimiter

; Types
(primitive_type) @type.builtin
(type_identifier) @type

; Functions
(function_declaration
  name: (identifier) @function)

(native_function_declaration
  name: (identifier) @function)

(static_function_declaration
  name: (identifier) @function)

(call_expression
  function: (primary_expression (identifier) @function.call))

(call_expression
  function: (member_expression
    property: (identifier) @function.method.call))

; Parameters
(parameter
  name: (identifier) @variable.parameter)

; Fields
(field_declaration
  name: (identifier) @property)

(field_initializer
  name: (identifier) @property)

(member_expression
  property: (identifier) @property)

; Variables
(variable_declaration
  name: (identifier) @variable)

(identifier) @variable

; Literals
(number) @number
(string) @string
(interpolated_string) @string
(char_literal) @character
(boolean) @constant.builtin
(nil) @constant.builtin

; Special identifiers
(self) @variable.builtin
(arena) @variable.builtin

; Comments
(line_comment) @comment
(hash_comment) @comment
(block_comment) @comment

; Decorators
(decorator) @attribute

; Imports
(import_statement
  path: (string) @string.special)

; Interpolation
(interpolation
  "{" @punctuation.special
  "}" @punctuation.special)

(escape_sequence) @string.escape
