'use client';

import { useEffect, useState } from 'react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export default function ContactsAdmin() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contacts?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.items)) {
          setItems(data.items);
          setTotal(data.total || 0);
        } else {
          setItems(data);
          setTotal(Array.isArray(data) ? data.length : 0);
        }
      } else {
        setError(data.error || 'Failed to load');
      }
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, limit]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages ({total || items.length})</h2>
        <button onClick={load} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Refresh</button>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {loading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No messages.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Email</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Subject</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Message</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m._id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-blue-700">{m.email}</td>
                  <td className="px-4 py-3 text-gray-700">{m.subject || '-'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[420px]"><div className="line-clamp-3">{m.message}</div></td>
                  <td className="px-4 py-3 text-gray-700">{new Date(m.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-3 border-t bg-gray-50">
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="flex items-center gap-2 text-sm">
              <button disabled={page===0} onClick={() => setPage(p => Math.max(0, p-1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Page {page+1}{total>0 ? ` of ${Math.max(1, Math.ceil(total/limit))}`: ''}</span>
              <button disabled={(page+1)>=Math.max(1, Math.ceil(total/limit))} onClick={() => setPage(p => p+1)} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
              <select value={limit} onChange={(e)=>{setPage(0); setLimit(parseInt(e.target.value,10));}} className="border border-gray-300 rounded px-1 py-1">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


