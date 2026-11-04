"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Invitation } from "@/lib/types";
import { api, getKey } from "@/lib/client";
import Editor from "@/components/studio/Editor";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const r = useRouter();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (!getKey()) { r.replace("/redeem"); return; }
    api<{ invite: Invitation }>(`/api/invites/${id}`)
      .then((d) => setInv(d.invite))
      .catch((e) => (e.status === 401 ? r.replace("/redeem") : setErr(e.message)));
  }, [id, r]);
  if (err) return <div className="studio grid place-items-center p-6"><p className="s-err">{err}</p></div>;
  if (!inv) return <div className="studio grid place-items-center"><p className="text-[var(--muted)]">Loading your invitation…</p></div>;
  return <Editor initial={inv} />;
}
