defmodule Builder.Index do
  @moduledoc false
  require Logger

  def build do
    {:ok, index_template} = File.read("layouts/index.eex")

    [home | content] = Builder.Posts.posts() |> Enum.reverse()
    File.rm("index.html")

    :ok =
      File.write(
        "#{Application.fetch_env!(:builder, :out)}/index.html",
        EEx.eval_string(index_template, [
          {:trim, true},
          {:engine, Phoenix.HTML.Engine},
          {:assigns, [{:home, home}, {:posts, content}]}
        ]),
        [:write]
      )

    Logger.info("built index.html")
  end
end
