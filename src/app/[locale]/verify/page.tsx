"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { verifyCustomerAction } from "../actions";

type VerifyFormData = {
  password: string;
  confirmPassword: string;
};

export default function VerifyPage() {
  const t = useTranslations("Verify");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyFormData>();

  const onSubmit = async (data: VerifyFormData) => {
    if (!token) {
      setErrorMessage(t("invalidToken"));
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyCustomerAction(token, data.password);

      if ("id" in result) {
        router.push("/");
      } else if ("message" in result) {
        setErrorMessage(result.message);
      }
    } catch (error: unknown) {
      console.error("Verification error:", error);
      setErrorMessage(t("verificationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
        <div className="text-red-500">{t("noToken")}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold">{t("verifyAccount")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("password")}
          </label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 8,
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.type === "required"
                ? t("passwordRequired")
                : t("passwordMinLength")}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
              validate: (val: string) => {
                if (watch("password") != val) {
                  return t("passwordsDoNotMatch");
                }
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="text-sm text-red-500">{errorMessage}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="hover:bg-primary-dark w-full rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          {isLoading ? t("verifying") : t("verify")}
        </button>
      </form>
    </div>
  );
}
