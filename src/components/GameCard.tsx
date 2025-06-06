interface GameCardProps {
  title: string;
  icon: string;
  color: string;
  onClick: () => void;
}

export function GameCard({ title, icon, color, onClick }: GameCardProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`game-card ${color} w-full h-48 flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105`}
      aria-label={`Play ${title} game`}
    >
      <div className="text-6xl">{icon}</div>
      <h3 className="text-2xl font-display font-bold text-gray-800">{title}</h3>
    </button>
  );
}
