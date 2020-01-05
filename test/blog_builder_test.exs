defmodule BlogBuilderTest do
  use ExUnit.Case
  doctest BlogBuilder

  test "greets the world" do
    assert BlogBuilder.hello() == :world
  end
end
