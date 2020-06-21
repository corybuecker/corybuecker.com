defmodule Builder.Posts do
  @moduledoc false
  require Logger

  def build do
    {:ok, post_template} = File.read("layouts/post.eex")

    posts()
    |> Enum.each(fn content ->
      File.rm("output/post/#{content[:slug]}/index.html")

      :ok =
        File.write(
          "output/post/#{content[:slug]}/index.html",
          EEx.eval_string(post_template, [
            {:engine, Phoenix.HTML.Engine},
            {:trim, true},
            {:assigns, content}
          ]),
          [:write]
        )

      Logger.info("built post/#{content[:slug]}/index.html")
    end)
  end

  def posts do
    post_files()
    |> Enum.map(fn file_name ->
      {:ok, file} = File.read(file_name)

      [frontmatter, post] = file |> String.split("---", [{:parts, 3}]) |> Enum.drop(1)

      frontmatter =
        with {:ok, frontmatter} <-
               frontmatter
               |> YamlElixir.read_from_string() do
          frontmatter
          |> Enum.reduce([], fn {key, value}, acc ->
            [{key |> String.to_atom(), value}] ++ acc
          end)
        end

      [frontmatter, post]
    end)
    |> Enum.map(fn [frontmatter, post] ->
      {:ok, ast, []} = Earmark.as_ast(post)

      File.mkdir_p("output/post/#{frontmatter[:slug]}")

      ast =
        Traverse.mapall(
          ast,
          fn
            {"a", x, y} ->
              {"tracked-anchor", [], [{"a", x, y}]}

            other ->
              other
          end,
          [{:post, true}]
        )

      body = Earmark.Transform.transform(ast, %{pretty: false, indent: 0})

      {:ok, ast, []} = Earmark.as_ast(frontmatter[:preview])

      ast =
        Traverse.mapall(
          ast,
          fn
            {"a", x, y} ->
              {"tracked-anchor", [], [{"a", x, y}]}

            other ->
              other
          end,
          [{:post, true}]
        )

      preview = Earmark.Transform.transform(ast, %{pretty: false, indent: 0})

      frontmatter ++
        [{:content, body}] ++
        [{:markdown_preview, preview}] ++
        [{:lastmod, frontmatter[:revised] || frontmatter[:published]}]
    end)
  end

  @spec post_files() :: list(binary())
  defp post_files do
    Path.wildcard("content/posts/*.md")
  end

  def ok_value({:ok, value}) do
    value
  end
end
