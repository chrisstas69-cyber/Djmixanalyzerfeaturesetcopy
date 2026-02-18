import React from "react";
import TrackCard from "./TrackCard";
import type { Track } from "@/data/mockTracksWithDNA";

export interface TrackListProps {
  tracks: Track[];
  onPlay?: (track: Track) => void;
  onFavorite?: (track: Track) => void;
  onMore?: (track: Track) => void;
  onShowDetail?: (track: Track) => void;
  /** Grid layout: default is grid. Set to 'list' for inline badge in metadata row. */
  variant?: "grid" | "list";
}

export function TrackList({
  tracks,
  onPlay,
  onFavorite,
  onMore,
  onShowDetail,
  variant = "grid",
}: TrackListProps) {
  return (
    <div
      className={
        variant === "list"
          ? "flex flex-col gap-3"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      }
    >
      {tracks.map((track) => {
        const { key: musicalKey, ...rest } = track;
        return (
          <TrackCard
            key={track.id}
            {...rest}
            musicalKey={musicalKey}
            onPlay={onPlay ? () => onPlay(track) : undefined}
            onFavorite={onFavorite ? () => onFavorite(track) : undefined}
            onMore={onMore ? () => onMore(track) : undefined}
            onShowDetail={onShowDetail ? () => onShowDetail(track) : undefined}
          />
        );
      })}
    </div>
  );
}

export default TrackList;
