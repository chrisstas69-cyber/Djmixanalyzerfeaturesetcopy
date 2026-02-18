// src/app/dna-tracks/page.tsx
'use client';

import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { TrackList } from '@/components/TrackList';
import { TrackDetailView } from '@/components/TrackDetailView';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { getSampleTracksWithDNA, type Track } from '@/data/mockTracksWithDNA';

export default function DNATracksPage() {
  const [tracks] = useState(() => getSampleTracksWithDNA());
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  return (
    <div className="p-8">
      <h1 className="text-2xl text-white mb-6">DNA Tracks</h1>
      <button className="mb-6 px-4 py-2 bg-cyan-500 text-black rounded flex items-center gap-2">
        <Upload size={16} /> Upload Audio
      </button>
      <TrackList
        tracks={tracks}
        onPlay={(track) => alert(`Playing: ${track.title}`)}
        onFavorite={() => {}}
        onMore={() => {}}
        onShowDetail={setSelectedTrack}
      />
      <Sheet
        open={!!selectedTrack}
        onOpenChange={(open) => {
          if (!open) setSelectedTrack(null);
        }}
      >
        <SheetContent
          side="right"
          className="bg-[var(--bg-0)] border-white/10 text-white"
        >
          <SheetHeader>
            <SheetTitle className="text-white">Track details</SheetTitle>
          </SheetHeader>
          {selectedTrack && (
            <TrackDetailView
              track={selectedTrack}
              onGenerateMore={() => {
                setSelectedTrack(null);
                // Could navigate to create-track with preset pre-selected
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
