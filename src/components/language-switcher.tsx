"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = () => {
    const newLocale = locale === "fi" ? "en" : "fi";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const buttonLabel =
    locale === "fi" ? "Switch language to English" : "Vaihda kieli suomeksi";
  const buttonText = locale === "fi" ? "EN" : "FI";

  return (
    <button
      onClick={handleLocaleChange}
      className="px-3 py-1"
      aria-label={buttonLabel}
      type="button"
      role="switch"
      aria-checked={locale === "fi"}
    >
      {buttonText}
    </button>
  );
}
