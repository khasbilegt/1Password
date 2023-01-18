import { Action, ActionPanel, Clipboard, Form, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useState } from "react";

import { Items as V7Items } from "./v7/components/Items";
import { Items } from "./v8/components/Items";
import { User } from "./v8/types";
import { op, ACCOUNT_CACHE_NAME, useOp, cache } from "./v8/utils";
import { Guide } from "./guide-view";

function AccountForm() {
  const [hasAccount, setHasAccount] = useState<boolean | undefined>(cache.has(ACCOUNT_CACHE_NAME));
  const { data, error, isLoading } = useOp<User[]>(["account", "list"]);

  if (error) return <Guide />;
  if (hasAccount) return <Items />;
  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Sign In"
            onSubmit={async (values) => {
              console.log("Signing in...");
              const toast = await showToast({
                style: Toast.Style.Animated,
                title: "Signing in...",
              });

              try {
                op(["signin", "--account", values.account]);
                setHasAccount(true);

                toast.style = Toast.Style.Success;
                toast.title = "Signed in";
              } catch (error) {
                toast.style = Toast.Style.Failure;
                toast.title = "Failed to sign in";
                if (error instanceof Error) {
                  toast.message = error.message;
                  toast.primaryAction = {
                    title: "Copy logs",
                    onAction: async (toast) => {
                      await Clipboard.copy((error as Error).message);
                      toast.hide();
                    },
                  };
                }
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="account" title="Account" autoFocus>
        {(data || []).map((account) => (
          <Form.Dropdown.Item
            key={account.account_uuid}
            title={`${account.url} - ${account.email}`}
            value={account.account_uuid}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

export default function Command() {
  return getPreferenceValues().version == "v8" ? <AccountForm /> : <V7Items />;
}
