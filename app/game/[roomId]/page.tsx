"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import BiddingPanel from "@/components/BiddingPanel";
import Card from "@/components/Card";
import Scoreboard from "@/components/Scoreboard";
import { getPlayerId } from "@/lib/player";
import { getPlayerName } from "@/lib/playerName";

export default function GamePage({ params }: any) {
    const { roomId } = useParams<{ roomId: string }>();
    const socket = getSocket();

    const [hand, setHand] = useState<string[]>([]);
    const [trump, setTrump] = useState<string | null>(null);
    const [currentTurn, setCurrentTurn] = useState<string | null>(null);
    const [socketId, setSocketId] = useState<string>("");
    const [phase, setPhase] = useState<string>("WAITING");
    const [bids, setBids] = useState<{
        A: Record<string, number>;
        B: Record<string, number>;
    }>({
        A: {},
        B: {}
    });
    const [score, setScore] = useState<{ A: number; B: number }>({ A: 0, B: 0 });
    const [tricksWon, setTricksWon] = useState<{ A: number; B: number }>({ A: 0, B: 0 });
    const [currentTrick, setCurrentTrick] = useState<
        { playerId: string; card: string }[]
    >([]);
    const [players, setPlayers] = useState<string[]>([]);
    const [playerId, setPlayerId] = useState<string>("");
    const [playerNames, setPlayerNames] = useState<Record<string, string>>({});
    const [teams, setTeams] = useState<{ A: string[]; B: string[] }>({ A: [], B: [] });


    useEffect(() => {
        const id = getPlayerId();
        const name = getPlayerName();
        if (!id || !name) return;

        setPlayerId(id);

        socket.emit("JOIN_ROOM", {
            roomId,
            playerId: id,
            name
        });

        const handler = (data: any) => {
            if ("hand" in data) setHand(data.hand);
            if ("trump" in data) setTrump(data.trump);
            if ("phase" in data) setPhase(data.phase);
            if ("currentTurn" in data) setCurrentTurn(data.currentTurn);
            if ("currentTrick" in data) setCurrentTrick(data.currentTrick);
            if ("players" in data) setPlayers(data.players);
            if ("bids" in data) setBids(data.bids);
            if ("score" in data) setScore(data.score);
            if ("tricksWon" in data) setTricksWon(data.tricksWon);
            if ("playerNames" in data) setPlayerNames(data.playerNames);
            if ("teams" in data) setTeams(data.teams);
        };

        socket.on("STATE_UPDATE", handler);

        return () => {
            socket.off("STATE_UPDATE", handler);
        };
    }, [roomId]);

    const playCard = (card: string) => {
        socket.emit("PLAY_CARD", { roomId, card });
    };

    const placeBid = (bid: number) => {
        socket.emit("BID", { roomId, bid });
    };

    const myIndex = players.indexOf(playerId);

    const getRelativePos = (i: number) => {
        const diff = (i - myIndex + 4) % 4;
        return ["bottom", "right", "top", "left"][diff];
    };

    const isTeamA = players.length === 4 && (
        players[0] === playerId || players[2] === playerId
    );
    const myTeam: "A" | "B" = isTeamA ? "A" : "B";
    const alreadyBid = Boolean(bids[myTeam]?.[playerId]);

    return (
        <div className="relative min-h-screen bg-green-800 text-white">
            {/* PHASE BANNER */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-xl text-sm font-semibold">
                Phase: {phase}
            </div>

            {/* TRUMP DISPLAY */}
            <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded">
                Trump: {trump ?? "?"}
            </div>

            {/* TOP PLAYER */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
                <div className="text-sm text-center mb-1">Opponent</div>
                <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-10 h-14 bg-gray-700 rounded" />
                    ))}
                </div>
            </div>

            {/* LEFT PLAYER */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-10 h-14 bg-gray-700 rounded mb-1" />
                ))}
            </div>

            {/* RIGHT PLAYER */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-10 h-14 bg-gray-700 rounded mb-1" />
                ))}
            </div>

            {/* YOUR HAND (BOTTOM) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                {/* PLAYER NAME */}
                <div className="text-sm font-semibold bg-black/60 px-3 py-1 rounded-full">
                    {playerNames[playerId] ?? "You"} <span className="text-yellow-300">(You)</span>
                </div>
                {/* CARDS */}
                <div className="flex gap-2">
                    {hand.map(card => (
                        <Card
                            key={card}
                            value={card}
                            disabled={phase !== "PLAYING" || currentTurn !== playerId}
                            onClick={() => playCard(card)}
                        />
                    ))}
                </div>
            </div>

            {/* CENTER TRICK DISPLAY */}
            {currentTrick.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex gap-4">
                        {currentTrick.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white text-black w-14 h-20 rounded-lg flex items-center justify-center font-bold"
                            >
                                <img
                                    // src={`/cards/${t.card}.svg`}
                                    src={`/cards/${t.card}.png`}
                                    className="w-20 h-auto rounded-lg shadow-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SCOREBOARD */}
            <div className="absolute top-4 right-4">
                <Scoreboard
                    score={score}
                    bids={bids}
                    tricks={tricksWon}
                    phase={phase}
                />
            </div>

            {phase === "TRUMP" && (
                <button
                    onClick={() =>
                        socket.emit("CUT_DECK", {
                            roomId,
                            index: Math.floor(Math.random() * 32)
                        })
                    }
                    className="absolute top-20 left-4 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
                >
                    Cut Deck
                </button>
            )}

            {phase === "TRUMP" && (
                <button
                    onClick={() =>
                        socket.emit("DEAL_CARDS", { roomId })
                    }
                    className="absolute top-32 left-4 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-300"
                >
                    Deal Cards
                </button>
            )}

            {/* BIDDING PANEL */}
            {phase === "BIDDING" && (
                <div className="absolute bottom-40 left-1/2 -translate-x-1/2">
                    <BiddingPanel
                        onBid={placeBid}
                        disabled={alreadyBid}
                    />
                    <div className="mt-2 text-center text-sm text-gray-200">
                        <p>
                            Team A Total Bid:{" "}
                            {Object.values(bids.A || {}).reduce((a, b) => a + b, 0)}
                        </p>
                        <p>
                            Team B Total Bid:{" "}
                            {Object.values(bids.B || {}).reduce((a, b) => a + b, 0)}
                        </p>
                    </div>
                </div>
            )}

            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-lg text-sm">
                <div className="mb-1 font-semibold text-center">Teams</div>

                <div className="flex gap-6">
                    <div>
                        <p className="font-bold text-yellow-300">Team A</p>
                        {teams.A.map(pid => (
                            <p key={pid}>{playerNames[pid]}</p>
                        ))}
                    </div>

                    <div>
                        <p className="font-bold text-cyan-300">Team B</p>
                        {teams.B.map(pid => (
                            <p key={pid}>{playerNames[pid]}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}