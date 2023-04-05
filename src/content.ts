import {
  ContentScriptRequest,
  ContentScriptResponse,
  ContentScriptConfig,
} from "./messaging";

interface Resources {
  catnip?: Resource;
  wood?: Resource;
  craftableWood?: CraftableResource;
  minerals?: Resource;
  coal?: Resource;
  iron?: Resource;
  titanium?: Resource;
  oil?: Resource;
  catpower?: Resource;
  science?: Resource;
  culture?: Resource;
  faith?: Resource;
  furs?: Resource;
  uranium?: Resource;
  beam?: CraftableResource;
  steel?: CraftableResource;
  alloy?: CraftableResource;
  slab?: CraftableResource;
  plate?: CraftableResource;
  kerosene?: CraftableResource;
  parchment?: CraftableResource;
  manuscript?: CraftableResource;
  compendium?: CraftableResource;
  blueprint?: CraftableResource;
  thorium?: CraftableResource;
}

interface WritableResources extends Resources {
  [key: string]: Resource | undefined;
}

interface Resource {
  name: string;
  amount: number;
  maxAmount: number | undefined;
}

interface CraftableResource extends Resource {
  craftLinks: Array<{
    amount: number;
    element: HTMLElement;
  }>;
}

function parseNumberWithUnit(str: string): number {
  const UNITS: { [key: string]: number } = {
    K: 1000,
    M: 1000000,
  };
  const match = str.match(/([0-9]*([.][0-9]+)?)([KM])?/);
  //                       ^1     ^2           ^3
  if (match == null) {
    throw new Error("Failed to parse number: " + str);
  }
  const value = Number(match[1]);
  const unit = match[3];
  const multiplier = unit != null ? UNITS[unit] : 1;
  return value * multiplier;
}

function readResources(): Resources {
  const resources: WritableResources = {};
  for (let table of document.querySelectorAll("div.res-table")) {
    if (table.classList.contains("craftTable")) {
      for (let row of table.querySelectorAll("div.res-row")) {
        let name = row.querySelector("div.res-cell.resource-name")?.innerHTML;
        const amount = row.querySelector("div.res-cell.resource-value")
          ?.innerHTML;
        if (name == null || amount == null) {
          continue;
        }
        if (name === "wood") {
          name = "craftableWood";
        }
        let craftLinks = [];
        for (const craftLink of row.querySelectorAll(
          "div.res-cell.craft-link"
        )) {
          if (!(craftLink instanceof HTMLElement)) {
            continue;
          }
          const match = craftLink.innerText?.match(/^\+(.+)$/);
          if (match == null) {
            continue;
          }
          const craftAmount = parseNumberWithUnit(match[1]);
          craftLinks.push({
            amount: craftAmount,
            element: craftLink,
          });
        }
        resources[name] = {
          name,
          amount: parseNumberWithUnit(amount),
          maxAmount: undefined,
          craftLinks,
        } as CraftableResource;
      }
    } else {
      // non-craftable resource.
      for (let row of table.querySelectorAll("div.res-row")) {
        const name = row.querySelector("div.res-cell.resource-name")?.innerHTML;
        const amount = row.querySelector("div.res-cell.resAmount")?.innerHTML;
        // slice 1 to remove the / from "/1234"
        const maxAmount = row
          .querySelector("div.res-cell.maxRes")
          ?.innerHTML?.slice(1);
        if (name == null || amount == null) {
          continue;
        }
        resources[name] = {
          name,
          amount: parseNumberWithUnit(amount),
          maxAmount: maxAmount ? parseNumberWithUnit(maxAmount) : undefined,
        };
      }
    }
  }
  return resources;
}

function clickObserve() {
  document.getElementById("observeBtn")?.click();
}

function sendHuntersWhenFull(catpower: Resource) {
  if (catpower.amount === catpower.maxAmount) {
    const el = document.querySelector("#fastHuntContainer > a");
    el instanceof HTMLElement && el.click();
  }
}

function praiseWhenFull(faith: Resource) {
  if (faith.amount === faith.maxAmount) {
    const el = document.querySelector("#fastPraiseContainer > a");
    el instanceof HTMLElement && el.click();
  }
}

function craft(resource: CraftableResource): boolean {
  if (resource.craftLinks.length <= 0) {
    return false;
  }
  const selected = resource.craftLinks.reduce((prev, cur) =>
    cur.amount > prev.amount ? cur : prev
  );
  if (selected.element == null) {
    return false;
  }
  console.log(`autocrafting:  ${selected.amount} ${resource.name}`);
  selected.element.click();
  return true;
}

/**
 * Craft a resource when another resource is full.
 *
 * @param check which resource to check for full
 * @param craft which resource to craft.
 * @returns whether we were able to craft.
 */
function craftWhenFull(
  check?: Resource,
  craftable?: CraftableResource
): boolean {
  if (
    check != null &&
    craftable != null &&
    check.maxAmount != null &&
    check.amount >= check.maxAmount
  ) {
    return craft(craftable);
  }
  return false;
}

function craftWhenLessThan(amount: number, craftable?: CraftableResource) {
  if (craftable != null && craftable.amount < amount) {
    craft(craftable);
  }
}

function onTick() {
  const resources = readResources();
  clickObserve();
  if (resources.catpower != null) {
    sendHuntersWhenFull(resources.catpower);
  }
  if (resources.faith != null && kConfig.praise) {
    praiseWhenFull(resources.faith);
  }

  craftWhenFull(resources.coal, resources.steel);
  craftWhenFull(resources.catnip, resources.craftableWood);
  craftWhenFull(resources.wood, resources.beam);
  craftWhenFull(resources.minerals, resources.slab);
  craftWhenFull(resources.iron, resources.plate);
  craftWhenFull(resources.oil, resources.kerosene);
  craftWhenFull(resources.uranium, resources.thorium);
  if (kConfig.autocraft.alloy) {
    craftWhenFull(resources.titanium, resources.alloy);
  }
  if (kConfig.autocraft.manuscript) {
    craftWhenFull(resources.culture, resources.manuscript);
  }

  if (resources.furs != null && resources.furs.amount > 10000) {
    craftWhenLessThan(625, resources.parchment);
  }

  (kConfig.autocraft.blueprint &&
    craftWhenFull(resources.science, resources.blueprint)) ||
    (kConfig.autocraft.compendium &&
      craftWhenFull(resources.science, resources.compendium));
}

async function onMessage(
  message: ContentScriptRequest
): Promise<ContentScriptResponse | void> {
  switch (message.type) {
    case "GetConfig":
      return { type: "GetConfig", config: kConfig };
    case "SetConfig":
      kConfig = message.config;
      return;
  }
}

let kConfig: ContentScriptConfig = {
  autocraft: {
    alloy: false,
    manuscript: false,
    compendium: false,
    blueprint: false,
  },
  praise: false,
};
browser.runtime.onMessage.addListener(onMessage);
const interval = window.setInterval(onTick, 1000);
