/**
 * Tree-sitter grammar for the Sindarin programming language
 *
 * Sindarin is a systems programming language with:
 * - Block syntax using `=>`
 * - Native C interop
 * - Struct-based OOP
 * - Strong typing
 */

module.exports = grammar({
  name: 'sindarin',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.hash_comment,
    $.block_comment,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.primary_expression, $.type],
    [$.primary_expression, $.struct_literal],
    [$._top_level_item, $._statement],
  ],

  rules: {
    // =========================================================================
    // Source File
    // =========================================================================
    source_file: $ => repeat($._top_level_item),

    _top_level_item: $ => choice(
      $.pragma,
      $.import_statement,
      $.function_declaration,
      $.native_function_declaration,
      $.struct_declaration,
      $.type_declaration,
      $.variable_declaration,
      $._statement,
    ),

    // =========================================================================
    // Comments
    // =========================================================================
    line_comment: $ => token(seq('//', /.*/)),

    // Hash comments that don't start with #pragma
    // We handle this by making pragma a higher priority match
    hash_comment: $ => token(prec(-1, seq('#', /[^\n]*/))),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    // =========================================================================
    // Pragmas
    // =========================================================================
    pragma: $ => prec.right(1, seq(
      '#pragma',
      field('kind', choice('include', 'link', 'source', 'pack')),
      optional(field('value', choice(
        $.angle_string,
        $.string,
        $.identifier,
        $.pragma_pack_value,
      ))),
    )),

    pragma_pack_value: $ => seq('(', $.number, ')'),

    angle_string: $ => /<[^>]+>/,

    // =========================================================================
    // Decorators
    // =========================================================================
    decorator: $ => choice(
      seq('@source', field('path', $.string)),
      seq('@alias', field('name', $.string)),
      seq('@include', field('path', choice($.angle_string, $.string))),
      seq('@link', field('library', $.identifier)),
    ),

    // =========================================================================
    // Imports
    // =========================================================================
    import_statement: $ => seq(
      'import',
      field('path', $.string),
      optional(seq('as', field('alias', $.identifier))),
    ),

    // =========================================================================
    // Type Declarations
    // =========================================================================
    type_declaration: $ => seq(
      'type',
      field('name', $.type_identifier),
      '=',
      field('value', choice(
        'opaque',
        seq('native', 'fn'),
        $.type,
      )),
    ),

    // =========================================================================
    // Struct Declarations
    // =========================================================================
    struct_declaration: $ => prec.right(seq(
      optional('native'),
      'struct',
      field('name', $.type_identifier),
      optional(seq('as', 'ref')),
      '=>',
      optional(field('body', $.struct_body)),
    )),

    struct_body: $ => prec.right(repeat1(choice(
      $.field_declaration,
      $.function_declaration,
      $.static_function_declaration,
    ))),

    field_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type),
    ),

    // =========================================================================
    // Function Declarations
    // =========================================================================
    function_declaration: $ => prec.right(seq(
      optional(field('modifier', $.visibility_modifier)),
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(seq(':', field('return_type', $.type))),
      '=>',
      optional(field('body', $.block)),
    )),

    native_function_declaration: $ => seq(
      repeat($.decorator),
      'native',
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(seq(':', field('return_type', $.type))),
    ),

    static_function_declaration: $ => prec.right(seq(
      'static',
      'fn',
      field('name', $.identifier),
      field('parameters', $.parameter_list),
      optional(seq(':', field('return_type', $.type))),
      '=>',
      optional(field('body', $.block)),
    )),

    visibility_modifier: $ => choice('shared', 'private'),

    parameter_list: $ => seq(
      '(',
      optional(commaSep($.parameter)),
      ')',
    ),

    parameter: $ => seq(
      optional('...'),
      field('name', $.identifier),
      ':',
      field('type', $.type),
      optional(seq('as', choice('val', 'ref'))),
      optional(seq('=', field('default', $._expression))),
    ),

    // =========================================================================
    // Types
    // =========================================================================
    type: $ => choice(
      $.primitive_type,
      $.type_identifier,
      $.array_type,
      $.function_type,
      $.namespaced_type,
    ),

    primitive_type: $ => choice(
      'int', 'long', 'int32', 'uint', 'uint32',
      'double', 'float',
      'str', 'char', 'byte', 'bool', 'void', 'any',
    ),

    type_identifier: $ => /[A-Z][a-zA-Z0-9_]*/,

    array_type: $ => prec.left(seq(
      $.type,
      '[',
      optional($.number),
      ']',
    )),

    function_type: $ => prec.right(1, seq(
      'fn',
      '(',
      optional(commaSep($.type)),
      ')',
      ':',
      $.type,
    )),

    namespaced_type: $ => seq(
      $.identifier,
      '.',
      $.type_identifier,
    ),

    // =========================================================================
    // Statements
    // =========================================================================
    block: $ => prec.right(repeat1($._statement)),

    _statement: $ => choice(
      $.variable_declaration,
      $.assignment_statement,
      $.if_statement,
      $.for_statement,
      $.for_in_statement,
      $.while_statement,
      $.match_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.expression_statement,
    ),

    variable_declaration: $ => seq(
      'var',
      field('name', $.identifier),
      ':',
      field('type', $.type),
      optional(seq('=', field('value', $._expression))),
    ),

    assignment_statement: $ => prec.right(seq(
      field('left', $._expression),
      field('operator', choice('=', '+=', '-=', '*=', '/=', '%=')),
      field('right', $._expression),
    )),

    if_statement: $ => prec.right(seq(
      'if',
      field('condition', $._expression),
      '=>',
      optional(field('consequence', $.block)),
      optional(field('alternative', $.else_clause)),
    )),

    else_clause: $ => prec.right(seq(
      'else',
      '=>',
      optional($.block),
    )),

    for_statement: $ => prec.right(seq(
      'for',
      field('init', $.variable_declaration),
      ';',
      field('condition', $._expression),
      ';',
      field('update', $._expression),
      '=>',
      optional(field('body', $.block)),
    )),

    for_in_statement: $ => prec.right(seq(
      'for',
      field('variable', $.identifier),
      'in',
      field('iterable', $._expression),
      '=>',
      optional(field('body', $.block)),
    )),

    while_statement: $ => prec.right(seq(
      'while',
      field('condition', $._expression),
      '=>',
      optional(field('body', $.block)),
    )),

    match_statement: $ => prec.right(seq(
      'match',
      field('value', $._expression),
      '=>',
      repeat($.match_arm),
    )),

    match_arm: $ => prec.right(seq(
      field('pattern', $._expression),
      '=>',
      optional(field('body', $.block)),
    )),

    return_statement: $ => prec.right(seq(
      'return',
      optional(field('value', $._expression)),
    )),

    break_statement: $ => 'break',

    continue_statement: $ => 'continue',

    expression_statement: $ => $._expression,

    // =========================================================================
    // Expressions
    // =========================================================================
    _expression: $ => choice(
      $.primary_expression,
      $.unary_expression,
      $.binary_expression,
      $.call_expression,
      $.member_expression,
      $.index_expression,
      $.cast_expression,
      $.struct_literal,
      $.array_literal,
      $.spawn_expression,
      $.sync_expression,
      $.parenthesized_expression,
    ),

    primary_expression: $ => choice(
      $.identifier,
      $.type_identifier,
      $.number,
      $.string,
      $.interpolated_string,
      $.char_literal,
      $.boolean,
      $.nil,
      $.self,
      $.arena,
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    unary_expression: $ => prec.left(7, choice(
      seq('-', $._expression),
      seq('!', $._expression),
      seq('++', $._expression),
      seq('--', $._expression),
    )),

    binary_expression: $ => choice(
      // Arithmetic
      prec.left(5, seq(field('left', $._expression), '*', field('right', $._expression))),
      prec.left(5, seq(field('left', $._expression), '/', field('right', $._expression))),
      prec.left(5, seq(field('left', $._expression), '%', field('right', $._expression))),
      prec.left(4, seq(field('left', $._expression), '+', field('right', $._expression))),
      prec.left(4, seq(field('left', $._expression), '-', field('right', $._expression))),
      // Comparison
      prec.left(3, seq(field('left', $._expression), '==', field('right', $._expression))),
      prec.left(3, seq(field('left', $._expression), '!=', field('right', $._expression))),
      prec.left(3, seq(field('left', $._expression), '<', field('right', $._expression))),
      prec.left(3, seq(field('left', $._expression), '<=', field('right', $._expression))),
      prec.left(3, seq(field('left', $._expression), '>', field('right', $._expression))),
      prec.left(3, seq(field('left', $._expression), '>=', field('right', $._expression))),
      // Logical
      prec.left(2, seq(field('left', $._expression), '&&', field('right', $._expression))),
      prec.left(1, seq(field('left', $._expression), '||', field('right', $._expression))),
      // Range
      prec.left(3, seq(field('left', $._expression), '..', field('right', $._expression))),
      // Type check
      prec.left(3, seq(field('left', $._expression), 'is', field('right', $.type))),
    ),

    call_expression: $ => prec.left(8, seq(
      field('function', $._expression),
      '(',
      optional(commaSep($._expression)),
      ')',
    )),

    member_expression: $ => prec.left(8, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier),
    )),

    index_expression: $ => prec.left(8, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      ']',
    )),

    cast_expression: $ => prec.left(6, seq(
      field('value', $._expression),
      'as',
      field('type', choice(
        $.type,
        'val',
        'ref',
      )),
    )),

    struct_literal: $ => prec(1, seq(
      field('type', $.type_identifier),
      '{',
      optional(commaSep($.field_initializer)),
      '}',
    )),

    field_initializer: $ => seq(
      field('name', $.identifier),
      ':',
      field('value', $._expression),
    ),

    array_literal: $ => seq(
      '{',
      optional(commaSep($._expression)),
      '}',
    ),

    spawn_expression: $ => prec.right(seq(
      '&',
      field('expression', $._expression),
    )),

    sync_expression: $ => prec.left(8, seq(
      field('expression', $._expression),
      '!',
    )),

    // =========================================================================
    // Literals
    // =========================================================================
    identifier: $ => /[a-z_][a-zA-Z0-9_]*/,

    number: $ => choice(
      /\d+\.\d+([eE][+-]?\d+)?/,  // float
      /\d+[lL]/,                   // long
      /0[xX][0-9a-fA-F]+/,        // hex
      /0[bB][01]+/,               // binary
      /\d+/,                       // integer
    ),

    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]+/,
        $.escape_sequence,
      )),
      '"',
    ),

    interpolated_string: $ => seq(
      '$"',
      repeat(choice(
        /[^"\\{]+/,
        $.escape_sequence,
        $.interpolation,
      )),
      '"',
    ),

    interpolation: $ => seq(
      '{',
      field('expression', $._expression),
      optional(field('format', $.format_specifier)),
      '}',
    ),

    format_specifier: $ => /:[^\}]+/,

    escape_sequence: $ => /\\[nrt\\"'0]/,

    char_literal: $ => seq(
      "'",
      choice(/[^'\\]/, $.escape_sequence),
      "'",
    ),

    boolean: $ => choice('true', 'false'),

    nil: $ => 'nil',

    self: $ => 'self',

    arena: $ => 'arena',
  }
});

// Helper function for comma-separated lists
function commaSep(rule) {
  return optional(seq(rule, repeat(seq(',', rule)), optional(',')));
}
