import type { FC } from 'react';
import { Coins } from 'lucide-react';

interface GameHeaderProps {
  currency: number;
}

const GameHeader: FC<GameHeaderProps> = ({ currency }) => {
  return (
    <header className="bg-card/50 backdrop-blur-sm shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-foreground">Harvest Clicker</h1>
        <div className="flex items-center space-x-2 bg-primary/80 text-primary-foreground px-4 py-2 rounded-lg shadow-sm">
          <Coins className="h-6 w-6" />
          <span className="text-xl font-semibold">{currency}</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
