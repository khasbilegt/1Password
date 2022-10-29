import { Icon, List } from "@raycast/api";
import { getMetaItems } from "../legacyUtils";

import { CategoryName } from "../types";
import { getCategoryIcon } from "../utils";

export const DEFAULT_META_CATEGORY = "null";

export function MetaCategoryDropdown({ onCategoryChange }: { onCategoryChange: (newCategory: string) => void }) {
  const categoriesObj = getMetaItems();
  const categories = categoriesObj && Object.keys(categoriesObj).sort((a, b) => a.localeCompare(b));

  return (
    <List.Dropdown defaultValue="null" onChange={onCategoryChange} tooltip="Select Category" storeValue>
      <List.Dropdown.Section title="Item Categories">
        <List.Dropdown.Item
          key={"000"}
          icon={Icon.AppWindowGrid3x3}
          title="All Categories"
          value={DEFAULT_META_CATEGORY}
        />
        {(categories || []).map((category, idx) => (
          <List.Dropdown.Item
            key={idx}
            icon={getCategoryIcon(category.replaceAll(" ", "_").toUpperCase() as CategoryName)}
            title={category}
            value={category}
          />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
