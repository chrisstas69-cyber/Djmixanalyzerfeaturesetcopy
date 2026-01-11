"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Download, FileText, Wallet, CreditCard, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { toast } from "sonner";

interface RevenueSource {
  id: string;
  source: string;
  amount: number;
  date: string;
  type: "marketplace" | "streaming" | "royalty" | "other";
}

interface RevenueStats {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  marketplace: number;
  streaming: number;
  royalties: number;
  pending: number;
}

export function RoyaltyRevenuePanel() {
  const [stats, setStats] = useState<RevenueStats>({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    marketplace: 0,
    streaming: 0,
    royalties: 0,
    pending: 0,
  });
  const [revenueHistory, setRevenueHistory] = useState<RevenueSource[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "month" | "year">("all");

  useEffect(() => {
    // Load revenue data from localStorage
    try {
      const savedRevenue = localStorage.getItem("revenueHistory");
      if (savedRevenue) {
        const history: RevenueSource[] = JSON.parse(savedRevenue);
        setRevenueHistory(history);

        // Calculate stats
        const total = history.reduce((sum, item) => sum + item.amount, 0);
        const thisMonth = history
          .filter(
            (item) =>
              new Date(item.date).getMonth() === new Date().getMonth() &&
              new Date(item.date).getFullYear() === new Date().getFullYear()
          )
          .reduce((sum, item) => sum + item.amount, 0);
        const lastMonth = history
          .filter((item) => {
            const date = new Date(item.date);
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return (
              date.getMonth() === lastMonth.getMonth() &&
              date.getFullYear() === lastMonth.getFullYear()
            );
          })
          .reduce((sum, item) => sum + item.amount, 0);

        setStats({
          totalEarnings: total,
          thisMonth,
          lastMonth,
          marketplace: history
            .filter((item) => item.type === "marketplace")
            .reduce((sum, item) => sum + item.amount, 0),
          streaming: history
            .filter((item) => item.type === "streaming")
            .reduce((sum, item) => sum + item.amount, 0),
          royalties: history
            .filter((item) => item.type === "royalty")
            .reduce((sum, item) => sum + item.amount, 0),
          pending: 0,
        });
      }
    } catch (error) {
      console.error("Error loading revenue:", error);
    }
  }, []);

  const handleExportReport = () => {
    const report = {
      period: selectedPeriod,
      stats,
      transactions: revenueHistory,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  const handleGenerateTaxReport = () => {
    toast.info("Generating tax report (1099 form)...");
    // In production, this would generate a proper 1099 form
  };

  const monthChange = stats.lastMonth > 0 
    ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth * 100).toFixed(1)
    : '0';

  return (
    <div className="h-full flex flex-col overflow-auto" style={{ background: 'var(--bg-darkest, #080808)' }}>
      {/* Header */}
      <div 
        className="px-8 py-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Royalty & Revenue
            </h1>
            <p 
              className="text-sm"
              style={{ color: 'var(--text-secondary, #a0a0a0)' }}
            >
              Track earnings, payouts, and generate tax reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateTaxReport}
              className="h-10 px-4 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{ 
                background: 'var(--bg-medium, #111111)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                color: 'var(--text-secondary, #a0a0a0)'
              }}
            >
              <FileText className="w-4 h-4" />
              Tax Report
            </button>
            <button
              onClick={handleExportReport}
              className="h-10 px-4 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              style={{ 
                background: 'var(--accent-primary, #00bcd4)', 
                color: 'var(--bg-darkest, #080808)',
                boxShadow: 'var(--shadow-glow-cyan, 0 0 20px rgba(0, 188, 212, 0.3))'
              }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div 
              className="rounded-xl p-5"
              style={{ 
                background: 'var(--bg-card, #161616)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Total Earnings
                </span>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--accent-primary-subtle, rgba(0, 188, 212, 0.1))' }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: 'var(--accent-primary, #00bcd4)' }} />
                </div>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
              >
                ${stats.totalEarnings.toFixed(2)}
              </p>
            </div>
            
            <div 
              className="rounded-xl p-5"
              style={{ 
                background: 'var(--bg-card, #161616)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  This Month
                </span>
                <div className="flex items-center gap-1">
                  {Number(monthChange) >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" style={{ color: '#4caf50' }} />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" style={{ color: '#ff5722' }} />
                  )}
                  <span 
                    className="text-xs font-medium"
                    style={{ color: Number(monthChange) >= 0 ? '#4caf50' : '#ff5722' }}
                  >
                    {monthChange}%
                  </span>
                </div>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4caf50' }}
              >
                ${stats.thisMonth.toFixed(2)}
              </p>
            </div>
            
            <div 
              className="rounded-xl p-5"
              style={{ 
                background: 'var(--bg-card, #161616)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Last Month
                </span>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--bg-medium, #111111)' }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--text-tertiary, #666666)' }} />
                </div>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
              >
                ${stats.lastMonth.toFixed(2)}
              </p>
            </div>
            
            <div 
              className="rounded-xl p-5"
              style={{ 
                background: 'var(--bg-card, #161616)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'var(--text-tertiary, #666666)' }}
                >
                  Pending
                </span>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255, 167, 38, 0.1)' }}
                >
                  <Clock className="w-4 h-4" style={{ color: 'var(--accent-warning, #ffa726)' }} />
                </div>
              </div>
              <p 
                className="text-2xl font-bold"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-warning, #ffa726)' }}
              >
                ${stats.pending.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Revenue by Source */}
          <div 
            className="rounded-xl p-6"
            style={{ 
              background: 'var(--bg-card, #161616)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
            }}
          >
            <h2 
              className="text-lg font-semibold mb-5"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Revenue by Source
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div 
                className="p-5 rounded-lg"
                style={{ background: 'var(--bg-dark, #0d0d0d)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--accent-primary-subtle, rgba(0, 188, 212, 0.1))' }}
                  >
                    <Wallet className="w-5 h-5" style={{ color: 'var(--accent-primary, #00bcd4)' }} />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                  >
                    Marketplace
                  </span>
                </div>
                <p 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary, #00bcd4)' }}
                >
                  ${stats.marketplace.toFixed(2)}
                </p>
              </div>
              
              <div 
                className="p-5 rounded-lg"
                style={{ background: 'var(--bg-dark, #0d0d0d)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(33, 150, 243, 0.1)' }}
                  >
                    <TrendingUp className="w-5 h-5" style={{ color: '#2196f3' }} />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                  >
                    Streaming
                  </span>
                </div>
                <p 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2196f3' }}
                >
                  ${stats.streaming.toFixed(2)}
                </p>
              </div>
              
              <div 
                className="p-5 rounded-lg"
                style={{ background: 'var(--bg-dark, #0d0d0d)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(156, 39, 176, 0.1)' }}
                  >
                    <DollarSign className="w-5 h-5" style={{ color: '#9c27b0' }} />
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                  >
                    Royalties
                  </span>
                </div>
                <p 
                  className="text-xl font-bold"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9c27b0' }}
                >
                  ${stats.royalties.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div 
            className="rounded-xl p-6"
            style={{ 
              background: 'var(--bg-card, #161616)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 
                className="text-lg font-semibold"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
              >
                Transaction History
              </h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-4 py-2 rounded-lg text-sm cursor-pointer focus:outline-none"
                style={{ 
                  background: 'var(--bg-dark, #0d0d0d)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                  color: 'var(--text-primary, #ffffff)'
                }}
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            {revenueHistory.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--text-muted, #444444)' }}
                />
                <p style={{ color: 'var(--text-tertiary, #666666)' }}>
                  No revenue history yet. Start selling items or earning royalties to see transactions here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {revenueHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ 
                      background: 'var(--bg-dark, #0d0d0d)',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
                    }}
                  >
                    <div className="flex-1">
                      <p 
                        className="text-sm font-medium"
                        style={{ color: 'var(--text-primary, #ffffff)' }}
                      >
                        {item.source}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: 'var(--text-tertiary, #666666)' }}
                      >
                        {new Date(item.date).toLocaleDateString()} • {item.type}
                      </p>
                    </div>
                    <p 
                      className="text-lg font-bold"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4caf50' }}
                    >
                      +${item.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payout Management */}
          <div 
            className="rounded-xl p-6"
            style={{ 
              background: 'var(--bg-card, #161616)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
            }}
          >
            <h2 
              className="text-lg font-semibold mb-5"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary, #ffffff)' }}
            >
              Payout Management
            </h2>
            <div className="space-y-4">
              <div 
                className="p-5 rounded-lg flex items-center justify-between"
                style={{ background: 'var(--bg-dark, #0d0d0d)' }}
              >
                <div>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--text-secondary, #a0a0a0)' }}
                  >
                    Available Balance
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary, #666666)' }}
                  >
                    Minimum payout: $10.00 • Next payout: End of month
                  </p>
                </div>
                <p 
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary, #ffffff)' }}
                >
                  ${(stats.totalEarnings - stats.pending).toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="h-11 px-5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: 'var(--bg-medium, #111111)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                    color: 'var(--text-secondary, #a0a0a0)'
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  Direct Deposit
                </button>
                <button
                  className="h-11 px-5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: 'var(--bg-medium, #111111)',
                    border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                    color: 'var(--text-secondary, #a0a0a0)'
                  }}
                >
                  <Wallet className="w-4 h-4" />
                  Cryptocurrency
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
