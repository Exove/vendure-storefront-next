import { getLoggedInUser } from "@/common/utils-server";
import Container from "@/components/container";
import Header from "@/components/header";
import Logout from "@/components/logout";

export default async function AccountPage() {
  const user = await getLoggedInUser();

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto py-16">
        <h1 className="text-3xl font-bold mb-8">Account</h1>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <Container>
      <Header />
      <div className="max-w-screen-md mx-auto py-16">
        <h1 className="text-3xl font-bold mb-8">Account</h1>

        <Logout />

        <div className="flex flex-col gap-16">
          <section>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div>
              <div>
                {user.firstName} {user.lastName}
              </div>
              <div>{user.emailAddress}</div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            <div className="space-y-4">
              {user.addresses?.map((address) => (
                <div key={address.id} className="border p-4 rounded">
                  <div>{address.fullName}</div>
                  <div>{address.streetLine1}</div>
                  {address.streetLine2 && <div>{address.streetLine2}</div>}
                  <div>
                    {address.postalCode} {address.city}
                  </div>
                  <div>{address.country.name}</div>
                  {address.phoneNumber && <div>{address.phoneNumber}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
