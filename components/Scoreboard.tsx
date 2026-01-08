"use client";

export default function Scoreboard({
  score,
  bids,
  tricks,
  phase
}: {
  score: { A: number; B: number };
  bids: {
    A: Record<string, number>;
    B: Record<string, number>;
  };
  tricks: { A: number; B: number };
  phase: string;
}) {
  return (
    <div className="bg-black/60 text-white p-3 rounded-xl text-sm w-64">
      <h2 className="font-bold text-center mb-2">Game Status</h2>

      <div className="mb-2">
        <span className="text-gray-300">Phase:</span>{" "}
        <span className="font-semibold">{phase}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="font-semibold">Team A</p>
          <p>Score: {score.A}</p>
          <p>
            Bid: {Object.values(bids.A).reduce((a, b) => a + b, 0)}
          </p>
          <p>Tricks: {tricks.A}</p>
        </div>

        <div>
          <p className="font-semibold">Team B</p>
          <p>Score: {score.B}</p>
          <p>
            Bid: {Object.values(bids.B).reduce((a, b) => a + b, 0)}
          </p>
          <p>Tricks: {tricks.B}</p>
        </div>
      </div>
    </div>
  );
}