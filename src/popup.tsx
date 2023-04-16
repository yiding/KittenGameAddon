import * as React from "react";
import * as ReactDOM from "react-dom";
import { FluentProvider } from "@fluentui/react-components";

import Popup from "./Popup.react";
import { getConfig } from "./messaging";

async function start() {
  const config = await getConfig();

  const el = document.getElementById("app");
  if (config) {
    ReactDOM.render(
      <FluentProvider>
        <Popup initialConfig={config} />
      </FluentProvider>,
      el
    );
  } else {
    ReactDOM.render(<div>Not loaded.</div>, el);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
