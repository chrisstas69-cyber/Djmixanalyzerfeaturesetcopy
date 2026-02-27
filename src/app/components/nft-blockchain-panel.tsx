import { useState } from "react";
import { Coins, Upload, Download, Link, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface NFTMix {
  id: string;
  mixId: string;
  mixName: string;
  tokenId: string;
  contractAddress: string;
  ipfsHash: string;
  mintedAt: string;
  price: number;
  owner: string;
}

export function NFTBlockchainPanel() {
  const [selectedMix, setSelectedMix] = useState<string | null>(null);
  const [mintingPrice, setMintingPrice] = useState(0.01);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<NFTMix[]>([]);
  const [ipfsHash, setIpfsHash] = useState("");

  const handleMint = async () => {
    if (!selectedMix) {
      toast.error("Please select a mix to mint");
      return;
    }

    setIsMinting(true);
    toast.info("Uploading to IPFS and minting NFT...");

    // Simulate minting process
    setTimeout(() => {
      const mockTokenId = `0x${Math.random().toString(16).substr(2, 8)}`;
      const mockContract = "0x1234567890abcdef1234567890abcdef12345678";
      const mockIpfs = `Qm${Math.random().toString(36).substr(2, 44)}`;

      const newNFT: NFTMix = {
        id: `nft-${Date.now()}`,
        mixId: selectedMix,
        mixName: `Mix ${selectedMix}`,
        tokenId: mockTokenId,
        contractAddress: mockContract,
        ipfsHash: mockIpfs,
        mintedAt: new Date().toISOString(),
        price: mintingPrice,
        owner: "Your Wallet",
      };

      setMintedNFTs([...mintedNFTs, newNFT]);
      setIsMinting(false);
      toast.success("NFT minted successfully!");
    }, 3000);
  };

  const handleUploadToIPFS = async () => {
    toast.info("Uploading mix metadata to IPFS...");
    setTimeout(() => {
      const mockHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      setIpfsHash(mockHash);
      toast.success(`Uploaded! IPFS Hash: ${mockHash}`);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
              NFT & Blockchain Integration
            </h1>
            <p className="text-xs text-white/40">
              Mint your mixes as NFTs on the blockchain
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mint NFT */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              Mint Mix as NFT
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Select Mix
                </label>
                <select
                  value={selectedMix || ""}
                  onChange={(e) => setSelectedMix(e.target.value || null)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="">Choose a mix...</option>
                  <option value="mix-1">My First Mix</option>
                  <option value="mix-2">Summer Vibes</option>
                  <option value="mix-3">Deep House Session</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Minting Price (ETH)
                </label>
                <Input
                  type="number"
                  value={mintingPrice}
                  onChange={(e) => setMintingPrice(Number(e.target.value))}
                  min="0"
                  step="0.001"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-white/60 mb-1">IPFS Hash</p>
                {ipfsHash ? (
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-primary font-['IBM_Plex_Mono']">{ipfsHash}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(ipfsHash)}
                      className="p-1 text-white/60 hover:text-white"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-white/40">Not uploaded yet</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleUploadToIPFS}
                  variant="outline"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to IPFS
                </Button>
                <Button
                  onClick={handleMint}
                  disabled={isMinting || !selectedMix || !ipfsHash}
                  className="flex-1 bg-primary hover:bg-primary/80 text-white"
                >
                  {isMinting ? (
                    "Minting..."
                  ) : (
                    <>
                      <Coins className="w-4 h-4 mr-2" />
                      Mint NFT
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Minted NFTs */}
          {mintedNFTs.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Minted NFTs</h2>
              <div className="space-y-3">
                {mintedNFTs.map((nft) => (
                  <div
                    key={nft.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <h3 className="text-sm font-semibold text-white">{nft.mixName}</h3>
                        </div>
                        <div className="space-y-1 text-xs text-white/60 font-['IBM_Plex_Mono']">
                          <p>Token ID: {nft.tokenId}</p>
                          <p>Contract: {nft.contractAddress.slice(0, 10)}...</p>
                          <p>IPFS: {nft.ipfsHash.slice(0, 20)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary font-['IBM_Plex_Mono']">
                          {nft.price} ETH
                        </p>
                        <p className="text-xs text-white/40">
                          {new Date(nft.mintedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
                      >
                        <Link className="w-3.5 h-3.5 mr-1.5" />
                        View on Explorer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download Metadata
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-2">About NFT Minting</h3>
            <p className="text-xs text-white/60 mb-2">
              Mint your mixes as NFTs to create unique, verifiable digital collectibles. Each NFT
              includes:
            </p>
            <ul className="text-xs text-white/60 space-y-1 list-disc list-inside">
              <li>Mix metadata stored on IPFS (InterPlanetary File System)</li>
              <li>Smart contract on Ethereum blockchain</li>
              <li>Unique token ID and ownership record</li>
              <li>Royalty settings for future sales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

