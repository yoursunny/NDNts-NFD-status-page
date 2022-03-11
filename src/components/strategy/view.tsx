import { Fragment, h } from "preact";
import { useContext } from "preact/hooks";

import { NfdStatusContext } from "../../context";
import { NameFiltered } from "../common/name-filtered";
import { StrategyTable } from "./table";

export function StrategyView() {
  const { strategies } = useContext(NfdStatusContext);
  return (
    <>
      <h1>{strategies.length} strategy choices</h1>
      <NameFiltered>
        {(filter) => (
          <StrategyTable filter={filter}/>
        )}
      </NameFiltered>
    </>
  );
}
