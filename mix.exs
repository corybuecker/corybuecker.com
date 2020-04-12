defmodule Builder.MixProject do
  use Mix.Project

  def project do
    [
      app: :builder,
      version: "0.1.0",
      elixir: "~> 1.9",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:earmark, git: "https://github.com/corybuecker/earmark.git", tag: "add-optional-ws-support"},
      {:yaml_elixir, "~> 2.4.0"},
      {:traverse, "~> 1.0.0"},
      {:phoenix_html, "~> 2.13.3"},
      {:credo, "~> 1.1.0", runtime: false},
      {:dialyxir, "~> 1.0.0-rc.7", only: [:dev], runtime: false}
    ]
  end
end
