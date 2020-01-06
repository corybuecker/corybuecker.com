defmodule Builder.Index do
  require Logger

  def build do
    {:ok, index_template} = File.read("layouts/index.eex")

    [home | content] = Builder.Posts.posts() |> Enum.reverse()
    File.rm("out/index.html")

    :ok =
      File.write(
        "out/index.html",
        EEx.eval_string(index_template, [
          {:trim, true},
          {:engine, Phoenix.HTML.Engine},
          {:assigns, [{:home, home}, {:posts, content}]}
        ]),
        [:write]
      )

    Logger.info("built out/index.html")
  end
end
