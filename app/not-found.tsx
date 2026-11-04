import Link from "next/link";
export default function NotFound() {
  return (
    <main className="studio min-h-dvh grid place-items-center p-6 text-center">
      <div>
        <p className="font-script text-5xl text-[var(--s-accent)]">Oh dear</p>
        <h1 className="mt-3 text-xl font-semibold">This page could not be found</h1>
        <p className="mt-2 text-[var(--s-muted)]">If you are a guest, please check the link the couple sent you.</p>
        <Link href="/" className="s-btn s-btn-primary mt-6">Go to homepage</Link>
      </div>
    </main>
  );
}
