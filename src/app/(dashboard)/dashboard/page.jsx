"use client";
import { InsightsChart } from '@/components/dashboard/InsightsChart';
import { LeadsList } from '@/components/dashboard/LeadsList';
import { useEffect, useState } from 'react';
import { RxAvatar } from "react-icons/rx";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLogsLoading(true);
      const res = await fetch('/api/calls/retell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_number: ["+19412717374"],
          to_number: ["+919511510494"]
        }),
      });
      const data = await res.json();
      setCallLogs(Array.isArray(data) ? data : data.calls || []);
      setLogsLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold">Welcome! 👋</h1>
        <div className="flex items-center gap-3">
          <RxAvatar className="w-8 h-8 rounded-full" />
          <span className="text-sm sm:text-base">{user?.name || "Guest"}</span>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <InsightsChart />
        <LeadsList />
        {/* Call Logs Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Call Logs</h2>
          <div className="bg-white rounded-lg shadow border border-gray-200">
            {logsLoading ? (
              <div className="p-6 text-center text-gray-500">Loading call logs...</div>
            ) : callLogs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No call logs found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Date/Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration (sec)</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">From</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">To</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Summary</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {callLogs.map((call, idx) => (
                      <tr
                        key={call.call_id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                      >
                        <td className="px-4 py-2 whitespace-nowrap">
                          {call.start_timestamp
                            ? new Date(call.start_timestamp).toLocaleString()
                            : "-"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {call.call_cost?.total_duration_seconds ??
                            Math.round((call.duration_ms || 0) / 1000)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{call.from_number}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{call.to_number}</td>
                        <td className="px-4 py-2 max-w-xs truncate" title={call.call_analysis?.call_summary}>
                          {call.call_analysis?.call_summary || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}