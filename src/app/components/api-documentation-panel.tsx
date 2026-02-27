import { useState } from "react";
import { Code, Key, Webhook, Book, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export function APIDocumentationPanel() {
  const [apiKey, setApiKey] = useState("");
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleGenerateAPIKey = () => {
    const newKey = `sk_${Math.random().toString(36).substr(2, 32)}`;
    setApiKey(newKey);
    toast.success("API key generated! Save it securely.");
  };

  const handleCopy = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/tracks",
      description: "List all tracks",
      example: "curl -H 'Authorization: Bearer YOUR_API_KEY' https://api.syntaxaudio.com/v1/tracks",
    },
    {
      method: "POST",
      path: "/api/v1/tracks",
      description: "Create a new track",
      example: "curl -X POST -H 'Authorization: Bearer YOUR_API_KEY' -d '{\"title\":\"My Track\"}' https://api.syntaxaudio.com/v1/tracks",
    },
    {
      method: "GET",
      path: "/api/v1/mixes",
      description: "List all mixes",
      example: "curl -H 'Authorization: Bearer YOUR_API_KEY' https://api.syntaxaudio.com/v1/mixes",
    },
    {
      method: "POST",
      path: "/api/v1/mixes",
      description: "Create a new mix",
      example: "curl -X POST -H 'Authorization: Bearer YOUR_API_KEY' -d '{\"name\":\"My Mix\"}' https://api.syntaxaudio.com/v1/mixes",
    },
    {
      method: "GET",
      path: "/api/v1/webhooks",
      description: "List webhooks",
      example: "curl -H 'Authorization: Bearer YOUR_API_KEY' https://api.syntaxaudio.com/v1/webhooks",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              API for Third-Party Apps
            </h1>
            <p className="text-xs text-white/40">
              Public API, webhooks, OAuth, and SDK documentation
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* API Key Management */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Key Management
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Your API Key
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={apiKey}
                    readOnly
                    placeholder="Generate an API key to get started"
                    className="bg-white/5 border-white/10 text-white font-['IBM_Plex_Mono']"
                  />
                  {apiKey && (
                    <Button
                      onClick={() => handleCopy(apiKey, "apikey")}
                      size="sm"
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      {copiedEndpoint === "apikey" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
              <Button
                onClick={handleGenerateAPIKey}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Generate New API Key
              </Button>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-400">
                  ⚠️ Keep your API key secure. Never share it publicly or commit it to version control.
                </p>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              API Endpoints
            </h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-['IBM_Plex_Mono'] ${
                            endpoint.method === "GET"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm text-white font-['IBM_Plex_Mono']">
                          {endpoint.path}
                        </code>
                      </div>
                      <p className="text-xs text-white/60 mt-1">{endpoint.description}</p>
                    </div>
                    <Button
                      onClick={() => handleCopy(endpoint.example, `endpoint-${index}`)}
                      size="sm"
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                    >
                      {copiedEndpoint === `endpoint-${index}` ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-3 p-3 bg-black/40 rounded border border-white/10">
                    <code className="text-xs text-white/80 font-['IBM_Plex_Mono'] break-all">
                      {endpoint.example}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Webhook className="w-5 h-5 text-primary" />
              Webhooks
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Webhook URL
                </label>
                <Input
                  placeholder="https://your-app.com/webhook"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                  />
                  <span className="text-sm text-white">Track created</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                  />
                  <span className="text-sm text-white">Mix published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary"
                  />
                  <span className="text-sm text-white">User signed up</span>
                </label>
              </div>
              <Button className="bg-primary hover:bg-primary/80 text-white">
                Save Webhook
              </Button>
            </div>
          </div>

          {/* SDK & Documentation */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              SDK & Documentation
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-left">
                <p className="text-sm font-semibold text-white mb-1">JavaScript SDK</p>
                <p className="text-xs text-white/60">npm install @syntaxaudio/sdk</p>
              </button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-left">
                <p className="text-sm font-semibold text-white mb-1">Python SDK</p>
                <p className="text-xs text-white/60">pip install syntaxaudio</p>
              </button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-left">
                <p className="text-sm font-semibold text-white mb-1">REST API Docs</p>
                <p className="text-xs text-white/60">Full API reference</p>
              </button>
              <button className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-left">
                <p className="text-sm font-semibold text-white mb-1">OAuth Guide</p>
                <p className="text-xs text-white/60">Authentication setup</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

