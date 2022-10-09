import { renderHook } from "@testing-library/react";
import { GateProviderProps } from "./GateProvider";
import { UseGate, useGate } from "./useGate";
import { makeWrapper } from "../test/util";

const setup = (props: Omit<GateProviderProps, "children">) => {
  const wrapper = makeWrapper(props);

  const renderUseGate = (arg: Parameters<UseGate>[0]) =>
    renderHook(() => useGate(arg), { wrapper });

  return { renderUseGate };
};

test("returns true and false for single conditions", async () => {
  const { renderUseGate } = setup({ abilities: ["test 1", "test 2"] });

  expect(renderUseGate("test 1").result.current).toBe(true);
  expect(renderUseGate({ ability: "test 2" }).result.current).toBe(true);
  expect(renderUseGate("test 3").result.current).toBe(false);
});

test("returns true and false for 'any' conditions", async () => {
  const { renderUseGate } = setup({ abilities: ["test 1", "test 2"] });

  expect(renderUseGate({ any: ["test 0", "test 1"] }).result.current).toBe(
    true
  );
  expect(renderUseGate({ any: ["test 1", "test 2"] }).result.current).toBe(
    true
  );
  expect(renderUseGate({ any: ["test 2", "test 3"] }).result.current).toBe(
    true
  );
  expect(renderUseGate({ any: ["test 3", "test 4"] }).result.current).toBe(
    false
  );
});

test("returns true and false for 'all' conditions", async () => {
  const { renderUseGate } = setup({ abilities: ["test 1", "test 2"] });

  expect(renderUseGate({ all: ["test 0", "test 1"] }).result.current).toBe(
    false
  );
  expect(renderUseGate({ all: ["test 1", "test 2"] }).result.current).toBe(
    true
  );
  expect(renderUseGate({ all: ["test 2", "test 3"] }).result.current).toBe(
    false
  );
  expect(renderUseGate({ all: ["test 3", "test 4"] }).result.current).toBe(
    false
  );
});
