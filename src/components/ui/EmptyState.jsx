// Shared empty-state block. Used wherever a list might be empty.
import { Link } from "react-router-dom";

export default function EmptyState({ title = "Nothing here yet.", message, actionLabel, actionTo, onAction }) {
  return (
    <div className="text-center py-20 px-4">
      <h3 className="uppercase tracking-widest text-xs font-medium text-stone-800">{title}</h3>
      {message && <p className="mt-2 text-[12px] text-gray-400 max-w-md mx-auto">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-block mt-4 text-[11px] tracking-widest uppercase font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-600"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="block mx-auto mt-4 text-[11px] tracking-widest uppercase font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}