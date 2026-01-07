import { Suspense, lazy } from "react";
import { GameProvider, useGame } from "./context/GameContext";

// Lazy load pages for better initial bundle size
const MainMenu = lazy(() =>
  import("./pages/MainMenu").then((module) => ({ default: module.MainMenu }))
);
const GameScreen = lazy(() =>
  import("./pages/GameScreen").then((module) => ({
    default: module.GameScreen,
  }))
);
const ResultsScreen = lazy(() =>
  import("./pages/ResultsScreen").then((module) => ({
    default: module.ResultsScreen,
  }))
);

// Simple loading spinner
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const GameRouter = () => {
  const { isPlaying, isFinished } = useGame();

  if (isFinished) {
    return <ResultsScreen />;
  }

  if (isPlaying) {
    return <GameScreen />;
  }

  return <MainMenu />;
};

function App() {
  return (
    <GameProvider>
      <Suspense fallback={<Loading />}>
        <GameRouter />
      </Suspense>
    </GameProvider>
  );
}

export default App;
