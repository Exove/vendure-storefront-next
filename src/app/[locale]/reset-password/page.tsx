import ResetPasswordTemplate from "@/app/[locale]/templates/reset-password-template";
import Container from "@/components/container";
import Header from "@/components/header";
import { getMenuItems } from "@/common/get-menu-items";

export default async function ResetPasswordPage() {
  const menuItems = await getMenuItems();

  return (
    <Container>
      <Header menuItems={menuItems} />
      <ResetPasswordTemplate />
    </Container>
  );
}
