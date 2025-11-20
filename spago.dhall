{-
Welcome to a Spago project!
You can edit this file as you like.

Need help? See the following resources:
- Spago documentation: https://github.com/purescript/spago
- Dhall language tour: https://docs.dhall-lang.org/tutorials/Language-Tour.html

When creating a new Spago project, you can use
`spago init --no-comments` or `spago init -C`
to generate this file without the comments in this block.
-}
{ name = "frontEnd"
, dependencies =
  [ "aff"
  , "affjax"
  , "affjax-web"
  , "argonaut"
  , "argonaut-codecs"
  , "argonaut-core"
  , "arrays"
  , "console"
  , "effect"
  , "either"
  , "foldable-traversable"
  , "halogen"
  , "http-methods"
  , "integers"
  , "js-promise"
  , "js-promise-aff"
  , "js-uri"
  , "maybe"
  , "node-path"
  , "prelude"
  , "strings"
  , "tuples"
  , "web-dom"
  , "web-file"
  , "web-html"
  ]
, packages = ./packages.dhall
, sources = [ "frontend/src/**/*.purs", "frontend/test/**/*.purs" ]
}
