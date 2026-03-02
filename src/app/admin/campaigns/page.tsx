"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconWallet, IconEdit, IconTrash, IconPlus } from "@/components/ui/Icons";
import type { Campaign, CampaignFormData } from "@/types/campaign";
import { formatCurrency, calcPercentage, formatShortDate } from "@/lib/utils";

/* ─── Mock data ─── */
const initialCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Tabung Penyelenggaraan Masjid 2026",
    description:
      "Sumbangan untuk penyelenggaraan dan pembaikan kemudahan Masjid Zahir.",
    target_amount: 500000,
    collected_amount: 187500,
    end_date: "2026-12-31",
    is_active: true,
    qr_code_url: null,
    payment_link: null,
    created_at: "2026-01-01",
  },
  {
    id: "2",
    title: "Tabung Bina Surau Kampung",
    description:
      "Membantu pembinaan surau baru di Kampung Perak untuk kemudahan penduduk.",
    target_amount: 150000,
    collected_amount: 45000,
    end_date: "2026-06-30",
    is_active: true,
    qr_code_url: null,
    payment_link: null,
    created_at: "2026-02-01",
  },
];

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    target_amount: 0,
    end_date: "",
    is_active: true,
    qr_code_url: null,
    payment_link: null,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      target_amount: 0,
      end_date: "",
      is_active: true,
      qr_code_url: null,
      payment_link: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      title: campaign.title,
      description: campaign.description,
      target_amount: campaign.target_amount,
      end_date: campaign.end_date,
      is_active: campaign.is_active,
      qr_code_url: campaign.qr_code_url,
      payment_link: campaign.payment_link,
    });
    setEditingId(campaign.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingId
            ? { ...c, ...formData, updated_at: new Date().toISOString() }
            : c
        )
      );
    } else {
      const newCampaign: Campaign = {
        ...formData,
        id: Date.now().toString(),
        collected_amount: 0,
        created_at: new Date().toISOString(),
      };
      setCampaigns([newCampaign, ...campaigns]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Adakah anda pasti mahu padam kempen ini?")) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 border-b border-[#3a3528]">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Campaign Management
          </h2>
          <p className="text-text-admin-muted text-sm mt-1">
            Create, track, and manage fundraising initiatives.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-admin-muted hover:text-white transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-primary hover:bg-primary-dark text-background-dark font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Campaign</span>
            </button>
          )}
        </div>
      </header>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto">
          {/* Left Column: Create Form & Stats */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <div className={`bg-surface-dark rounded-xl p-6 border border-[#3a3528] shadow-sm transition-all duration-300 ${showForm ? 'opacity-100 scale-100' : 'opacity-50 grayscale pointer-events-none'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">
                    edit_document
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {editingId ? "Edit Campaign" : "Create New Campaign"}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-admin-muted">
                    Campaign Title
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-gray-600 focus:outline-none transition-all"
                    placeholder="e.g., Ramadan Iftar Fund 2024"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-admin-muted">
                    Target Amount (MYR)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">RM</span>
                    </div>
                    <input
                      required
                      type="number"
                      value={formData.target_amount || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          target_amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3 placeholder-gray-600 focus:outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-admin-muted">
                      Start Date
                    </label>
                    <input
                      className="bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-gray-600 focus:outline-none transition-all [color-scheme:dark]"
                      type="date"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-admin-muted">
                      End Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-gray-600 focus:outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-admin-muted">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="bg-background-dark border border-[#3a3528] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-gray-600 focus:outline-none transition-all resize-none"
                    placeholder="Describe the purpose and goals of this campaign..."
                  ></textarea>
                </div>
                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-background-dark font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20"
                  >
                    {editingId ? "Update Campaign" : "Launch Campaign"}
                  </button>
                  {showForm && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-3 border border-[#3a3528] text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dark rounded-xl p-5 border border-[#3a3528] flex flex-col gap-1">
                <span className="text-text-admin-muted text-xs uppercase tracking-wider font-semibold">
                  Total Raised
                </span>
                <span className="text-2xl font-bold text-white">
                  RM {campaigns.reduce((acc, c) => acc + c.collected_amount, 0).toLocaleString()}
                </span>
                <span className="text-green-500 text-xs flex items-center mt-1">
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    trending_up
                  </span>{" "}
                  +12% this month
                </span>
              </div>
              <div className="bg-surface-dark rounded-xl p-5 border border-[#3a3528] flex flex-col gap-1">
                <span className="text-text-admin-muted text-xs uppercase tracking-wider font-semibold">
                  Active Donors
                </span>
                <span className="text-2xl font-bold text-white">1,204</span>
                <span className="text-primary text-xs flex items-center mt-1">
                  <span className="material-symbols-outlined text-[16px] mr-1">
                    person_add
                  </span>{" "}
                  +85 this week
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Campaigns List */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-dark rounded-xl border border-[#3a3528] overflow-hidden shadow-sm flex flex-col h-full min-h-[600px]">
              <div className="p-6 border-b border-[#3a3528] flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Active Campaigns
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 text-text-admin-muted hover:text-white rounded-lg hover:bg-[#3a3528] transition-colors">
                    <span className="material-symbols-outlined">
                      filter_list
                    </span>
                  </button>
                  <button className="p-2 text-text-admin-muted hover:text-white rounded-lg hover:bg-[#3a3528] transition-colors">
                    <span className="material-symbols-outlined">sort</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {campaigns.map((campaign) => {
                  const pct = calcPercentage(
                    campaign.collected_amount,
                    campaign.target_amount
                  );
                  return (
                    <div
                      key={campaign.id}
                      className="p-4 rounded-lg bg-background-dark/50 hover:bg-[#322e25] border border-transparent hover:border-[#3a3528] transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-4">
                          <div
                            className="h-12 w-12 rounded-lg bg-cover bg-center shrink-0 shadow-inner bg-slate-800"
                            style={{
                              backgroundImage: `url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=200&auto=format&fit=crop')`,
                            }}
                          ></div>
                          <div>
                            <h4 className="text-white font-medium text-base group-hover:text-primary transition-colors">
                              {campaign.title}
                            </h4>
                            <p className="text-text-admin-muted text-xs mt-1">
                              General Fund • Ends in {formatShortDate(campaign.end_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${campaign.is_active ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                            {campaign.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEdit(campaign); }}
                              className="p-1 text-text-admin-muted hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(campaign.id); }}
                              className="p-1 text-text-admin-muted hover:text-red-400 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white font-semibold">
                            {formatCurrency(campaign.collected_amount)}{" "}
                            <span className="text-text-admin-muted font-normal">
                              raised
                            </span>
                          </span>
                          <span className="text-text-admin-muted">
                            of {formatCurrency(campaign.target_amount)}
                          </span>
                        </div>
                        <div className="w-full bg-[#3a3528] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-text-admin-muted pt-1">
                          <span>{pct}% Funded</span>
                          <span>342 Donors</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-[#3a3528] bg-[#23201a]">
                <button className="w-full py-2 text-sm text-text-admin-muted hover:text-primary transition-colors font-medium flex items-center justify-center gap-2">
                  <span>View All Campaigns</span>
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
