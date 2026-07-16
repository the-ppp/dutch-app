type SettingsButtonProps = {
  onClick: () => void
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Practice settings"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-track text-sm text-muted transition"
    >
      <span aria-hidden="true">⚙️</span>
    </button>
  )
}
