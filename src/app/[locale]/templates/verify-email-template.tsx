"use client";

import { VENDURE_API_URL } from "@/common/constants";
import { GraphQLClient } from "graphql-request";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { print } from "graphql/language/printer";
import { VerifyMutation } from "@/gql/graphql";
import { verifyMutation } from "@/common/mutations";
import { setBearerToken } from "../actions";
import Button from "@/components/button";

export default function VerifyEmailTemplate() {
  const t = useTranslations();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(t("auth.invalidToken"));
      return;
    }

    try {
      const graphQLClient = new GraphQLClient(VENDURE_API_URL);
      const response = await graphQLClient.rawRequest<VerifyMutation>(
        print(verifyMutation),
        {
          password: password,
          token: token,
        },
      );

      const authToken = response.headers.get("vendure-auth-token");
      if (authToken) {
        await setBearerToken(authToken);
      }

      const { verifyCustomerAccount } = response.data;

      if ("id" in verifyCustomerAccount) {
        router.push("/");
        router.refresh();
      } else {
        setError(t("auth.verificationFailed"));
      }
    } catch (error) {
      console.error("Failed to verify:", error);
      setError(t("auth.verificationFailed"));
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      {token ? (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              {t("auth.newPassword")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
              required
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="mt-4">
            <Button type="submit" id="verify" fullWidth>
              {t("auth.setPassword")}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-red-500">{t("auth.invalidToken")}</div>
      )}
    </div>
  );
}
