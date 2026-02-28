import { useState } from "react";
import { Palette, Globe, DollarSign, Save, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

export function WhiteLabelPanel() {
  const [branding, setBranding] = useState({
    companyName: "",
    logo: "",
    primaryColor: "#f97316",
    secondaryColor: "#3b82f6",
    domain: "",
  });
  const [revenueShare, setRevenueShare] = useState(20);
  const [customDomain, setCustomDomain] = useState("");

  const handleSave = () => {
    localStorage.setItem("whiteLabelConfig", JSON.stringify(branding));
    toast.success("White label configuration saved!");
  };

  const handleUploadLogo = () => {
    toast.info("Logo upload (mock - in production, this would upload to CDN)");
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              White Label Solution
            </h1>
            <p className="text-xs text-white/40">
              Rebranding, custom domain, and revenue sharing
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Branding */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Branding Customization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Company Name
                </label>
                <Input
                  value={branding.companyName}
                  onChange={(e) =>
                    setBranding({ ...branding, companyName: e.target.value })
                  }
                  placeholder="Your Company Name"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Logo URL
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={branding.logo}
                    onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                    placeholder="https://your-domain.com/logo.png"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Button
                    onClick={handleUploadLogo}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, primaryColor: e.target.value })
                      }
                      className="w-16 h-10 bg-white/5 border-white/10"
                    />
                    <Input
                      value={branding.primaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, primaryColor: e.target.value })
                      }
                      className="flex-1 bg-white/5 border-white/10 text-white font-['IBM_Plex_Mono']"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, secondaryColor: e.target.value })
                      }
                      className="w-16 h-10 bg-white/5 border-white/10"
                    />
                    <Input
                      value={branding.secondaryColor}
                      onChange={(e) =>
                        setBranding({ ...branding, secondaryColor: e.target.value })
                      }
                      className="flex-1 bg-white/5 border-white/10 text-white font-['IBM_Plex_Mono']"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Custom Domain
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Domain
                </label>
                <Input
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="app.yourcompany.com"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-2">DNS Configuration</p>
                <div className="space-y-1 text-xs text-white/40 font-['IBM_Plex_Mono']">
                  <p>Type: CNAME</p>
                  <p>Name: {customDomain || "your-domain.com"}</p>
                  <p>Value: app.syntaxaudio.com</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/80 text-white">
                Verify Domain
              </Button>
            </div>
          </div>

          {/* Revenue Share */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Revenue Sharing
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Your Revenue Share: {revenueShare}%
                </label>
                <Slider
                  value={[revenueShare]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(value) => setRevenueShare(value[0])}
                  className="w-full"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-1">Revenue Split</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Your Share</span>
                  <span className="text-green-400 font-['IBM_Plex_Mono']">{revenueShare}%</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-white">Syntax Audio</span>
                  <span className="text-white/60 font-['IBM_Plex_Mono']">
                    {100 - revenueShare}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
            <div className="p-6 bg-black/40 rounded-lg border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                {branding.logo && (
                  <img
                    src={branding.logo}
                    alt="Logo"
                    className="w-12 h-12 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <h3
                  className="text-xl font-bold"
                  style={{ color: branding.primaryColor }}
                >
                  {branding.companyName || "Your Company"}
                </h3>
              </div>
              <div className="space-y-2">
                <div
                  className="h-10 rounded"
                  style={{ backgroundColor: branding.primaryColor }}
                />
                <div
                  className="h-10 rounded"
                  style={{ backgroundColor: branding.secondaryColor }}
                />
              </div>
            </div>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/80 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save White Label Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}

