import React, { useState } from "react";

interface AddFamilyMemberModalProps {
  onAdd: (member: { Name: string; DateOfBirth: string }) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

export default function AddFamilyMemberModal({
  onAdd,
  onClose,
  loading,
  error,
}: AddFamilyMemberModalProps) {
  const [member, setMember] = useState({ Name: "", DateOfBirth: "" });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member.Name || !member.DateOfBirth) {
      setLocalError("Naam en geboortedatum zijn verplicht.");
      return;
    }
    setLocalError(null);
    onAdd(member);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Nieuw Familielid Toevoegen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Naam</label>
            <input
              type="text"
              value={member.Name}
              onChange={(e) => setMember({ ...member, Name: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Naam"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Geboortedatum</label>
            <input
              type="date"
              value={member.DateOfBirth}
              onChange={(e) => setMember({ ...member, DateOfBirth: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              disabled={loading}
            />
          </div>
          {(localError || error) && (
            <p className="text-red-600">{localError ?? error}</p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100"
              disabled={loading}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Toevoegen..." : "Toevoegen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
