import { getPreferenceValues } from "@raycast/api";
import { Guide, ItemList } from "./components";

export default function Command() {
  return getPreferenceValues().version == "v8" ? <ItemList /> : <Guide />;
}
