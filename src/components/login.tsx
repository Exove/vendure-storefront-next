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
          <label htmlFor="email" className="mb-2 block">
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block">
            {t("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2 text-black"
            required
          />
        </div>
        {error && <div className="text-red-500">{t("auth.loginFailed")}</div>}
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          name="login"
        >
          {t("auth.login")}
        </button>
      </form>
      <div className="mt-8 flex flex-col gap-4 text-center">
        <Link href="/register" className="text-blue-500 hover:text-blue-700">
          {t("Register.createAccount")}
        </Link>
        <Link href="#" className="text-blue-500 hover:text-blue-700">
          {t("auth.forgotPassword")}
        </Link>
      </div>
    </div>
  );
}
