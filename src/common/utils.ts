export function formatCurrency(
  value: number,
  locale: string = "fi",
  withLabel: boolean = true,
) {
  const amount = value / 100;
  if (!withLabel) {
    return amount;
  }
  if (locale === "fi") {
    return amount + " " + (amount === 1 ? "token" : "tokenia");
  }
  return amount + " " + (amount === 1 ? "token" : "tokens");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
