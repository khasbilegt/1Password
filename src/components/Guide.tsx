import { Action, ActionPanel, Detail, Icon, openExtensionPreferences } from "@raycast/api";

const INSTRUCTION = `
## 1Password CLI 2

### You can install it on Mac using brew or manually download and extract it. If you installed it manually you have to specify the installation path in the extension preference section.

### Brew
1. Install brew from the [1Password tap](https://github.com/1Password/homebrew-tap): \`brew install --cask 1password/tap/1password-cli\`
2. To verify the installation, check the version number: \`op --version\`

### Manual
1. [Download 1Password CLI for your platform and architecture](https://app-updates.agilebits.com/product_history/CLI2). You can [verify its authenticity](https://developer.1password.com/docs/cli/verify).
2. Install 1Password CLI in the default location: \`/usr/local/bin\`.
3. To verify the installation, check the version number: \`op --version\`


## Turn on biometrick unlock in the 1Password app

### To set up 1Password to authenticate with biometrics and turn on biometric unlock:
1. Open 1Password.
2. Click the account or collection at the top of the sidebar and choose Preferences > Security.
3. Select [Touch ID](https://support.1password.com/touch-id-mac/).
4. Click Developer in the sidebar.
5. Select "Biometric unlock for 1Password CLI".

You can also unlock 1Password CLI with your [Apple Watch](https://support.1password.com/apple-watch-mac/).
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
