defmodule Builder do
  @moduledoc false
  require Logger

  def build do
    Logger.info("starting build to #{Application.fetch_env!(:builder, :out)}")

    File.mkdir_p(Application.fetch_env!(:builder, :out))

    Builder.Posts.build()
    Builder.Index.build()
    Builder.Sitemap.build()
  end
end
