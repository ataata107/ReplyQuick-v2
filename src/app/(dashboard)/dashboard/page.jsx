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
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Call Logs</h2>
        {logsLoading ? (
          <div>Loading call logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date/Time</th>
                  <th className="border px-2 py-1">Duration (sec)</th>
                  <th className="border px-2 py-1">From</th>
                  <th className="border px-2 py-1">To</th>
                  <th className="border px-2 py-1">Summary</th>
                </tr>
              </thead>
              <tbody>
                {callLogs.map((call) => (
                  <tr key={call.call_id}>
                    <td className="border px-2 py-1">
                      {call.start_timestamp
                        ? new Date(call.start_timestamp).toLocaleString()
                        : "-"}
                    </td>
                    <td className="border px-2 py-1">
                      {call.call_cost?.total_duration_seconds ?? Math.round((call.duration_ms || 0) / 1000)}
                    </td>
                    <td className="border px-2 py-1">{call.from_number}</td>
                    <td className="border px-2 py-1">{call.to_number}</td>
                    <td className="border px-2 py-1">
                      {call.call_analysis?.call_summary || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}