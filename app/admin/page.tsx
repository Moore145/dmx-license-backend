// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";

type License = {
  licenseKey: string;
  deviceId: string;
  createdAt: string;
  status: string;
};

export default function AdminPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch("/api/licenses");
        const data = await res.json();
        setLicenses(data.licenses || []);
      } catch (err) {
        console.error("Failed to load licenses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6">License Activation Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : licenses.length === 0 ? (
        <p>No licenses found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4">License Key</th>
              <th className="py-2 px-4">Device ID</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((lic, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="py-2 px-4">{lic.licenseKey}</td>
                <td className="py-2 px-4 text-sm break-all">{lic.deviceId}</td>
                <td className="py-2 px-4">{lic.status}</td>
                <td className="py-2 px-4 text-sm">{new Date(lic.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
