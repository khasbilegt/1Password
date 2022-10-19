import { execa } from "execa";

import { Action, Clipboard, Icon, Keyboard, Toast, showToast } from "@raycast/api";

export function CopyToClipboard({
  id,
  vault_id,
  shortcut,
  field = "password",
}: {
  id: string;
  field?: string;
  shortcut: Keyboard.Shortcut;
  vault_id: string;
}) {
  return (
    <Action
      icon={Icon.Clipboard}
      title={`Copy ${field}`}
      shortcut={shortcut}
      onAction={async () => {
        const toast = await showToast({
          style: Toast.Style.Animated,
          title: `Copying ${field}`,
        });

        try {
          const { stdout } = await execa("/usr/local/bin/op", ["read", `op://${vault_id}/${id}/${field}`]);
          await Clipboard.copy(stdout);

          toast.style = Toast.Style.Success;
          toast.title = "Copied to clipboard";
        } catch (error) {
          toast.style = Toast.Style.Failure;
          toast.title = "Failed to copy";
          toast.message = error instanceof Error ? error.message : undefined;
        }
      }}
    />
  );
}
