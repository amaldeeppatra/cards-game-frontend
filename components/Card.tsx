"use client";

export default function Card({
  value,
  onClick,
  disabled = false
}: {
  value: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const imgSrc = `/cards/${value}.png`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`transition transform ${
        disabled ? "opacity-60" : "hover:-translate-y-2"
      }`}
    >
      <img
        src={imgSrc}
        alt={value}
        className="w-20 h-auto rounded-lg shadow-lg"
      />
    </button>
  );
}