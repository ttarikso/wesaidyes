import type { Invitation } from "@/lib/types";
import { getTheme, themeAssets, themeVars } from "@/lib/themes";
import { dateParts } from "@/lib/format";

/* What a guest sees once the invitation has ended: the couple's names on their own paper, and a short thank-you. */
export default function InvitationEnded({ inv }: { inv: Invitation }) {
  const t = getTheme(inv.theme);
  const a = themeAssets(t);
  const d = inv.data;
  const dp = dateParts(d.date);
  return (
    <div className="inv stage-open" data-theme={t.id} style={themeVars(t, inv.data.headingFont)}>
      <main className="iv-ended g-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="iv-ended-floral" src={a.floral} alt="" />
        <p className="iv-ended-names">{d.partner1} <span className="amp">&amp;</span> {d.partner2}</p>
        {dp && <p className="iv-ended-date">{dp.long}</p>}
        <p className="iv-ended-note">This invitation has ended. Thank you for celebrating with us.</p>
      </main>
    </div>
  );
}
