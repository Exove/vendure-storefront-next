export function formatCurrency(value: number) {
  const majorUnits = value / 100;
  return new Intl.NumberFormat("fi-FI", {
    style: "currency",
    currency: "EUR",
  })
    .format(majorUnits)
    .replace(",00", "");
}
