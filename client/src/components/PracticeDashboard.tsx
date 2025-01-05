const PracticeDashboard: React.FC<PracticeDashboardProps> = ({ practiceData, userId }) => {
    return (
      <div>
        <h1>Practice Dashboard</h1>
        <h2>Practice ID: {practiceData.id}</h2>
        <div>
          {(userId
            ? practiceData.players.filter((playerStat) => playerStat.player._id === userId)
            : practiceData.players
          ).map((playerStat) => (
            <div key={playerStat.player._id}>
              <h3>{playerStat.player.name}</h3>
              <p>Dropped Balls: {playerStat.droppedBalls}</p>
              <p>Completed Passes: {playerStat.completedPasses}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PracticeDashboard;
  