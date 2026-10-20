/**
 * Templates remount on every navigation, so this curtain plays each time
 * you move between pages — the same page-to-page wipe the reference site uses.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="curtain" aria-hidden="true" />
      <main id="main-content" className="page">
        {children}
      </main>
    </>
  );
}
