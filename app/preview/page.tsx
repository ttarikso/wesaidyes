"use client";
import { useEffect, useState } from "react";
import Invitation from "@/components/Invitation";
import type { InviteData } from "@/lib/types";

/* Rendered inside the studio's phone/desktop frame. The studio posts the draft here. */
type Msg = { type: "invite-preview"; data: InviteData; theme: string; music: string; slug: string; skip: boolean; nonce: number };

export default function Preview() {
  const [m, setM] = useState<Msg | null>(null);
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== "invite-preview") return;
      setM(e.data as Msg);
    };
    window.addEventListener("message", on);
    window.parent?.postMessage({ type: "preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", on);
  }, []);
  if (!m) return <div style={{ minHeight: "100dvh", background: "#f4efe6" }} />;
  return <Invitation key={m.nonce} data={m.data} theme={m.theme} music={m.music} slug={m.slug} mode="preview" startOpen={m.skip} />;
}
