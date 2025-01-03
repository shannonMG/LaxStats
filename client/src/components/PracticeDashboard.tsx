import PlayerCard from "./PlayerCard";

const PracticeDashboard: React.FC<PracticeDashboardProps> = ({ practiceData }) => {
    return (
        <div>
            <h1>Practice Dashboard</h1>
            <h2>Practice ID: {practiceData.id}</h2>
            <div>
                {/* Map through the players and render a PlayerCard for each */}
                {practiceData.players.map((playerStat) => (
                    <PlayerCard
                        key={playerStat.player._id} // Use the player ID as the key
                        playerId={playerStat.player._id} // Pass the player ID
                        playerName={playerStat.player.name} // Pass the player name
                        practiceId={practiceData.id} // Pass the practice ID
                        stats={{
                            droppedBalls: playerStat.droppedBalls, // Pass the initial droppedBalls count
                            completedPasses: playerStat.completedPasses, // Pass the initial completedPasses count
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PracticeDashboard;