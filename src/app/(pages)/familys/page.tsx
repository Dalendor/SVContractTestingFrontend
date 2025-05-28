"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Member {
  Id: number;
  Name: string;
  DateOfBirth: string;
  FamilyId: number;
}

interface Certificate {
  Id: number;
  Title: string;
  IssueDate: string;
  ExpiryDate: string;
  FamilyId: number;
}

interface Family {
  Id: number;
  Name: string;
  Address: string;
  Members: Member[];
  Certificates: Certificate[];
}

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const res = await fetch("https://localhost:7063/api/Family", {
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch families: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setFamilies(data.items || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching families:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFamilies();
  }, []);

  if (loading) return <p className="p-6">Bezig met laden...</p>;
  if (error) return <p className="p-6 text-red-600">Fout: {error}</p>;

  return (
    <div className="p-6">
      <Link href="/familys/create">
        <button className="mb-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
          Nieuwe Familie Aanmaken
        </button>
      </Link>
      {families.length === 0 ? (
        <p className="p-6 text-gray-600">Geen families gevonden.</p>
      ) : (
        families.map((family) => (
          <div
            key={family.Id}
            className="flex flex-col md:flex-row max-w-[calc(100vw-100px)] mx-auto items-start md:justify-between md:items-center bg-white m-6 p-6 border rounded-lg shadow-lg"
          >
            <div className="flex flex-col space-y-3 md:mt-0">
              <p className="text-2xl font-semibold text-gray-800 mb-3">
                <span className="text-gray-600 font-normal">Familienaam:</span>{" "}
                <br className="md:hidden" /> {family.Name}
              </p>
              <p className="text-gray-600 text-lg mr-3">
                Aantal leden:{" "}
                <span className="text-black font-semibold">
                  {family.Members.length}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                Adres: <span className="text-black font-medium">{family.Address}</span>
              </p>
              <div className="text-gray-600 text-sm">
                Attesten:
                {family.Certificates.length > 0 ? (
                  <ul className="list-disc list-inside ml-2">
                    {family.Certificates.map((cert) => (
                      <li key={cert.Id}>{cert.Title}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="ml-2 text-gray-500">Geen</span>
                )}
              </div>
            </div>
            <Link href={`/familys/details/${family.Id}`}>
              <button className="text-indigo-600 hover:underline mt-2">
                Bekijk Details
              </button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}