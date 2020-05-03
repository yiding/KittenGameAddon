import * as React from "react";
import { useState, useEffect } from "react";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { Separator } from "@fluentui/react/lib/Separator";
import { Stack } from "@fluentui/react/lib/Stack";
import { sendConfig, ContentScriptConfig } from "./messaging";

export default function Popup(props: { initialConfig: ContentScriptConfig }) {
  const [config, setConfig] = useState(props.initialConfig);
  useEffect(() => {
    sendConfig(config);
  });
  return (
    <Stack tokens={{ childrenGap: 10, padding: 10 }}>
      <Separator>Autocraft</Separator>
      <Checkbox
        label="Alloy"
        checked={config.autocraft.alloy}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            autocraft: {
              ...config.autocraft,
              alloy: !!checked,
            },
          })
        }
      />
      <Checkbox
        label="Manuscript"
        checked={config.autocraft.manuscript}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            autocraft: {
              ...config.autocraft,
              manuscript: !!checked,
            },
          })
        }
      />
      <Checkbox
        label="Compendium"
        checked={config.autocraft.compendium}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            autocraft: {
              ...config.autocraft,
              compendium: !!checked,
            },
          })
        }
      />
      <Checkbox
        label="Blueprint"
        checked={config.autocraft.blueprint}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            autocraft: {
              ...config.autocraft,
              blueprint: !!checked,
            },
          })
        }
      />
      <Separator>Other</Separator>
      <Checkbox
        label="Praise when full"
        checked={config.praise}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            praise: !!checked,
          })
        }
      />
    </Stack>
  );
}
