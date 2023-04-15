export type ContentScriptRequest =
  | ContentScriptSetConfigRequest
  | ContentScriptGetConfigRequest;

export interface ContentScriptGetConfigRequest {
  type: "GetConfig";
}

export interface ContentScriptSetConfigRequest {
  type: "SetConfig";
  config: ContentScriptConfig;
}

export interface ContentScriptConfig {
  allowAutocraft: boolean;
  autocraft: {
    alloy: boolean;
    manuscript: boolean;
    compendium: boolean;
    blueprint: boolean;
    eludium: boolean;
  };
  praise: boolean;
}

export type ContentScriptResponse = ContentScriptGetConfigResponse;

export interface ContentScriptGetConfigResponse {
  type: "GetConfig";
  config: ContentScriptConfig;
}

async function sendToCurrentTab(
  request: ContentScriptRequest
): Promise<ContentScriptResponse | null> {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });
  if (tabs.length > 1) {
    throw new Error("More than one matching tab.");
  }
  for (let tab of tabs) {
    if (tab.id) {
      return await browser.tabs.sendMessage(tab.id, request);
    }
  }
  return null;
}

export async function getConfig(): Promise<ContentScriptConfig | null> {
  const response = await sendToCurrentTab({ type: "GetConfig" });
  if (response?.type === "GetConfig") {
    return response.config;
  } else {
    return null;
  }
}

export async function sendConfig(config: ContentScriptConfig): Promise<void> {
  await sendToCurrentTab({ type: "SetConfig", config });
}
