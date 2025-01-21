export function formatCurrency(
  value: number,
  locale: string = "fi",
  withLabel: boolean = true,
) {
  const amount = value / 100;
  if (!withLabel) {
    return amount;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  })
    .format(amount)
    .replace(",00", "");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
