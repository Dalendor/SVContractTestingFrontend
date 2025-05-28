"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Member {
  Id: number;
  Name: string;
  DateOfBirth: string;
  FamilyId: number;
}

export default function MemberDetailsPage() {
  const router = useRouter();
  const { familyId, memberId } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`https://localhost:7063/api/Family/FamilyMember/${memberId}`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch member: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setMember(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };
    if (memberId) fetchMember();
  }, [memberId]);

  if (loading) return <p className="p-6">Bezig met laden...</p>;
  if (error) return <p className="p-6 text-red-600">Fout: {error}</p>;
  if (!member) return <p className="p-6 text-gray-600">Lid niet gevonden.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white m-6 p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Lid Details
        </h1>
        <div className="space-y-3">
          <p className="text-gray-600 text-lg">
            <span className="font-medium">ID:</span> {member.Id}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Naam:</span> {member.Name}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Geboortedatum:</span>{" "}
            {new Date(member.DateOfBirth).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Familie ID:</span> {member.FamilyId}
          </p>
        </div>
        <button
          onClick={() => router.push(`/familys/details/${familyId}`)}
          className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Terug naar Familie
        </button>
      </div>
    </div>
  );
}