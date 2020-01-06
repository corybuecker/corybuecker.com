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

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:earmark, "~> 1.4.3"},
      {:traverse, "~> 1.0.0"},
      {:phoenix_html, "~> 2.13.3"}
    ]
  end
end
