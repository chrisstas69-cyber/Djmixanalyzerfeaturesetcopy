import React, { useState, useRef } from 'react';

interface Props {
  onFileUpload: (file: File) => void;
  onAnalyzeUrl?: (url: string) => void;
  isAnalyzing: boolean;
}

export default function UploadSection({ onFileUpload, onAnalyzeUrl, isAnalyzing }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('audio') || file.type.includes('video'))) {
      onFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer
          ${isDragging ? 'border-orange-500 bg-orange-500/10 scale-[1.02]' : 'border-white/20 bg-white/[0.02] hover:border-orange-500/50 hover:bg-white/5'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          {isAnalyzing ? (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center mb-6 animate-pulse">
                <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyzing Mix Structure...</h3>
              <p className="text-white/60 text-sm">This may take a few moments</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Drop your DJ mix here</h3>
              <p className="text-white/60 mb-6">or click to browse files</p>
              
              {/* Supported Formats */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                {['MP3', 'WAV', 'FLAC', 'M4A'].map(format => (
                  <span key={format} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-medium">
                    {format}
                  </span>
                ))}
              </div>
              
              <p className="text-white/40 text-xs">Up to 2 hours • Max 500MB</p>
            </>
          )}
        </div>
      </div>

      {/* URL Input */}
      {!isAnalyzing && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">or paste a link</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="SoundCloud, Mixcloud, or YouTube URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
            />
            <button
              onClick={() => {
                const url = urlInput.trim();
                if (url && onAnalyzeUrl) onAnalyzeUrl(url);
              }}
              disabled={!urlInput.trim() || !onAnalyzeUrl}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze
            </button>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center gap-3 px-4">
            <span className="text-white/40 text-xs">Supported:</span>
            {['SoundCloud', 'Mixcloud', 'YouTube'].map(platform => (
              <div key={platform} className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-white/60 text-xs">
                {platform}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
