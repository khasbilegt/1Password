import { Action, ActionPanel, Form, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

import { Items as V7Items } from "./v7/components/Items";
import { Items } from "./v8/components/Items";
import { User } from "./v8/types";
import { op, PROFILE_CACHE_NAME } from "./v8/utils";
import { Guide } from "./guide-view";

export default function Command() {
  const [profile, setProfile] = useCachedState<User>(PROFILE_CACHE_NAME);

  if (getPreferenceValues().version == "v8") {
    if (!profile) {
      try {
        const data: User[] = JSON.parse(op(["account", "list", "--format=json"]));

        return (
          <Form
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
                      const newProfile = data && data.find((account) => account.account_uuid === values.account);
                      newProfile && setProfile(newProfile);
                      op(["signin", "--account", values.account]);

                      toast.style = Toast.Style.Success;
                      toast.title = "Signed in";
                      console.log("Signed in");
                    } catch (error) {
                      toast.style = Toast.Style.Failure;
                      toast.title = "Failed to sign in";
                      if (error instanceof Error) {
                        toast.message = error.message;
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
      } catch (error) {
        console.log(error);
        return <Guide />;
      }
    }
    return <Items />;
  }
  return <V7Items />;
}
