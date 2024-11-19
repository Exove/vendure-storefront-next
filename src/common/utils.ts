export function formatCurrency(value: number) {
  const majorUnits = value / 100;
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
  })
    .format(majorUnits)
    .replace(",00", "");
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
