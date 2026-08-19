"use client";

import { useState } from "react";
import { PawPrint, Repeat2, Handshake } from "lucide-react";
import {
  apiToggleInteraction,
  apiRepostPetPost,
  apiCreatePetConnection,
  ApiError,
  CommunityPost,
} from "@/lib/api";
import type { ConnectionState } from "@/lib/connectionState";

interface Props {
  post: CommunityPost;
  accessToken: string;
  selectedPetId: string;
  connectionState: ConnectionState;
  onPostUpdate: (postId: string, patch: Partial<CommunityPost>) => void;
  onRepostCreated: (newPost: CommunityPost) => void;
  onConnectionRequested: (receiverPetId: string) => void;
}

export default function PawMomentActions({
  post,
  accessToken,
  selectedPetId,
  connectionState,
  onPostUpdate,
  onRepostCreated,
  onConnectionRequested,
}: Props) {
  const [pawBusy, setPawBusy] = useState(false);
  const [repostBusy, setRepostBusy] = useState(false);
  const [connectBusy, setConnectBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePaw() {
    if (pawBusy) return;
    setPawBusy(true);
    setError(null);
    const prevPawed = post.pawedByMe;
    const prevCount = post.pawCount;
    onPostUpdate(post.id, { pawedByMe: !prevPawed, pawCount: prevCount + (prevPawed ? -1 : 1) });
    try {
      await apiToggleInteraction(accessToken, selectedPetId, post.id, "PAW");
    } catch (err) {
      onPostUpdate(post.id, { pawedByMe: prevPawed, pawCount: prevCount });
      setError("Couldn't update Paw — try again");
      if (!(err instanceof ApiError)) console.error(err);
    } finally {
      setPawBusy(false);
    }
  }

  async function handleRepost() {
    if (repostBusy) return;
    setRepostBusy(true);
    setError(null);
    try {
      const created = await apiRepostPetPost(accessToken, selectedPetId, post.id);
      onPostUpdate(post.id, { repostCount: post.repostCount + 1 });
      onRepostCreated(created);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("Already Pawed this forward");
      } else {
        setError("Couldn't Paw it forward — try again");
        if (!(err instanceof ApiError)) console.error(err);
      }
    } finally {
      setRepostBusy(false);
    }
  }

  async function handleConnect() {
    if (connectBusy || connectionState !== "none") return;
    setConnectBusy(true);
    setError(null);
    try {
      await apiCreatePetConnection(accessToken, selectedPetId, post.pet.id);
      onConnectionRequested(post.pet.id);
    } catch (err) {
      setError("Couldn't send connection request");
      if (!(err instanceof ApiError)) console.error(err);
    } finally {
      setConnectBusy(false);
    }
  }

  const connectLabel =
    connectionState === "connected" ? "Paw Pal" : connectionState === "pending" ? "Requested" : "Connect";

  const showConnect = connectionState !== "self";
  const cols = showConnect ? "grid-cols-3" : "grid-cols-2";

  return (
    <div>
      <div className={`grid ${cols} divide-x divide-cream-200 border-t border-cream-200`}>
        <button
          type="button"
          onClick={handlePaw}
          disabled={pawBusy}
          className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-700 transition disabled:opacity-50 ${
            post.pawedByMe ? "text-coral-600" : "text-coral-500 hover:bg-coral-500/5"
          }`}
        >
          <PawPrint className="h-4 w-4" fill={post.pawedByMe ? "currentColor" : "none"} />
          {post.pawedByMe ? "Pawed" : "Paw"}
        </button>
        <button
          type="button"
          onClick={handleRepost}
          disabled={repostBusy}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-700 text-amber-600 transition hover:bg-amber-500/5 disabled:opacity-50"
        >
          <Repeat2 className="h-4 w-4" />
          Paw It Forward{post.repostCount > 0 ? ` · ${post.repostCount}` : ""}
        </button>
        {showConnect && (
          <button
            type="button"
            onClick={handleConnect}
            disabled={connectBusy || connectionState !== "none"}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-700 text-forest-600 transition hover:bg-forest-500/5 disabled:opacity-50"
          >
            <Handshake className="h-4 w-4" />
            {connectLabel}
          </button>
        )}
      </div>
      {error && <p className="px-4 pb-2 pt-1 text-[11px] text-coral-500">{error}</p>}
    </div>
  );
}
