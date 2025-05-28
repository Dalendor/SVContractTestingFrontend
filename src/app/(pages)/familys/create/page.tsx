"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FamilyForm {
  Name: string;
  Address: string;
}

export default function CreateFamilyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FamilyForm>({
    Name: "",
    Address: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!form.Name || !form.Address) {
      setError("Vul alle velden in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://localhost:7063/api/Family", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(`Fout bij het aanmaken van familie: ${res.statusText}`);
      }

      router.push("/familys");
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating family:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Nieuwe Familie Aanmaken
      </h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="Name"
            className="block text-sm font-medium text-gray-700"
          >
            Familienaam
          </label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={form.Name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="Address"
            className="block text-sm font-medium text-gray-700"
          >
            Adres
          </label>
          <input
            type="text"
            id="Address"
            name="Address"
            value={form.Address}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "Bezig met opslaan..." : "Familie Aanmaken"}
        </button>
      </form>
    </div>
  );
}