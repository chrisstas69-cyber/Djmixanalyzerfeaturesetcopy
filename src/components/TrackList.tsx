import React from "react";
import TrackCard from "./TrackCard";
import type { Track } from "@/data/mockTracksWithDNA";

export interface TrackListProps {
  tracks: Track[];
  onPlay?: (track: Track) => void;
  onFavorite?: (track: Track) => void;
  onMore?: (track: Track) => void;
  onShowDetail?: (track: Track) => void;
  /** Called when user edits title on a card. */
  onTitleChange?: (trackId: string, value: string) => void;
  /** Called when user edits artist on a card. */
  onArtistChange?: (trackId: string, value: string) => void;
  /** Grid layout: default is grid. Set to 'list' for inline badge in metadata row. */
  variant?: "grid" | "list";
  /** When set, the track with this id shows as playing (waveform + overlay). */
  playingTrackId?: string | null;
}

export function TrackList({
  tracks,
  onPlay,
  onFavorite,
  onMore,
  onShowDetail,
  onTitleChange,
  onArtistChange,
  variant = "grid",
  playingTrackId = null,
}: TrackListProps) {
  return (
    <div
      className={
        variant === "list"
          ? "flex flex-col gap-3"
          : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      }
    >
      {tracks.map((track) => {
        const { key: musicalKey, ...rest } = track;
        return (
          <TrackCard
            key={track.id}
            {...rest}
            musicalKey={musicalKey}
            isPlaying={playingTrackId === track.id}
            onPlay={onPlay ? () => onPlay(track) : undefined}
            onFavorite={onFavorite ? () => onFavorite(track) : undefined}
            onMore={onMore ? () => onMore(track) : undefined}
            onShowDetail={onShowDetail ? () => onShowDetail(track) : undefined}
            onTitleChange={onTitleChange ? (value) => onTitleChange(track.id, value) : undefined}
            onArtistChange={onArtistChange ? (value) => onArtistChange(track.id, value) : undefined}
          />
        );
      })}
    </div>
  );
}

export default TrackList;
