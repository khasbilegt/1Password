import { ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedState, useExec } from "@raycast/utils";

import { CopyToClipboard } from "./ActionCopyToClipboard";
import { CategoryDropdown, DEFAULT_CATEGORY } from "./CategoryDropdown";
import { Item } from "../types";
import { getCategoryIcon } from "../utils";

export function PasswordList() {
  const default_params = ["item", "list", "--long", "--format=json"];
  const [category, setCategory] = useCachedState<string>("selected_cateogry", DEFAULT_CATEGORY);

  const { data: items, isLoading } = useExec(
    "/usr/local/bin/op",
    category === DEFAULT_CATEGORY ? default_params : [...default_params, `--categories=${category}`],
    {
      initialData: [],
      parseOutput: ({ stdout }) =>
        (JSON.parse(stdout) as Item[]).sort((a, b) => (a.title == b.title ? 0 : a.title > b.title ? 1 : -1)),
    }
  );

  const onCategoryChange = (newCategory: string) => {
    category !== newCategory && setCategory(newCategory);
  };

  return (
    <List isLoading={isLoading} searchBarAccessory={<CategoryDropdown onCategoryChange={onCategoryChange} />}>
      {items.length === 0 ? (
        <List.EmptyView
          title="No items found"
          description="Any items you have added in 1Password app will be listed here."
        />
      ) : (
        items?.map((item) => (
          <List.Item
            key={item.id}
            id={item.id}
            icon={{ value: { source: getCategoryIcon(item.category), tintColor: Color.Blue }, tooltip: item.category }}
            title={item.title}
            subtitle={item.additional_information}
            accessories={[
              item?.favorite ? { icon: { source: Icon.Stars, tintColor: Color.Yellow }, tooltip: "Favorite item" } : {},
              { text: item.vault?.name },
            ]}
            actions={
              <ActionPanel>
                {item.category === "LOGIN" && (
                  <>
                    <CopyToClipboard
                      id={item.id}
                      vault_id={item.vault.id}
                      field="username"
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                    <CopyToClipboard
                      id={item.id}
                      vault_id={item.vault.id}
                      field="password"
                      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                    />
                  </>
                )}
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
