import { existsSync } from "fs";

import { Guide, PasswordList } from "./components";
import { getCliPath } from "./utils";

export default function Command() {
  const path = getCliPath();

  return existsSync(path) ? <PasswordList /> : <Guide />;
}
