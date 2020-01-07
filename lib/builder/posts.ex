defmodule Builder.Posts do
  @moduledoc false
  require Logger

  def build do
    {:ok, post_template} = File.read("layouts/post.eex")

    posts()
    |> Enum.each(fn content ->
      File.rm("#{Application.fetch_env!(:builder, :out)}/post/#{content[:slug]}/index.html")

      :ok =
        File.write(
          "#{Application.fetch_env!(:builder, :out)}/post/#{content[:slug]}/index.html",
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
    content =
      post_files()
      |> Enum.map(fn file_name ->
        {:ok, file} = File.read(file_name)

        [frontmatter, post] = file |> String.split("---", [{:parts, 3}]) |> Enum.drop(1)

        {:ok, frontmatter} = frontmatter |> YamlElixir.read_from_string()

        frontmatter =
          frontmatter
          |> Enum.reduce([], fn {key, value}, acc ->
            [{key |> String.to_atom(), value}] ++ acc
          end)

        [frontmatter, post]
      end)
      |> Enum.filter(fn [frontmatter, _post] ->
        frontmatter[:draft] == false ||
          (frontmatter[:draft] == true && Mix.env() != :prod)
      end)

    content
    |> Enum.map(fn [frontmatter, post] ->
      {:ok, ast, []} = Earmark.as_ast(post)
      File.mkdir_p("#{Application.fetch_env!(:builder, :out)}/post/#{frontmatter[:slug]}")

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

      body = Earmark.Transform.transform(ast, [{:indent, 0}, {:initial_indent, 0}])

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

      preview = Earmark.Transform.transform(ast, [{:indent, 0}, {:initial_indent, 0}])

      frontmatter ++
        [{:content, body}] ++
        [{:description, frontmatter[:preview]}] ++
        [{:markdown_preview, preview}]
    end)
  end

  @spec post_files() :: list(binary())
  defp post_files do
    Path.wildcard("content/posts/*.md")
  end
end
