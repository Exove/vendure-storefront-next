import { formatDate } from "@/common/utils";
import { getLoggedInUser } from "@/common/utils-server";
import BoxWrap from "@/components/box-wrap";
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

  console.log(user);

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
              <h2 className="mb-4 text-xl font-semibold">Address</h2>
              <div className="space-y-4">
                {user.addresses?.map((address) => (
                  <BoxWrap key={address.id}>
                    <div>{address.fullName}</div>
                    <div>{address.streetLine1}</div>
                    {address.streetLine2 && <div>{address.streetLine2}</div>}
                    <div>
                      {address.postalCode} {address.city}
                    </div>
                    <div>{address.country.name}</div>
                    {address.phoneNumber && <div>{address.phoneNumber}</div>}
                  </BoxWrap>
                ))}
              </div>
            </section>
          </div>
          <div className="flex flex-col gap-16">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Latest Order</h2>
              <div className="space-y-4">
                {user.orders?.items
                  .filter((order) => order.state !== "AddingItems")
                  .slice(-1)
                  .map((order, index) => (
                    <BoxWrap key={index}>
                      <div className="text-sm text-slate-400">
                        {formatDate(order.orderPlacedAt)}
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          {order.lines.map((line) => (
                            <div
                              key={line.productVariant.name}
                              className="font-medium"
                            >
                              {line.productVariant.name}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-full bg-slate-700 px-3 py-1 text-sm">
                          {order.state}
                        </div>
                      </div>
                    </BoxWrap>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
}
