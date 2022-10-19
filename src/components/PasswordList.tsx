import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedState, useExec } from "@raycast/utils";

import { CopyToClipboard } from "./ActionCopyToClipboard";
import { CategoryDropdown, DEFAULT_CATEGORY } from "./CategoryDropdown";
import { Item, User } from "../types";
import { getCategoryIcon, getCliPath } from "../utils";

export function PasswordList() {
  const cli = getCliPath();
  const default_params = ["item", "list", "--long", "--format=json"];
  const [category, setCategory] = useCachedState<string>("selected_cateogry", DEFAULT_CATEGORY);

  const { data: items, isLoading } = useExec(
    cli,
    category === DEFAULT_CATEGORY ? default_params : [...default_params, `--categories=${category}`],
    {
      parseOutput: ({ stdout }) =>
        (JSON.parse(stdout) as Item[]).sort((a, b) => (a.title == b.title ? 0 : a.title > b.title ? 1 : -1)),
    }
  );
  const { data: profile } = useExec<User>(cli, ["whoami", "--format", "json"], {
    parseOutput: ({ stdout }) => JSON.parse(stdout),
  });

  const onCategoryChange = (newCategory: string) => {
    category !== newCategory && setCategory(newCategory);
  };

  return (
    <List isLoading={isLoading} searchBarAccessory={<CategoryDropdown onCategoryChange={onCategoryChange} />}>
      {items?.length ? (
        items.map((item) => (
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
