"use client";

export function DeleteButton({
  id,
  deleteAction,
}: {
  id: string;
  deleteAction: (formData: FormData) => void;
}) {
  return (
    <form
      action={deleteAction}
      onSubmit={(event) => {
        if (!confirm("Delete this product? This can't be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>
    </form>
  );
}
