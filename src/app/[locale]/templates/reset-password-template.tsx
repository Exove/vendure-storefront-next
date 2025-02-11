"use client";

import { VENDURE_API_URL } from "@/common/constants";
import { GraphQLClient } from "graphql-request";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { print } from "graphql/language/printer";
import { RequestPasswordResetMutation } from "@/gql/graphql";
import { requestPasswordResetMutation } from "@/common/mutations";
import Button from "@/components/button";
import Heading from "@/components/heading";

export default function ResetPasswordTemplate() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const graphQLClient = new GraphQLClient(VENDURE_API_URL);
      const response =
        await graphQLClient.request<RequestPasswordResetMutation>(
          print(requestPasswordResetMutation),
          {
            emailAddress: email,
          },
        );

      const result = response.requestPasswordReset;
      if (result && result.__typename === "Success") {
        setSuccess(t("auth.passwordResetEmailSent"));
      } else {
        setError(t("auth.passwordResetFailed"));
      }
    } catch (error) {
      console.error("Failed to request password reset:", error);
      setError(t("auth.passwordResetFailed"));
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <Heading level="h1" size="lg">
        {t("auth.resetPassword")}
      </Heading>
      <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300"
          >
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 px-3 py-2"
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <div className="mt-4">
          <Button type="submit" id="reset" fullWidth>
            {t("auth.resetPassword")}
          </Button>
        </div>
      </form>
    </div>
  );
}
