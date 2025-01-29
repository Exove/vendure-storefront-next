"use client";

import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import createClient from "@searchkit/instantsearch-client";

const searchClient = createClient({
  url: "/api/search",
});

export default function ListingTemplate() {
  return (
    <InstantSearch searchClient={searchClient} indexName="vendure-variants">
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
}
