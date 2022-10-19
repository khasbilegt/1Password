import { Icon, List } from "@raycast/api";
import { useExec } from "@raycast/utils";

import { Category, CategoryName } from "../types";
import { getCategoryIcon } from "../utils";

export const DEFAULT_CATEGORY = "null";

export function CategoryDropdown({ onCategoryChange }: { onCategoryChange: (newCategory: string) => void }) {
  const { data: categories } = useExec("/usr/local/bin/op", ["item", "template", "list", "--format=json"], {
    parseOutput: ({ stdout }) =>
      (JSON.parse(stdout) as Category[]).sort((a, b) => (a.name == b.name ? 0 : a.name > b.name ? 1 : -1)),
  });

  return (
    <List.Dropdown defaultValue="null" onChange={onCategoryChange} tooltip="Select Category" storeValue>
      <List.Dropdown.Section title="Item Categories">
        <List.Dropdown.Item key={"000"} icon={Icon.AppWindowGrid3x3} title="All Categories" value={DEFAULT_CATEGORY} />
        {(categories || []).map((category) => (
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
