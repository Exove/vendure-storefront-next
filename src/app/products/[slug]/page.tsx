import { API_URL } from "@/common/constants";
import { productBySlugQuery } from "@/common/queries";
import SelectVariant from "@/components/select-variant";
import { request } from "graphql-request";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const { product } = await request(API_URL, productBySlugQuery, {
    slug: slug,
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-screen-xl mx-auto py-20 flex gap-20">
      <Image
        src={product.assets[0].source}
        alt=""
        width={product.assets[0].width}
        height={product.assets[0].height}
        className="w-[400px] h-auto"
      />
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-bold mb-8">{product.name}</h1>
          <p className="text-lg">{product.description}</p>
        </div>

        <SelectVariant variants={product.variants} />
      </div>
    </div>
  );
}
