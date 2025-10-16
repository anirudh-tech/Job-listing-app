"use client";

import React from "react";

export default function CategoriesAdmin() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add category');
        return;
      }
      setName("");
      await load();
    } catch (e) {
      setError('Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Categories</h2>
      <form onSubmit={onSubmit} className="flex items-center gap-2 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Add new category" />
        <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add'}</button>
      </form>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-gray-500" colSpan={2}>No categories yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


