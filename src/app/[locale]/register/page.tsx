"use client";

// import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { RegisterCustomerInput } from "@/gql/graphql";
import { registerCustomerAction } from "../actions";
import Button from "@/components/button";

type RegisterFormData = RegisterCustomerInput;

export default function RegisterPage() {
  const t = useTranslations("Register");
  // const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await registerCustomerAction(data);

      if ("success" in result) {
        console.log("result", result);
        // router.push("/verify");
      } else if ("message" in result) {
        setErrorMessage(result.message);
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      setErrorMessage(t("registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-slate-800/50 p-6 shadow-lg backdrop-blur">
      <h1 className="mb-6 text-2xl font-bold text-white">
        {t("createAccount")}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              {t("firstName")}
            </label>
            <input
              {...register("firstName", { required: true })}
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2 shadow-sm"
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {t("firstNameRequired")}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              {t("lastName")}
            </label>
            <input
              {...register("lastName", { required: true })}
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2 shadow-sm"
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {t("lastNameRequired")}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              {t("email")}
            </label>
            <input
              type="email"
              {...register("emailAddress", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2 shadow-sm"
            />
            {errors.emailAddress && (
              <span className="text-sm text-red-500">
                {t("validEmailRequired")}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              {t("phone")}
            </label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2 shadow-sm"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="text-sm text-red-500">{errorMessage}</div>
        )}

        <div className="mt-8">
          <Button
            type="submit"
            style={isLoading ? "disabled" : "primary"}
            fullWidth
          >
            {isLoading ? t("registering") : t("register")}
          </Button>
        </div>
      </form>
    </div>
  );
}
