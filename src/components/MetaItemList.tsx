import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import crypto from "crypto";

import { MetaCategoryDropdown, DEFAULT_META_CATEGORY } from "./MetaCategoryDropdown";
import { getMetaItems } from "../legacyUtils";
import { CategoryName } from "../types";
import { getCategoryIcon } from "../utils";

export function MetaItemList() {
  const [category, setCategory] = useCachedState<string>("selected_cateogry", DEFAULT_META_CATEGORY);

  const categoriesObj = getMetaItems();

  const categories =
    categoriesObj && category === DEFAULT_META_CATEGORY
      ? Object.values(categoriesObj).sort((a, b) => a.name.localeCompare(b.name))
      : categoriesObj && [categoriesObj[category]];

  const onCategoryChange = (newCategory: string) => {
    category !== newCategory && setCategory(newCategory);
  };

  return (
    <List searchBarAccessory={<MetaCategoryDropdown onCategoryChange={onCategoryChange} />}>
      {categories?.length ? (
        categories.map((category) => (
          <List.Section key={category.id} id={category.id} title={category.name}>
            {category.items.map((item) => (
              <List.Item
                key={item.uuid}
                id={item.uuid}
                icon={{
                  value: {
                    source: getCategoryIcon(
                      item.categorySingularName.replaceAll(" ", "_").toUpperCase() as CategoryName
                    ),
                    tintColor: Color.Blue,
                  },
                  tooltip: item.categorySingularName,
                }}
                title={item.itemTitle}
                subtitle={item.accountName}
                accessories={[{ text: item.vaultName }]}
                actions={
                  <ActionPanel>
                    {item.categoryUUID === "001" && item.websiteURLs?.length && (
                      <Action.Open
                        icon={Icon.Globe}
                        title="Open In Browser"
                        target={`onepassword7://open_and_fill/${item.vaultUUID}/${item.uuid}/${crypto
                          .createHash("sha256")
                          .update(item.websiteURLs[0] as string)
                          .digest("hex")}`}
                        application="com.agilebits.onepassword7"
                      />
                    )}
                    <Action.Open
                      title="Open In 1Password"
                      target={`onepassword7://view/${item.vaultUUID}/${item.uuid}`}
                      application="com.agilebits.onepassword7"
                    />
                    <Action.Open
                      title="Edit In 1Password"
                      target={`onepassword7://edit/${item.vaultUUID}/${item.uuid}`}
                      application="com.agilebits.onepassword7"
                      shortcut={{ modifiers: ["cmd"], key: "e" }}
                    />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
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
