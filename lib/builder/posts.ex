defmodule Builder.Posts do
  require Logger

  @moduledoc """
   
  """
  def build do
    {:ok, post_template} = File.read("layouts/post.eex")

    posts()
    |> Enum.each(fn content ->
      File.rm("out/post/#{content[:slug]}/index.html")

      :ok =
        File.write(
          "out/post/#{content[:slug]}/index.html",
          EEx.eval_string(post_template, [
            {:engine, Phoenix.HTML.Engine},
            {:trim, true},
            {:assigns, content}
          ]),
          [:write]
        )

      Logger.info("built out/post/#{content[:slug]}/index.html")
    end)
  end

  def posts do
    files = Path.wildcard("content/posts/*.md")

    content =
      files
      |> Enum.map(fn file_name ->
        {:ok, file} = File.read(file_name)

        [frontmatter, post] =
          file
          |> String.split("---", [{:parts, 3}])
          |> Enum.drop(1)

        frontmatter =
          frontmatter
          |> String.split("\n")
          |> Enum.filter(fn s -> String.length(s) > 0 end)
          |> Enum.reduce([], fn s, acc ->
            [key, value] =
              s
              |> String.split(":", [{:parts, 2}])
              |> Enum.map(fn a -> String.trim(a) end)

            [{key |> String.to_atom(), value}] ++ acc
          end)

        [frontmatter, post]
      end)
      |> Enum.filter(fn [frontmatter, _post] ->
        frontmatter[:draft] == "false" ||
          (frontmatter[:draft] == "true" && Mix.env() != :prod)
      end)

    content
    |> Enum.map(fn [frontmatter, post] ->
      {:ok, ast, []} = Earmark.as_ast(post)
      File.mkdir_p("out/post/#{frontmatter[:slug]}")

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

      [{:content, body}] ++
        frontmatter ++
        [{:description, frontmatter[:preview]}] ++ [{:markdown_preview, preview}]
    end)
  end
end
