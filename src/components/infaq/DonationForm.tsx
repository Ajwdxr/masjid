"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { DonationFormData } from "@/types/donation";

interface DonationFormProps {
  campaignId: string;
  qrCodeUrl?: string | null;
  paymentLink?: string | null;
  onSubmit: (data: DonationFormData) => void;
}

const AMOUNTS = [10, 20, 50, 100, 200, 500];

export function DonationForm({
  campaignId,
  qrCodeUrl,
  paymentLink,
  onSubmit,
}: DonationFormProps) {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const effectiveAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    onSubmit({
      campaign_id: campaignId,
      donor_name: isAnonymous ? null : donorName || null,
      amount: effectiveAmount,
      payment_method: "online",
      payment_ref: `ZD-${Date.now()}`,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold font-[family-name:var(--font-poppins)] gold-text mb-5">
        💳 Buat Sumbangan
      </h3>

      {showSuccess && (
        <div className="mb-5 p-4 rounded-xl bg-emerald/15 border border-emerald/30 text-center animate-fade-in">
          <span className="text-2xl mb-2 block">✅</span>
          <p className="text-sm text-emerald-light font-medium">
            Jazakallahu Khairan! Sumbangan anda telah direkodkan.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quick amounts */}
        <div>
          <label className="block text-sm font-medium text-light mb-2">
            Pilih Jumlah (RM)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAmount(a);
                  setCustomAmount("");
                }}
                className={`py-3 rounded-[var(--radius-btn)] text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  amount === a && !customAmount
                    ? "gold-gradient text-dark shadow-lg"
                    : "bg-dark-surface border border-dark-border text-light-muted hover:border-gold/30 hover:text-light"
                }`}
              >
                RM {a}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Atau masukkan jumlah sendiri
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-light-muted text-sm">
              RM
            </span>
            <input
              type="number"
              min="1"
              step="0.01"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Donor name */}
        <div>
          <label className="block text-sm font-medium text-light mb-1.5">
            Nama Penderma
          </label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            disabled={isAnonymous}
            className="w-full px-4 py-2.5 bg-dark-surface border border-dark-border rounded-[var(--radius-btn)] text-light text-sm placeholder:text-light-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all disabled:opacity-50"
            placeholder="Masukkan nama anda..."
          />
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
              isAnonymous
                ? "bg-emerald"
                : "bg-dark-surface border border-dark-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-light shadow transition-transform duration-300 ${
                isAnonymous ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-light-muted">
            Derma secara tanpa nama
          </span>
        </div>

        {/* QR Code section */}
        {qrCodeUrl && (
          <div className="text-center p-4 bg-light rounded-xl">
            <p className="text-dark text-xs font-medium mb-2">
              Imbas QR untuk bayar
            </p>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
        )}

        {/* Submit */}
        <div className="space-y-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
          >
            💳 Sumbang RM {effectiveAmount.toFixed(2)}
          </Button>

          {paymentLink && (
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
              >
                🔗 Bayar melalui DuitNow / ToyyibPay
              </Button>
            </a>
          )}
        </div>
      </form>
    </Card>
  );
}
