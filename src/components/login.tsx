"use client";

import { VENDURE_API_URL } from "@/common/constants";
import { GraphQLClient } from "graphql-request";
import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { loginMutation } from "@/common/mutations";
import { print } from "graphql";
import { LoginMutation } from "@/gql/graphql";
import { setBearerToken } from "../app/[locale]/actions";
import { Link } from "@/i18n/routing";
import Button from "./button";

export default function Login() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const graphQLClient = new GraphQLClient(VENDURE_API_URL);

      // Use rawRequest to get the bearer token from the response headers
      const response = await graphQLClient.rawRequest<LoginMutation>(
        print(loginMutation),
        {
          emailAddress: email,
          password: password,
          rememberMe: true,
        },
      );

      // Set the bearer token in the cookies
      const authToken = response.headers.get("vendure-auth-token");
      if (authToken) {
        await setBearerToken(authToken);
      }

      const { login } = response.data;

      if ("id" in login) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Failed to login:", error);
      setError("Failed to login");
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300"
          >
            {t("auth.password")}
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
        {error && <div className="text-red-500">{t("auth.loginFailed")}</div>}
        <div className="mt-4">
          <Button type="submit" id="login" fullWidth>
            {t("auth.login")}
          </Button>
        </div>
      </form>
      <div className="mt-8 flex flex-col gap-4 text-center">
        <Link href="/register" className="text-blue-400 hover:text-blue-300">
          {t("Register.createAccount")}
        </Link>
        <Link href="/verify" className="text-blue-400 hover:text-blue-300">
          {t("auth.forgotPassword")}
        </Link>
      </div>
    </div>
  );
}
