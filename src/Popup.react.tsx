import * as React from "react";
import { useState, useEffect } from "react";
import { Checkbox, Input, Divider, Label} from "@fluentui/react-components";
import { StackShim } from "@fluentui/react-migration-v8-v9";
import { sendConfig, ContentScriptConfig } from "./messaging";

export default function Popup(props: { initialConfig: ContentScriptConfig }) {
  const [config, setConfig] = useState(props.initialConfig);
  useEffect(() => {
    sendConfig(config);
  });
  return (
    <StackShim tokens={{ childrenGap: 10, padding: 10 }}>
      <Divider>Autocraft</Divider>
      <Checkbox 
        label="Enable autocraft"
        checked={config.allowAutocraft}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            allowAutocraft: !!checked.checked,
          })
        }
      />
      <Checkbox
        label="Alloy"
        checked={config.autocraft.alloy}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            autocraft: {
              ...config.autocraft,
              alloy: !!checked.checked,
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
              manuscript: !!checked.checked,
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
              compendium: !!checked.checked,
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
              blueprint: !!checked.checked,
            },
          })
        }
      />
      <div>
        <Label>Min compendium</Label>
        <Input type="number" value={config.autocraft.blueprintMinCompendium.toString()} onChange={
          (ev, data) => {
             let v = Number(data.value) || 0;
             setConfig({
              ...config,
              autocraft: {
                ...config.autocraft,
                blueprintMinCompendium: v,
              }
             })
          }
        }/>
      </div>
      <Checkbox
        label="Eludium"
        checked={config.autocraft.eludium}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            autocraft: {
              ...config.autocraft,
              eludium: !!checked.checked,
            },
          })
        }
      />
      <Divider>Other</Divider>
      <Checkbox
        label="Praise when full"
        checked={config.praise}
        onChange={(ev, checked) =>
          setConfig({
            ...config,
            praise: !!checked.checked,
          })
        }
      />
    </StackShim>
  );
}
