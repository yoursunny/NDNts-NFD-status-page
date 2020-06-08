import classNames from "classnames";
import { Component, h } from "preact";

interface Props {
  tabs: string[];
  selected: string;
  onChange?: (tab: string) => void;
}

export class NavMenu extends Component<Props> {
  public render() {
    const { tabs, selected, onChange, children } = this.props;
    return (
      <nav class="pure-menu pure-menu-horizontal" style={{ paddingBottom: "1ex" }}>
        {children}
        <ul class="pure-menu-list">
          {tabs.map((tab) => (
            <li
              key={tab}
              class={classNames("pure-menu-item", { "pure-menu-selected": tab === selected })}
            >
              <a
                href="#" class="pure-menu-link"
                onClick={(evt) => { evt.preventDefault(); onChange?.(tab); }}
              >
                {tab}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
