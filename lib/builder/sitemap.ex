defmodule Builder.Sitemap do
  @moduledoc false
  require Logger

  def build do
    {:ok, template} = File.read("layouts/sitemap.eex")

    File.rm("#{Application.fetch_env!(:builder, :out)}/sitemap.xml")

    :ok =
      File.write(
        "#{Application.fetch_env!(:builder, :out)}/sitemap.xml",
        EEx.eval_string(template, [
          {:trim, true},
          {:engine, Phoenix.HTML.Engine},
          {:assigns, [{:content, Builder.Posts.posts()}]}
        ]),
        [:write]
      )

    Logger.info("built sitemap.xml")
  end
end
