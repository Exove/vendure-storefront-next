"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import SelectVariant from "@/components/select-variant";
import { Product } from "@/gql/graphql";
import Image from "next/image";

interface ProductTemplateProps {
  product: Product;
}

export default function ProductTemplate({ product }: ProductTemplateProps) {
  return (
    <Container>
      <Header />
      <div className="flex gap-20 mt-20">
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
    </Container>
  );
}
