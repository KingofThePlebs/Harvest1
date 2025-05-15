import type { FC } from 'react';
import { Coins, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  currency: number;
}

const GameHeader: FC<GameHeaderProps> = ({ currency }) => {
  return (
    <header className="bg-card/50 backdrop-blur-sm shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-primary-foreground">Harvest Clicker</h1>
          <a
            href="https://aloneneitt.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support the developer on itch.io"
          >
            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground group shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Heart className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:animate-pulse" />
              Support Me
            </Button>
          </a>
        </div>
        <div className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-sm">
          <Coins className="h-6 w-6" />
          <span className="text-xl font-semibold">{currency}</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
