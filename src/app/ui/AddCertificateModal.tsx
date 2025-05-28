import { useState } from "react";

interface AddCertificateModalProps {
  onAdd: (cert: { Title: string; IssueDate: string; ExpiryDate: string }) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

export default function AddCertificateModal({ onAdd, onClose, loading, error }: AddCertificateModalProps) {
  const [form, setForm] = useState({ Title: "", IssueDate: "", ExpiryDate: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Title || !form.IssueDate || !form.ExpiryDate) {
      setFormError("Alle velden zijn verplicht.");
      return;
    }
    if (new Date(form.ExpiryDate) < new Date(form.IssueDate)) {
      setFormError("Vervaldatum kan niet vóór uitgiftedatum zijn.");
      return;
    }
    setFormError(null);
    onAdd(form);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Nieuw Attest Toevoegen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Titel</label>
            <input
              type="text"
              value={form.Title}
              onChange={(e) => setForm({ ...form, Title: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Titel"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Uitgiftedatum</label>
            <input
              type="date"
              value={form.IssueDate}
              onChange={(e) => setForm({ ...form, IssueDate: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Vervaldatum</label>
            <input
              type="date"
              value={form.ExpiryDate}
              onChange={(e) => setForm({ ...form, ExpiryDate: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          {formError && <p className="text-red-600">{formError}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-2 px-4 rounded border border-gray-300 hover:bg-gray-100"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Toevoegen..." : "Toevoegen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
