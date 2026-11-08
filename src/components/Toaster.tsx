import { useToasts } from '../lib/site';

/** Short confirmations ('Konami accepted…'). A polite live region; each toast clears itself. */
export default function Toaster() {
  const toasts = useToasts();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <p key={t.id} className="toast">
          {t.text}
        </p>
      ))}
    </div>
  );
}
