defmodule Builder.Sitemap do
  require Logger

  def build do
    {:ok, template} = File.read("layouts/sitemap.eex")

    File.rm("out/sitemap.xml")

    :ok =
      File.write(
        "out/sitemap.xml",
        EEx.eval_string(template, [
          {:trim, true},
          {:engine, Phoenix.HTML.Engine},
          {:assigns, [{:content, Builder.Posts.posts()}]}
        ]),
        [:write]
      )

    Logger.info("built out/sitemap.xml")
  end
end
