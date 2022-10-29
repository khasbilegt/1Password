import { getPreferenceValues } from "@raycast/api";
import { ItemList, MetaItemList } from "./components";

export default function Command() {
  return getPreferenceValues().version == "v8" ? <ItemList /> : <MetaItemList />;
}
