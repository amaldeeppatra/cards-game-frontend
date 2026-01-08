"use client";

export default function BiddingPanel({
    onBid,
    disabled
}: {
    onBid: (bid: number) => void;
    disabled: boolean;
}) {
    return (
        <div className="bg-slate-800 p-4 rounded-xl text-center">
            <h2 className="text-lg font-semibold mb-3">Place Your Bid</h2>

            <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <button
                        key={n}
                        disabled={disabled}
                        onClick={() => onBid(n)}
                        className={`p-2 rounded-lg font-bold transition
              ${disabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-white text-black hover:bg-yellow-300"}
            `}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
}