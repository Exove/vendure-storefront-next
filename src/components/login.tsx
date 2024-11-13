"use client";

import { API_URL } from "@/common/constants";
import { loginMutation } from "@/common/queries";
import { GraphQLClient } from "graphql-request";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const graphQLClient = new GraphQLClient(API_URL, {
        credentials: "include",
      });

      const { login } = await graphQLClient.request(loginMutation, {
        emailAddress: email,
        password: password,
        rememberMe: true,
      });

      if ("id" in login) {
        router.push("/");
        router.refresh();
      } else {
        setError("Invalid email or password");
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Failed to login:", error);
      setError("Failed to login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
