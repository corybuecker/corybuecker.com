defmodule BlogBuilder do
  require Logger

  @moduledoc """
   
  """
  def build do
    files = Path.wildcard("content/posts/*.md")
    {:ok, post_template} = File.read("layouts/post.eex.html")
    {:ok, index_template} = File.read("layouts/index.eex.html")

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

    content =
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

        content =
          [{:content, body}] ++
            frontmatter ++
            [{:description, frontmatter[:preview]}] ++ [{:markdown_preview, preview}]

        File.rm("out/post/#{frontmatter[:slug]}/index.html")

        :ok =
          File.write(
            "out/post/#{frontmatter[:slug]}/index.html",
            EEx.eval_string(post_template, [{:trim, true}, {:assigns, content}]),
            [:write]
          )

        Logger.info("built out/post/#{frontmatter[:slug]}/index.html")
        content
      end)

    [home | content] = content |> Enum.reverse()
    File.rm("out/index.html")

    :ok =
      File.write(
        "out/index.html",
        EEx.eval_string(index_template, [
          {:trim, true},
          {:assigns, [{:home, home}, {:posts, content}]}
        ]),
        [:write]
      )

    Logger.info("built out/index.html")
  end
end
