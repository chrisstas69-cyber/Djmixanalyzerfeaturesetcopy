// src/app/dna-tracks/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import TrackCard from '@/components/TrackCard';
import { Upload } from 'lucide-react';

const generateFakeTracks = () => {
  const genres = ['Techno', 'House', 'Trance', 'Deep Tech'];
  const artists = ['Underground Artist', 'Berlin DJ', 'AI Mix'];
  return Array.from({ length: 30 }, (_, i) => ({
    id: `${i}`,
    title: `Track ${i + 1}`,
    artist: artists[i % artists.length],
    bpm: 120 + i % 20,
    key: 'Am',
    duration: '6:30',
    energy: 5 + (i % 5),
    genre: genres[i % genres.length],
    artwork: null,
    isFavorite: false,
    createdAt: new Date().toLocaleDateString(),
  }));
};

const DNAUnified = () => {
  const [tracks] = useState(() => generateFakeTracks());

  return (
    <div className="p-8">
      <h1 className="text-2xl text-white mb-6">DNA Tracks</h1>
      <button className="mb-6 px-4 py-2 bg-cyan-500 text-black rounded flex items-center gap-2">
        <Upload size={16} /> Upload Audio
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            {...track}
            onPlay={() => alert(`Playing: ${track.title}`)}
            onFavorite={() => console.log('Fav')}
            onMore={() => console.log('More')}
          />
        ))}
      </div>
    </div>
  );
};

export default DNAUnified;