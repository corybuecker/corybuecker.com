defmodule Builder do
  @moduledoc """
   
  """
  require Logger

  def build do
    Logger.info("starting build")
    Builder.Posts.build()
    Builder.Index.build()
    Builder.Sitemap.build()
  end
end
