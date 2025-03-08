import Search from "../templates/es-listing-template";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tuotteiden haku",
  description: "Selaa ja etsi tuotteita",
};

export default function ListPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Tuotehaku</h1>

      <Search />
    </div>
  );
}
