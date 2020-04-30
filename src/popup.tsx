import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fabric } from "@fluentui/react/lib/Fabric";
import { initializeIcons } from "@uifabric/icons/lib/fabric-icons";

import Popup from "./Popup.react";
import { getConfig } from "./messaging";

async function start() {
  const config = await getConfig();

  initializeIcons("/fonts/");

  const el = document.getElementById("app");
  if (config) {
    ReactDOM.render(
      <Fabric>
        <Popup initialConfig={config} />
      </Fabric>,
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
