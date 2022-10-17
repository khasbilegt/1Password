import { ActionPanel, Detail, List, Icon, Action } from "@raycast/api";
import { getFavicon, useCachedState, useExec } from "@raycast/utils";
import { useEffect, useMemo, useState } from "react";
import { Category, CategoryName, Item } from "./types";

function getItemIcon(category: CategoryName) {
  switch (category) {
    case "API_CREDENTIAL":
      return Icon.Code;
    case "BANK_ACCOUNT":
      return Icon.Coins;
    case "CREDIT_CARD":
      return Icon.CreditCard;
    case "CUSTOM":
      return Icon.Snippets;
    case "DATABASE":
      return Icon.HardDrive;
    case "DOCUMENT":
      return Icon.Document;
    case "DRIVER_LICENSE":
      return Icon.Gauge;
    case "EMAIL_ACCOUNT":
      return Icon.Envelope;
    case "IDENTITY":
      return Icon.Person;
    case "LOGIN":
      return Icon.Fingerprint;
    case "MEMBERSHIP":
      return Icon.Receipt;
    case "OUTDOOR_LICENSE":
      return Icon.Mountain;
    case "PASSPORT":
      return Icon.Train;
    case "PASSWORD":
      return Icon.Key;
    case "REWARD_PROGRAM":
      return Icon.Trophy;
    case "SECURE_NOTE":
      return Icon.Lock;
    case "SERVER":
      return Icon.Terminal;
    case "SOCIAL_SECURITY_NUMBER":
      return Icon.PersonLines;
    case "SOFTWARE_LICENSE":
      return Icon.AppWindow;
    case "SSH_KEY":
      return Icon.Terminal;
    case "WIRELESS_ROUTER":
      return Icon.Wifi;
    default:
      return;
  }
}

function CategoryDropdown({ onCategoryChange }) {
  const [categories, setCategories] = useCachedState<Category[]>("categories", []);
  const { isLoading, data } = useExec("/usr/local/bin/op", ["item", "template", "list", "--format=json"]);

  useEffect(() => {
    !isLoading && data && setCategories(JSON.parse(data));
  }, [isLoading, data]);

  return (
    <List.Dropdown tooltip="Select Drink Type" storeValue={true} onChange={onCategoryChange}>
      <List.Dropdown.Section title="Alcoholic Beverages">
        {categories.map((category) => (
          <List.Dropdown.Item key={category.uuid} title={category.name} value={category.name} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}

export default function Command() {
  const { isLoading, data } = useExec("/usr/local/bin/op", ["item", "list", "--long", "--format=json"], {
    parseOutput: ({ stdout }) => JSON.parse(stdout),
  });
  const items = useMemo(() => data || [], [data]);

  const onCategoryChange = (newValue) => {
    console.log(newValue);
  };

  return (
    <List isLoading={isLoading} searchBarAccessory={<CategoryDropdown onCategoryChange={onCategoryChange} />}>
      {items.length === 0 ? (
        <List.EmptyView
          title="No items found"
          description="Any item you have added in 1Password app will be listed here."
        />
      ) : (
        items?.map((item) => (
          <List.Item
            key={item.id}
            id={item.id}
            icon={getItemIcon(item.category)}
            title={item.title}
            subtitle={item.additional_information}
            accessories={[
              item?.favorite ? { icon: Icon.Star, tooltip: "Favorite item" } : {},
              { text: item.vault?.name },
            ]}
          />
        ))
      )}
    </List>
  );
}
