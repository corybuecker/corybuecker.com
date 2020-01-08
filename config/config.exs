import Config

config :iex, default_prompt: ">>>"
config :builder, [{:out, "out"}, {:publish_drafts, true}]

import_config "#{Mix.env()}.exs"
