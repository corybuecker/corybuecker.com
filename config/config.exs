import Config

config :iex, default_prompt: ">>>"
config :builder, [{:out, "out"}]

import_config "#{Mix.env()}.exs"
