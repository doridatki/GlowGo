interface CategoryButtonProps {
  icon: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CategoryButton({ icon, name, active, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[90px] transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-card border border-border hover:border-primary/50'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium whitespace-nowrap">{name}</span>
    </button>
  );
}
