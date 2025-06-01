"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AddFamilyMemberModal from "@/app/ui/AddFamilyMemberModal";
import AddCertificateModal from "@/app/ui/AddCertificateModal";

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

export default function FamilyDetailsPage() {
  const router = useRouter();
  const { familyId } = useParams();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [memberAddLoading, setMemberAddLoading] = useState(false);
  const [memberAddError, setMemberAddError] = useState<string | null>(null);

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateAddLoading, setCertificateAddLoading] = useState(false);
  const [certificateAddError, setCertificateAddError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const id = Array.isArray(familyId) ? familyId[0] : familyId;
        const res = await fetch(`https://localhost:7063/api/Family/${id}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch family: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setFamily(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (familyId) {
      fetchFamily();
    } else {
      setError("Geen familie-ID opgegeven");
      setLoading(false);
    }
  }, [familyId]);

  const handleAddMember = async (newMember: { Name: string; DateOfBirth: string }) => {
    setMemberAddLoading(true);
    setMemberAddError(null);
    try {
      const id = Array.isArray(familyId) ? familyId[0] : familyId;
      const res = await fetch(`https://localhost:7063/api/Family/FamilyMember`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...newMember, FamilyId: Number(id) }),
      });
      if (!res.ok) throw new Error(`Failed to add member: ${res.status} ${res.statusText}`);

      const fetchRes = await fetch(`https://localhost:7063/api/Family/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (!fetchRes.ok) throw new Error(`Failed to fetch family: ${fetchRes.status} ${fetchRes.statusText}`);
      const updatedFamily = await fetchRes.json();
      setFamily(updatedFamily);
      setIsMemberModalOpen(false);
    } catch (err: any) {
      setMemberAddError(err.message);
    } finally {
      setMemberAddLoading(false);
    }
  };

  const handleAddCertificate = async (newCert: { Title: string; IssueDate: string; ExpiryDate: string }) => {
    setCertificateAddLoading(true);
    setCertificateAddError(null);
    try {
      const id = Array.isArray(familyId) ? familyId[0] : familyId;
      const res = await fetch(`https://localhost:7063/api/Family/Certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...newCert, FamilyId: Number(id) }),
      });
      if (!res.ok) throw new Error(`Failed to add certificate: ${res.status} ${res.statusText}`);

      const fetchRes = await fetch(`https://localhost:7063/api/Family/${id}`, {
        headers: { Accept: "application/json" },
      });
      if (!fetchRes.ok) throw new Error(`Failed to fetch family: ${fetchRes.status} ${fetchRes.statusText}`);
      const updatedFamily = await fetchRes.json();
      setFamily(updatedFamily);
      setIsCertificateModalOpen(false);
    } catch (err: any) {
      setCertificateAddError(err.message);
    } finally {
      setCertificateAddLoading(false);
    }
  };

  if (loading) return <p className="p-6">Bezig met laden...</p>;
  if (error) return <p className="p-6 text-red-600">Fout: {error}</p>;
  if (!family) return <p className="p-6 text-gray-600">Familie niet gevonden.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white m-6 p-6 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Familie Details</h1>

        <div className="space-y-3">
          <p><span className="font-medium">ID:</span> {family.Id}</p>
          <p><span className="font-medium">Familienaam:</span> {family.Name}</p>
          <p><span className="font-medium">Adres:</span> {family.Address}</p>
          <p><span className="font-medium">Aantal Leden:</span> {family.Members.length}</p>

          <div>
            <span className="font-medium">Leden:</span>
            {family.Members.length > 0 ? (
              <ul className="list-disc list-inside ml-2">
                {family.Members.map((member) => (
                  <li key={member.Id} className="flex justify-between items-center">
                    <span>
                      {member.Name} (Geboren: {new Date(member.DateOfBirth).toLocaleDateString()})
                    </span>
                    <Link
                      href={`/familys/details/${family.Id}/members/${member.Id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Bekijk Details
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 ml-2">Geen leden</p>
            )}
          </div>

          <div>
            <span className="font-medium">Attesten:</span>
            {family.Certificates.length > 0 ? (
              <ul className="list-disc list-inside ml-2">
                {family.Certificates.map((cert) => (
                  <li key={cert.Id} className="flex items-center justify-between">
                    <span>
                      {cert.Title} (Uitgegeven: {new Date(cert.IssueDate).toLocaleDateString()},
                      Vervalt: {new Date(cert.ExpiryDate).toLocaleDateString()})
                    </span>
                    <Link
                      href={`/familys/details/${family.Id}/certificates/${cert.Id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Bekijk Details
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 ml-2">Geen attesten</p>
            )}
          </div>

        </div>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="bg-indigo-600 text-white m-2 py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Nieuw Familielid Toevoegen
          </button>

          <button
            onClick={() => setIsCertificateModalOpen(true)}
            className="bg-green-600 text-white m-2 py-2 px-4 rounded-md hover:bg-green-700"
          >
            Nieuw Attest Toevoegen
          </button>

          <button
            onClick={() => router.push("/familys")}
            className="bg-gray-600 text-white m-2 py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Terug naar Families
          </button>
        </div>

        {isMemberModalOpen && (
          <AddFamilyMemberModal
            onAdd={handleAddMember}
            onClose={() => setIsMemberModalOpen(false)}
            loading={memberAddLoading}
            error={memberAddError}
          />
        )}

        {isCertificateModalOpen && (
          <AddCertificateModal
            onAdd={handleAddCertificate}
            onClose={() => setIsCertificateModalOpen(false)}
            loading={certificateAddLoading}
            error={certificateAddError}
          />
        )}
      </div>
    </div>
  );
}
