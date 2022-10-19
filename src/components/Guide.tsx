import { Action, ActionPanel, Detail, Icon, openExtensionPreferences } from "@raycast/api";

const INSTRUCTION = `
# 1Password CLI
### You can install it on Mac using brew or manually download and extract it. If you installed it manually you have to specify the installation path in the extension preference section.

### Brew
1. Install brew from the [1Password tap](https://github.com/1Password/homebrew-tap): \`brew install --cask 1password/tap/1password-cli\`
2. To verify the installation, check the version number: \`op --version\`

### Manual
1. [Download 1Password CLI for your platform and architecture](https://app-updates.agilebits.com/product_history/CLI2). You can [verify its authenticity](https://developer.1password.com/docs/cli/verify).
2. Install 1Password CLI in the default location: \`/usr/local/bin\`.
3. To verify the installation, check the version number: \`op --version\`
`;

export function Guide() {
  return (
    <Detail
      markdown={INSTRUCTION}
      actions={
        <ActionPanel>
          <Action icon={Icon.Gear} title="Open Extension Preferences" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
