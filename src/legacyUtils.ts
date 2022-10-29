import { Cache, Icon } from "@raycast/api";
import { readFileSync } from "fs";
import { homedir } from "os";
import fg from "fast-glob";

import { MetaCategory, MetaItem } from "./legacyTypes";
import { ITEMS_CACHE_NAME } from "./utils";

const cache = new Cache();

export function getMetaItems(): { [key: string]: MetaCategory } | undefined {
  if (cache.has(ITEMS_CACHE_NAME)) {
    const items = cache.get(ITEMS_CACHE_NAME);
    return JSON.parse(items as string);
  }

  const path = `${homedir()}/Library/Containers/com.agilebits.onepassword7/Data/Library/Caches/Metadata/1Password`;

  try {
    const items: MetaItem[] = fg
      .sync(`${path}/**/*.onepassword-item-metadata`, { onlyFiles: false, deep: 2 })
      .map((file) => JSON.parse(readFileSync(file, "utf-8").toString()))
      .sort((a, b) => a.itemTitle.localeCompare(b.itemTitle));

    const categories: { [key: string]: MetaCategory } = items.reduce(
      (section: { [key: string]: MetaCategory }, item) => {
        const { categoryUUID, categorySingularName } = item;
        section[categorySingularName] = section[categorySingularName] ?? {
          id: categoryUUID,
          name: categorySingularName,
          items: [],
        };
        section[categorySingularName]["items"].push(item);
        return section;
      },
      {}
    );

    cache.set(ITEMS_CACHE_NAME, JSON.stringify(categories));

    return categories;
  } catch (error) {
    console.error(error);
  }
}

export function getCategoryIcon(categoryUUID: string, categoryName: string) {
  console.log(categoryUUID, " - ", categoryName);

  switch (categoryUUID) {
    case "001":
      return Icon.Fingerprint;
    case "002":
      return Icon.CreditCard;
    case "003":
      return Icon.Document;
    case "004":
      return Icon.Person;
    case "005":
      return Icon.Key;
    case "006":
      return Icon.Paperclip;
    case "100": // Software License
      return Icon.CodeBlock;
    case "102": // Database
      return Icon.HardDrive;
    case "103": // Driver License
      return Icon.Car;

    case "112": // API
      return Icon.Code;
    default:
      return Icon.Lock;
  }
}
