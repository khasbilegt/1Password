import { List, Icon } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useEffect } from "react";
import { Category, CategoryName } from "../types";
import { execa } from "execa";
import { getCategoryIcon } from "../utils";

export function CategoryDropdown({ onCategoryChange }: { onCategoryChange: (newCategory: string) => void }) {
  const [categories, setCategories] = useCachedState<Category[]>("categories", []);

  useEffect(() => {
    execa("/usr/local/bin/op", ["item", "template", "list", "--format=json"]).then(({ stdout }) => {
      const parsed = (JSON.parse(stdout) as Category[]).sort((a, b) =>
        a.name == b.name ? 0 : a.name > b.name ? 1 : -1
      );
      setCategories(parsed);
    });
  }, []);

  return (
    <List.Dropdown tooltip="Select Category" defaultValue="null" onChange={onCategoryChange}>
      <List.Dropdown.Section title="Item Categories">
        <List.Dropdown.Item key={"000"} icon={Icon.AppWindowGrid3x3} title="All Categories" value="null" />
        {categories.map((category) => (
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
