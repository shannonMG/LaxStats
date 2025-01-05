

const PracticeDashboard: React.FC<PracticeDashboardProps> = ({ practiceData, userId }) => {
    return (
      <div>
        <h1>Practice Dashboard</h1>
        {practiceData.map((practice) => {
          const playerStats = practice.players.find(
            (playerStat) => playerStat.player.id === userId
          );
  
          if (!playerStats) return null;
  
          return (
            <div key={practice.id}>
              <h2>Practice Date: {new Date(practice.date).toLocaleDateString()}</h2>
              <h3>Player: {playerStats.player.name}</h3>
              <p>Dropped Balls: {playerStats.droppedBalls}</p>
              <p>Completed Passes: {playerStats.completedPasses}</p>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default PracticeDashboard;