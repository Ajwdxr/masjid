"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconCreditCard, IconUser, IconUserX } from "@/components/ui/Icons";
import type { Donation } from "@/types/donation";
import { formatCurrency } from "@/lib/utils";

/* ─── Mock data ─── */
const mockDonations: Donation[] = [
  { id: "1", campaign_id: "1", donor_name: "Ahmad bin Ismail", amount: 500, payment_method: "online", payment_ref: "ZD-001", created_at: "2026-03-01T10:30:00" },
  { id: "2", campaign_id: "1", donor_name: null, amount: 100, payment_method: "qr", payment_ref: "ZD-002", created_at: "2026-02-28T14:20:00" },
  { id: "3", campaign_id: "1", donor_name: "Siti Nurhaliza", amount: 1000, payment_method: "online", payment_ref: "ZD-003", created_at: "2026-02-27T09:15:00" },
  { id: "4", campaign_id: "1", donor_name: "Mohd Razif", amount: 250, payment_method: "online", payment_ref: "ZD-004", created_at: "2026-02-26T16:00:00" },
  { id: "5", campaign_id: "2", donor_name: null, amount: 50, payment_method: "qr", payment_ref: "ZD-005", created_at: "2026-02-25T11:45:00" },
  { id: "6", campaign_id: "1", donor_name: "Fatimah Zahra", amount: 200, payment_method: "online", payment_ref: "ZD-006", created_at: "2026-02-24T08:30:00" },
  { id: "7", campaign_id: "1", donor_name: "Haji Kadir", amount: 5000, payment_method: "manual", payment_ref: "ZD-007", created_at: "2026-02-23T10:00:00" },
  { id: "8", campaign_id: "2", donor_name: null, amount: 75, payment_method: "qr", payment_ref: "ZD-008", created_at: "2026-02-22T13:20:00" },
];

export default function AdminDonationsPage() {
  const [donations] = useState<Donation[]>(mockDonations);

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#3a3528]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Donation Records
          </h2>
          <p className="text-text-admin-muted text-sm mt-1">
            {donations.length} records &middot; Total: {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-admin-muted hover:text-white transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="bg-primary hover:bg-primary-dark text-background-dark font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Donations Table */}
          <div className="bg-surface-dark rounded-xl border border-[#3a3528] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-dark-surface/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-light-muted uppercase tracking-wider">
                  Penderma
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-muted uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-muted uppercase tracking-wider">
                  Kaedah
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-muted uppercase tracking-wider">
                  Rujukan
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-light-muted uppercase tracking-wider">
                  Tarikh
                </th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, i) => (
                <tr
                  key={donation.id}
                  className="border-b border-dark-border/50 hover:bg-dark-surface/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {donation.donor_name ? <IconUser size={16} className="text-gold" /> : <IconUserX size={16} className="text-light-muted" />}
                      </span>
                      <span className="text-light text-sm">
                        {donation.donor_name || "Tanpa Nama"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold gold-text">
                    {formatCurrency(donation.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        donation.payment_method === "online"
                          ? "gold"
                          : donation.payment_method === "qr"
                            ? "emerald"
                            : "muted"
                      }
                    >
                      {donation.payment_method === "online"
                        ? "Online"
                        : donation.payment_method === "qr"
                          ? "QR"
                          : "Manual"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-light-muted text-xs font-mono">
                    {donation.payment_ref}
                  </td>
                  <td className="px-4 py-3 text-light-muted text-xs">
                    {new Date(donation.created_at).toLocaleDateString("ms-MY", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
