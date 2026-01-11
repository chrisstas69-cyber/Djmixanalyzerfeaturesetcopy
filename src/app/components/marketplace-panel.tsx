import { useState, useEffect } from "react";
import { Store, Upload, DollarSign, TrendingUp, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useAuth } from "./auth-system";

interface MarketplaceItem {
  id: string;
  type: "sample" | "preset" | "loop" | "effect-chain";
  name: string;
  description: string;
  price: number;
  seller: string;
  sales: number;
  rating: number;
  createdAt: string;
}

interface SellerItem {
  id: string;
  type: "sample" | "preset" | "loop" | "effect-chain";
  name: string;
  price: number;
  sales: number;
  revenue: number;
}

export function MarketplacePanel() {
  // const { user } = useAuth();
  const user = null; // Mock for now
  const [activeTab, setActiveTab] = useState<"browse" | "sell">("browse");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [myItems, setMyItems] = useState<SellerItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [newItem, setNewItem] = useState({
    type: "sample" as MarketplaceItem["type"],
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    // Load marketplace items
    const mockItems: MarketplaceItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      type: ["sample", "preset", "loop", "effect-chain"][i % 4] as MarketplaceItem["type"],
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      price: Math.floor(Math.random() * 50) + 5,
      seller: `Seller${i % 5}`,
      sales: Math.floor(Math.random() * 100),
      rating: 4 + Math.random(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
    setItems(mockItems);

    // Load seller items
    try {
      const savedItems = localStorage.getItem("marketplaceItems");
      if (savedItems) {
        setMyItems(JSON.parse(savedItems));
        const revenue = JSON.parse(savedItems).reduce(
          (sum: number, item: SellerItem) => sum + item.revenue,
          0
        );
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.error("Error loading marketplace items:", error);
    }
  }, []);

  const handleListItem = () => {
    if (!user) {
      toast.error("Please sign in to sell items");
      return;
    }

    if (!newItem.name || newItem.price <= 0) {
      toast.error("Please fill in all fields");
      return;
    }

    const item: SellerItem = {
      id: `my-item-${Date.now()}`,
      type: newItem.type,
      name: newItem.name,
      price: newItem.price,
      sales: 0,
      revenue: 0,
    };

    const updated = [...myItems, item];
    setMyItems(updated);
    localStorage.setItem("marketplaceItems", JSON.stringify(updated));
    setNewItem({ type: "sample", name: "", description: "", price: 0 });
    toast.success("Item listed for sale!");
  };

  const handlePurchase = (item: MarketplaceItem) => {
    if (!user) {
      toast.error("Please sign in to purchase");
      return;
    }
    toast.success(`Purchased "${item.name}" for $${item.price}`);
  };

  const typeLabels = {
    sample: "Sample Pack",
    preset: "Preset",
    loop: "Loop",
    "effect-chain": "Effect Chain",
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              Marketplace for Sounds
            </h1>
            <p className="text-xs text-white/40">
              Buy and sell sample packs, presets, loops, and effect chains
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-white/60">Total Revenue</p>
              <p className="text-lg font-bold text-green-400 font-['IBM_Plex_Mono']">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <button
                onClick={() => setActiveTab("browse")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "browse"
                    ? "bg-primary/20 border border-primary/50 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <Store className="w-4 h-4 inline mr-2" />
                Browse
              </button>
              <button
                onClick={() => setActiveTab("sell")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === "sell"
                    ? "bg-primary/20 border border-primary/50 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === "browse" ? (
          /* Browse Marketplace */
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Filters */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                  <option>All Types</option>
                  <option>Sample Packs</option>
                  <option>Presets</option>
                  <option>Loops</option>
                  <option>Effect Chains</option>
                </select>
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm">
                  <option>Sort by: Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-white/40" />
                        <span className="text-xs text-white/40">{typeLabels[item.type]}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-white/60 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-lg font-bold text-primary font-['IBM_Plex_Mono']">
                        ${item.price}
                      </p>
                      <p className="text-xs text-white/40">
                        {item.sales} sales • ⭐ {item.rating.toFixed(1)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/80 text-white"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Sell Items */
          <div className="max-w-2xl mx-auto space-y-6">
            {/* List New Item */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">List New Item</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Item Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) =>
                      setNewItem({ ...newItem, type: e.target.value as MarketplaceItem["type"] })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="sample">Sample Pack</option>
                    <option value="preset">Preset</option>
                    <option value="loop">Loop</option>
                    <option value="effect-chain">Effect Chain</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Name *
                  </label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="My Awesome Sample Pack"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe your item..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Price ($) *
                  </label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: Number(e.target.value) })
                    }
                    placeholder="10.00"
                    min="0"
                    step="0.01"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/60 mb-1">Revenue Split</p>
                  <p className="text-sm text-white">
                    You receive <span className="text-green-400 font-semibold">70%</span> of each
                    sale (${((newItem.price || 0) * 0.7).toFixed(2)})
                  </p>
                </div>
                <Button
                  onClick={handleListItem}
                  className="w-full bg-primary hover:bg-primary/80 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  List Item for Sale
                </Button>
              </div>
            </div>

            {/* My Items */}
            {myItems.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">My Listed Items</h2>
                <div className="space-y-3">
                  {myItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-white/40">{typeLabels[item.type]}</span>
                          </div>
                          <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                            <span>${item.price}</span>
                            <span>{item.sales} sales</span>
                            <span className="text-green-400">
                              ${item.revenue.toFixed(2)} earned
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

