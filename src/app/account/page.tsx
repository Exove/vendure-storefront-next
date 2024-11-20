import { getLoggedInUser } from "@/common/utils-server";
import AccountTemplate from "../templates/account-template";
import { Customer } from "@/plugins/organization/gql/generated";

export default async function AccountPage() {
  const user = await getLoggedInUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-screen-xl py-16">
        <h1 className="mb-8 text-3xl font-bold">Account</h1>
        <p>You are not logged in.</p>
      </div>
    );
  }

  console.log(user);

  return <AccountTemplate user={user as Customer} />;
}
