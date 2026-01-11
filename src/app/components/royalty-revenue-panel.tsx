import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Download, FileText, Calendar } from "lucide-react";
import { Button } from "./ui/button";
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

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Royalty & Revenue Tracking
            </h1>
            <p className="text-xs text-white/40">
              Track earnings, payouts, and generate tax reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateTaxReport}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              Tax Report
            </Button>
            <Button
              onClick={handleExportReport}
              size="sm"
              className="bg-primary hover:bg-primary/80 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Revenue Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Total Earnings</span>
                <DollarSign className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                ${stats.totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">This Month</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400 font-['IBM_Plex_Mono']">
                ${stats.thisMonth.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Last Month</span>
                <TrendingUp className="w-4 h-4 text-white/40" />
              </div>
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                ${stats.lastMonth.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60 font-['IBM_Plex_Mono']">Pending</span>
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-400 font-['IBM_Plex_Mono']">
                ${stats.pending.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Revenue by Source */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue by Source</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-1">Marketplace</p>
                <p className="text-xl font-bold text-primary font-['IBM_Plex_Mono']">
                  ${stats.marketplace.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-1">Streaming</p>
                <p className="text-xl font-bold text-blue-400 font-['IBM_Plex_Mono']">
                  ${stats.streaming.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-1">Royalties</p>
                <p className="text-xl font-bold text-purple-400 font-['IBM_Plex_Mono']">
                  ${stats.royalties.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Transaction History</h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            {revenueHistory.length === 0 ? (
              <p className="text-sm text-white/60 text-center py-8">
                No revenue history yet. Start selling items or earning royalties to see transactions here.
              </p>
            ) : (
              <div className="space-y-2">
                {revenueHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.source}</p>
                      <p className="text-xs text-white/60">
                        {new Date(item.date).toLocaleDateString()} • {item.type}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-400 font-['IBM_Plex_Mono']">
                      +${item.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payout Management */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Payout Management</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white">Available Balance</p>
                  <p className="text-xl font-bold text-white font-['IBM_Plex_Mono']">
                    ${(stats.totalEarnings - stats.pending).toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-white/60">
                  Minimum payout: $10.00 • Next payout: End of month
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Direct Deposit
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Cryptocurrency
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

