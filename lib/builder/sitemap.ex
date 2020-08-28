defmodule Builder.Sitemap do
  @moduledoc false
  require Logger

  def build do
    {:ok, template} = File.read("layouts/sitemap.eex")

    File.rm("output/sitemap.xml")

    :ok =
      File.write(
        "output/sitemap.xml",
        EEx.eval_string(template, [
          {:trim, true},
          {:engine, Phoenix.HTML.Engine},
          {:assigns,
           [{:content, Builder.Posts.posts() |> Enum.filter(fn post -> post[:draft] != true end)}]}
        ]),
        [:write]
      )

    Logger.info("built sitemap.xml")
  end
end
