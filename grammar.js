module.exports = grammar({
  name: "plantuml",
  word: $ => $.identifier,
  rules: {
    diagram: $ => repeat(
      choice(
        $._startend,
        $.preprocessor,
        $.procedure,
        $.comment
      )
    ),
    _startend: $ => choice(
      "@startuml",
      "@enduml"
    ),
    preprocessor: $ => seq(
      "!",
      choice(
        $.identifier,
        "include"
      ),
      " ",
      field("url", $.unqouted_string)
    ),
    procedure: $ => seq(
      alias($.identifier, $.procedure_identifier),
      $.argument_list,
      optional(" "),
      optional(
        choice(
          $.block,
          $.link
        )
      )
    ),

    block: $=> seq(
      "{",
      repeat($.procedure),
      "}"
    ),

    link: $ => seq("[", "[", /[^\]]*/, "]", "]"),

    argument_list: $ => seq(
      "(",
      repeat1(
        seq(
          $._expression,
          optional(seq(",", optional(" ")))
        )
      ),
      ")"
    ),
    _expression: $ => choice(
      $.identifier,
      $.string,
      $.single_quote_string,
      $.named_parameter,
    ),
    named_parameter: $ => seq(
      $.identifier,
      "=",
      $.string
    ),
    identifier: $ => /\$?\w+_*/,
    string: $ => /"[^"]*?"/,
    single_quote_string: $ => /'[^']*?'/,
    comment: $ => /'[^\n\r]*/,
    unqouted_string: $ => /[,\s\[]*.+[,\s\]$]+/,
  }
});
