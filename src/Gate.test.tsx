import React from "react";
import { render, RenderResult, screen } from "@testing-library/react";
import { makeWrapper } from "../test/util";
import { createGate } from "./Gate";

const Gate = createGate();

const setup = (
  props: Omit<React.ComponentProps<(typeof Gate)["Provider"]>, "children">
) => {
  const wrapper = makeWrapper(Gate, props);

  let previousResult: { current: RenderResult | null } = { current: null };

  const renderGate = (ability: Parameters<(typeof Gate)["useGate"]>[0]) => {
    if (previousResult.current) {
      previousResult.current.unmount();
    }

    const result = render(
      <Gate ability={ability} fallback="fail">
        pass
      </Gate>,
      { wrapper }
    );

    previousResult.current = result;

    return result;
  };

  return { renderGate };
};

test("returns true and false for single conditions", async () => {
  const { renderGate } = setup({ abilities: ["test 1", "test 2"] });

  renderGate("test 1");
  expect(screen.queryByText("pass")).toBeInTheDocument();

  renderGate("test 2");
  expect(screen.queryByText("pass")).toBeInTheDocument();

  renderGate("test 3");
  expect(screen.queryByText("fail")).toBeInTheDocument();
});

test("returns true and false for 'any' conditions", async () => {
  const { renderGate } = setup({ abilities: ["test 1", "test 2"] });

  renderGate({ any: ["test 0", "test 1"] });
  expect(screen.queryByText("pass")).toBeInTheDocument();

  renderGate({ any: ["test 1", "test 2"] });
  expect(screen.queryByText("pass")).toBeInTheDocument();

  renderGate({ any: ["test 2", "test 3"] });
  expect(screen.queryByText("pass")).toBeInTheDocument();

  renderGate({ any: ["test 3", "test 4"] });
  expect(screen.queryByText("fail")).toBeInTheDocument();
});

test("returns true and false for 'all' conditions", async () => {
  const { renderGate } = setup({ abilities: ["test 1", "test 2"] });

  renderGate({ all: ["test 0", "test 1"] });
  expect(screen.queryByText("fail")).toBeInTheDocument();

  renderGate({ all: ["test 1", "test 2"] });
  expect(screen.queryByText("pass")).toBeInTheDocument();

  renderGate({ all: ["test 2", "test 3"] });
  expect(screen.queryByText("fail")).toBeInTheDocument();

  renderGate({ all: ["test 3", "test 4"] });
  expect(screen.queryByText("fail")).toBeInTheDocument();
});
