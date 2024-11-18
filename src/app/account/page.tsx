import { getLoggedInUser, getOrderById } from "@/common/utils-server";
import Container from "@/components/container";
import Header from "@/components/header";
import Heading from "@/components/heading";
import Logout from "@/components/logout";

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

  const order = await getOrderById(user.id);

  console.log(order);
  return (
    <Container>
      <Header />
      <div className="py-16">
        <div className="mb-16 flex items-center justify-between">
          <Heading size="xl" level="h1" zeroMargin>
            Account
          </Heading>
          <Logout />
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div className="flex flex-col gap-16">
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Personal Information
              </h2>
              <div>
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div>{user.emailAddress}</div>
              </div>
            </section>
            <section>
              <h2 className="mb-4 text-xl font-semibold">Addresses</h2>
              <div className="space-y-4">
                {user.addresses?.map((address) => (
                  <div key={address.id} className="rounded border p-4">
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
          <div className="flex flex-col gap-16">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Orders</h2>
              <div className="space-y-4">
                <div>Order number</div>
                <div>Date</div>
                <div>Total</div>
                <div>Status</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
}
