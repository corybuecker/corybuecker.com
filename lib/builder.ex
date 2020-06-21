defmodule Builder do
  @moduledoc false
  require Logger

  def build do
    Logger.info("starting build to output")

    File.mkdir_p("output")

    Builder.Posts.build()
    Builder.Index.build()
    Builder.Sitemap.build()
  end
end
