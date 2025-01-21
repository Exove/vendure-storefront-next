"use client";

import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect } from "react";
import SidePanel from "./side-panel";
import { CartContext } from "@/app/[locale]/templates/product-template";
import useSWR, { mutate } from "swr";
import {
  activeOrderAction,
  adjustOrderLineAction,
  removeItemFromOrderAction,
} from "@/app/[locale]/actions";
import { Link } from "@/i18n/routing";
import {
  PhotoIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import QuantitySelector from "./quantity-selector";
import { formatCurrency } from "@/common/utils";
import Image from "next/image";
import Button from "./button";
import { useLocale, useTranslations } from "next-intl";

export default function CartMenu() {
  const { cartQuantity } = useContext(CartContext);
  const t = useTranslations();
  const locale = useLocale();

  const { data: order, error } = useSWR("shop-api", activeOrderAction, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });
  if (error) throw error;

  useEffect(() => {
    if (cartQuantity) {
      mutate("shop-api");
    }
  }, [cartQuantity]);

  const handleRemoveItem = async (itemId: string) => {
    await removeItemFromOrderAction(itemId);
    mutate("shop-api");
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    await adjustOrderLineAction(itemId, quantity);
    mutate("shop-api");
  };

  return (
    <SidePanel
      title={t("cart.title")}
      buttonId="open-cart"
      openLabel={
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="h-6 w-6" />
          {order?.totalQuantity ? (
            <motion.div
              animate={{
                scale: cartQuantity !== 0 ? [0.6, 1] : 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                },
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border text-sm"
              key={cartQuantity}
              role="status"
              aria-live="polite"
              aria-label={`${order.totalQuantity} ${t("cart.itemsInCart")}`}
            >
              {order.totalQuantity}
            </motion.div>
          ) : (
            <div className="h-7 w-7 border border-transparent" />
          )}
          <span className="sr-only">{t("common.cart")}</span>
        </div>
      }
      footer={
        order?.lines?.length ? (
          <div className="mb-10 flex flex-col gap-4 border-t border-slate-700 pt-6">
            <div className="flex w-full justify-between text-lg font-medium">
              <span>{t("cart.subtotal")}</span>
              <span>{formatCurrency(order?.subTotalWithTax ?? 0, locale)}</span>
            </div>
            <div>
              <Button href="/checkout" id="checkout" fullWidth>
                {t("cart.checkout")}
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      <div className="mb-6 mt-10 flex flex-col divide-y divide-slate-700">
        <AnimatePresence>
          {order?.lines.map((item) => (
            <motion.div
              key={item.id}
              exit={{ opacity: 0, x: -400 }}
              className="py-6 first:pt-0 last:pb-0"
            >
              <div className="flex gap-6">
                <Link
                  href={`/products/${item.productVariant.product.slug}`}
                  className="flex-shrink-0 overflow-hidden rounded-lg"
                >
                  {item.featuredAsset?.preview ? (
                    <Image
                      src={
                        item.featuredAsset?.preview ?? "/placeholder-image.jpg"
                      }
                      alt={item.productVariant.name}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover transition-transform hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center">
                      <PhotoIcon className="h-12 w-12 text-slate-600" />
                    </div>
                  )}
                </Link>
                <div className="flex w-full flex-col justify-between">
                  <div className="flex w-full justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productVariant.product.slug}`}
                        className="font-medium hover:text-slate-300"
                      >
                        {item.productVariant.name}
                      </Link>
                    </div>
                    <div className="font-medium" aria-live="polite">
                      {formatCurrency(item.linePriceWithTax, locale)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex w-full items-center justify-between">
                      <QuantitySelector
                        initialQuantity={item.quantity}
                        onChange={(quantity) =>
                          handleQuantityChange(item.id, quantity)
                        }
                      />

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        name="remove-from-cart"
                      >
                        <TrashIcon className="h-8 w-8 rounded-full bg-red-900/50 p-2 hover:bg-red-800" />
                        <span className="sr-only">{t("cart.remove")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {!order?.lines?.length && (
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center text-slate-400"
          data-testid="empty-cart"
        >
          {t("cart.empty")}
        </motion.div>
      )}
    </SidePanel>
  );
}
