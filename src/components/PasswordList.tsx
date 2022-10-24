import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

import { CopyToClipboard } from "./ActionCopyToClipboard";
import { CategoryDropdown, DEFAULT_CATEGORY } from "./CategoryDropdown";
import { Item, User } from "../types";
import { execute, getCategoryIcon, ITEMS_CACHE_NAME, PROFILE_CACHE_NAME } from "../utils";

export function PasswordList() {
  const [category, setCategory] = useCachedState<string>("selected_cateogry", DEFAULT_CATEGORY);

  const items = execute<Item[]>(ITEMS_CACHE_NAME, ["item", "list", "--long"]);
  const profile = execute<User>(PROFILE_CACHE_NAME, ["whoami"]);

  const onCategoryChange = (newCategory: string) => {
    category !== newCategory && setCategory(newCategory);
  };

  return (
    <List searchBarAccessory={<CategoryDropdown onCategoryChange={onCategoryChange} />}>
      {items?.length ? (
        items
          .sort((a, b) => (a.title == b.title ? 0 : a.title > b.title ? 1 : -1))
          .map((item) => (
            <List.Item
              key={item.id}
              id={item.id}
              icon={{
                value: { source: getCategoryIcon(item.category), tintColor: Color.Blue },
                tooltip: item.category,
              }}
              title={item.title}
              subtitle={item.additional_information}
              accessories={[
                item?.favorite
                  ? { icon: { source: Icon.Stars, tintColor: Color.Yellow }, tooltip: "Favorite item" }
                  : {},
                { text: item.vault?.name },
              ]}
              actions={
                <ActionPanel>
                  <Action.Open
                    title="Open In 1Password"
                    target={`onepassword://view-item/?a=${profile?.account_uuid}&v=${item.vault.id}&i=${item.id}`}
                    application="com.1password.1password"
                  />
                  {item.category === "LOGIN" && (
                    <>
                      <Action.OpenInBrowser title="Open In Browser" url="" />
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
      ) : (
        <List.EmptyView
          title="No items found"
          description="Any items you have added in 1Password app will be listed here."
        />
      )}
    </List>
  );
}
