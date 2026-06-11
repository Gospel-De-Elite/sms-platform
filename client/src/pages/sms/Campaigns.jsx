import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCampaigns } from "../../services/smsService";

const statusColors = {
  DRAFT: "bg-slate-500/10 text-slate-400",
  QUEUED: "bg-yellow-500/10 text-yellow-500",
  SENDING: "bg-blue-500/10 text-blue-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  FAILED: "bg-red-500/10 text-red-500",
};

export default function Campaigns() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", page],
    queryFn: () => getCampaigns(page, 20),
  });

  const campaigns = data?.data?.campaigns || [];
  const pagination = data?.data?.pagination;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <Link
            to="/sms"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            New Campaign
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No campaigns yet</p>
              <p className="text-slate-600 text-sm mt-1">Send your first bulk SMS to get started</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Campaign</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Recipients</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Delivered</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Cost</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Status</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium">{campaign.name}</p>
                        <p className="text-slate-500 text-xs">{campaign.senderID?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white text-sm">{campaign.totalRecipients}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-500 text-sm">{campaign.totalDelivered}</span>
                        <span className="text-slate-600 text-xs ml-1">
                          / {campaign.totalSent} sent
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white text-sm">
                          ₦{parseFloat(campaign.totalCost).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[campaign.status]}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-400 text-sm">
                          {dayjs(campaign.createdAt).format("MMM D, YYYY")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}