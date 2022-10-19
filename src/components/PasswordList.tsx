import { execa } from "execa";
import { useEffect, useState } from "react";

import { ActionPanel, Icon, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

import { CopyToClipboard } from "./ActionCopyToClipboard";
import { CategoryDropdown, DEFAULT_CATEGORY } from "./CategoryDropdown";
import { Item } from "../types";
import { getCategoryIcon } from "../utils";

export function PasswordList() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useCachedState<string>("selected_cateogry", DEFAULT_CATEGORY);
  const default_params = ["item", "list", "--vault", "cbajoutjh5pmff2c42skyywsdy", "--long", "--format=json"];

  useEffect(() => {
    setIsLoading(true);
    execa(
      "/usr/local/bin/op",
      category === DEFAULT_CATEGORY ? default_params : [...default_params, `--categories=${category}`]
    )
      .then(({ stdout }) => {
        const parsed = (JSON.parse(stdout) as Item[]).sort((a, b) =>
          a.title == b.title ? 0 : a.title > b.title ? 1 : -1
        );
        setItems(parsed);
      })
      .catch(() => console.error("Handle error!!!"))
      .finally(() => setIsLoading(false));
  }, [category]);

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
            icon={getCategoryIcon(item.category)}
            title={item.title}
            subtitle={item.additional_information}
            accessories={[
              item?.favorite ? { icon: Icon.Stars, tooltip: "Favorite item" } : {},
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
