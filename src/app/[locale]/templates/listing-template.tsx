// "use client";

// import Container from "@/components/container";
// import Header from "@/components/header";
// import { getFilteredProductsAction } from "../actions";
// import { useState, useEffect } from "react";
// import ProductCard from "@/components/product-card";

// interface ListingTemplateProps {
//   slug: string;
// }

// export default function ListingTemplate({ slug }: ListingTemplateProps) {
//   const [products, setProducts] = useState<any[]>([]);
//   const [facetValues, setFacetValues] = useState<any[]>([]);
//   const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const pageSize = 12;

//   const loadMore = async () => {
//     setLoading(true);
//     try {
//       const collection = await getFilteredProductsAction(
//         "",
//         page * pageSize,
//         pageSize,
//         selectedFilters.map((id) => ({ and: id })),
//         true,
//       );
//       setProducts([...products, ...collection.items]);
//       setFacetValues(collection.facetValues);
//       setPage(page + 1);
//       setHasMore(collection.items.length === pageSize);
//     } catch (error) {
//       console.error("Failed to load more products:", error);
//     }
//     setLoading(false);
//   };

//   const handleFilterChange = (filterId: string) => {
//     setProducts([]);
//     setPage(0);
//     setHasMore(true);
//     if (selectedFilters.includes(filterId)) {
//       setSelectedFilters(selectedFilters.filter((id) => id !== filterId));
//     } else {
//       setSelectedFilters([...selectedFilters, filterId]);
//     }
//   };

//   useEffect(() => {
//     loadMore();
//   }, [selectedFilters]);

//   // Group facets by facet name
//   const groupedFacets = facetValues.reduce(
//     (
//       acc: Record<string, typeof facetValues>,
//       facet: (typeof facetValues)[number],
//     ) => {
//       const facetName = facet.facetValue.facet.name;
//       if (!acc[facetName]) {
//         acc[facetName] = [];
//       }
//       acc[facetName].push(facet);
//       return acc;
//     },
//     {} as Record<string, typeof facetValues>,
//   );

//   return (
//     <Container>
//       <Header />
//       <div className="mx-auto max-w-screen-2xl py-20">
//         <h1 className="mb-8 text-3xl font-bold capitalize">{slug}</h1>
//         <div className="grid grid-cols-12 gap-8">
//           <div className="col-span-3">
//             <div className="space-y-6">
//               {/* Iterate through each facet group (e.g. Color, Size, etc) */}
//               {Object.entries(groupedFacets).map(([facetName, facets]) => (
//                 <div key={facetName}>
//                   <h3 className="mb-2 font-semibold capitalize">{facetName}</h3>
//                   <div className="space-y-2">
//                     {/* Map through individual facet values within the group */}
//                     {facets.map((facet: any) => (
//                       <div key={facet.facetValue.id}>
//                         <label className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             checked={selectedFilters.includes(
//                               facet.facetValue.id,
//                             )}
//                             onChange={() =>
//                               handleFilterChange(facet.facetValue.id)
//                             }
//                             className="h-4 w-4 rounded border-gray-300"
//                           />
//                           <span>{facet.facetValue.name}</span>
//                           <span className="text-sm text-gray-500">
//                             ({facet.count})
//                           </span>
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="col-span-9">
//             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//               {products.map((product, index) => (
//                 <ProductCard
//                   key={index}
//                   slug={product.slug}
//                   name={product.productName}
//                   source={product.productAsset?.preview ?? ""}
//                   priceWithTax={123}
//                 />
//               ))}
//             </div>
//             {hasMore ? (
//               <div className="mt-8 flex justify-center">
//                 <button
//                   onClick={loadMore}
//                   disabled={loading}
//                   className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
//                 >
//                   {loading ? "Loading..." : "Show More"}
//                 </button>
//               </div>
//             ) : products.length >= 12 ? (
//               <div className="mt-8 flex justify-center">
//                 <p>No more products</p>
//               </div>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// }
