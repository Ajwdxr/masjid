"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconCreditCard, IconUser, IconUserX, IconPlus } from "@/components/ui/Icons";
import type { Donation } from "@/types/donation";
import type { Campaign } from "@/types/campaign";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    campaign_id: "",
    donor_name: "",
    amount: "",
    payment_ref: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: donationsData } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      
      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*")
        .order("title", { ascending: true });
      
      if (donationsData) setDonations(donationsData);
      if (campaignsData) setCampaigns(campaignsData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDonation = {
        campaign_id: formData.campaign_id,
        donor_name: formData.donor_name || null,
        amount: parseFloat(formData.amount),
        payment_method: "manual",
        payment_ref: formData.payment_ref || `MANUAL-${Date.now()}`,
      };

      const { data, error } = await supabase
        .from("donations")
        .insert([newDonation])
        .select();

      if (error) throw error;

      if (data) {
        setDonations([data[0], ...donations]);
        setShowForm(false);
        setFormData({ campaign_id: "", donor_name: "", amount: "", payment_ref: "" });
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

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
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary-dark text-background-dark font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <IconPlus size={20} />
            <span>Record Manual Donation</span>
          </button>
          <button className="bg-surface-dark border border-[#3a3528] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {showForm && (
            <Card className="animate-fade-in border-primary/30">
              <h3 className="text-lg font-semibold text-white mb-4">Record New Manual Donation</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-admin-muted uppercase tracking-wider">Campaign</label>
                  <select 
                    required
                    value={formData.campaign_id}
                    onChange={(e) => setFormData({...formData, campaign_id: e.target.value})}
                    className="w-full bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Campaign</option>
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-admin-muted uppercase tracking-wider">Donor Name</label>
                  <input 
                    type="text"
                    value={formData.donor_name}
                    onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
                    className="w-full bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-primary"
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-admin-muted uppercase tracking-wider">Amount (RM)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-primary"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" className="flex-1">Save Record</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          {/* Donations Table */}
          <div className="bg-surface-dark rounded-xl border border-[#3a3528] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#3a3528] bg-background-dark/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-admin-muted uppercase tracking-wider">Penderma</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-admin-muted uppercase tracking-wider">Jumlah</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-admin-muted uppercase tracking-wider">Kaedah</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-admin-muted uppercase tracking-wider">Rujukan</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-admin-muted uppercase tracking-wider">Tarikh</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-b border-[#3a3528]/50 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-white">
                          {donation.donor_name ? <IconUser size={16} className="text-primary" /> : <IconUserX size={16} className="text-text-admin-muted" />}
                          <span>{donation.donor_name || "Tanpa Nama"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(donation.amount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={donation.payment_method === "online" ? "gold" : donation.payment_method === "qr" ? "emerald" : "muted"}>
                          {donation.payment_method === "online" ? "Online" : donation.payment_method === "qr" ? "QR" : "Manual"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-admin-muted text-xs font-mono">{donation.payment_ref}</td>
                      <td className="px-4 py-3 text-text-admin-muted text-xs">
                        {new Date(donation.created_at).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
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
