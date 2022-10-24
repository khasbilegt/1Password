import { Icon, List } from "@raycast/api";

import { Category, CategoryName } from "../types";
import { CATEGORIES_CACHE_NAME, execute, getCategoryIcon } from "../utils";

export const DEFAULT_CATEGORY = "null";

export function CategoryDropdown({ onCategoryChange }: { onCategoryChange: (newCategory: string) => void }) {
  const categories = execute<Category[]>(CATEGORIES_CACHE_NAME, ["item", "template", "list"]);

  return (
    <List.Dropdown defaultValue="null" onChange={onCategoryChange} tooltip="Select Category" storeValue>
      <List.Dropdown.Section title="Item Categories">
        <List.Dropdown.Item key={"000"} icon={Icon.AppWindowGrid3x3} title="All Categories" value={DEFAULT_CATEGORY} />
        {(categories || [])
          .sort((a, b) => (a.name == b.name ? 0 : a.name > b.name ? 1 : -1))
          .map((category) => (
            <List.Dropdown.Item
              key={category.uuid}
              icon={getCategoryIcon(category.name.replaceAll(" ", "_").toUpperCase() as CategoryName)}
              title={`${category.name}s`}
              value={category.name}
            />
          ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
