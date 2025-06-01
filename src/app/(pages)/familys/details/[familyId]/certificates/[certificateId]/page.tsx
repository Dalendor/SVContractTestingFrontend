"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Certificate {
  Id: number;
  Title: string;
  IssueDate: string;
  ExpiryDate: string;
  FamilyId: number;
}

export default function CertificateDetailsPage() {
  const router = useRouter();
  const { familyId, certificateId } = useParams();

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        if (!certificateId) {
          setError("Geen attest-ID opgegeven.");
          setLoading(false);
          return;
        }
        const res = await fetch(`https://localhost:7063/api/Family/Certificate/${certificateId}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch certificate: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setCertificate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [certificateId]);

  const handleDelete = async () => {
    if (!certificateId) return;
    if (!confirm("Weet je zeker dat je dit attest wilt verwijderen?")) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await fetch(`https://localhost:7063/api/Family/Certificate/${certificateId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete certificate: ${res.status} ${res.statusText}`);
      }
      router.push(`/familys/details/${familyId}`);
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <p className="p-6">Bezig met laden...</p>;
  if (error) return <p className="p-6 text-red-600">Fout: {error}</p>;
  if (!certificate) return <p className="p-6 text-gray-600">Attest niet gevonden.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white m-6 p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Attest Details</h1>
        <div className="space-y-3">
          <p className="text-gray-600 text-lg">
            <span className="font-medium">ID:</span> {certificate.Id}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Titel:</span> {certificate.Title}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Uitgiftedatum:</span>{" "}
            {new Date(certificate.IssueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Vervaldatum:</span>{" "}
            {new Date(certificate.ExpiryDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-lg">
            <span className="font-medium">Familie ID:</span> {certificate.FamilyId}
          </p>
        </div>

        {deleteError && (
          <p className="mt-4 text-red-600">Fout bij verwijderen: {deleteError}</p>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(`/familys/details/${familyId}`)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            disabled={deleteLoading}
          >
            Terug naar Familie
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Bezig met verwijderen..." : "Verwijderen"}
          </button>
        </div>
      </div>
    </div>
  );
}
