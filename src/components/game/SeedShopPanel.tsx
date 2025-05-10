
import type { FC } from 'react';
import Image from 'next/image';
import { CROPS_DATA } from '@/config/crops';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, ShoppingCart } from 'lucide-react';

interface SeedShopPanelProps {
  onBuySeed: (cropId: string) => void;
  currency: number;
  getEffectiveCropSeedPrice: (basePrice: number) => number;
}

const SeedShopPanel: FC<SeedShopPanelProps> = ({ onBuySeed, currency, getEffectiveCropSeedPrice }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground/80 flex items-center gap-2"><ShoppingCart className="w-6 h-6" />Seed Shop</CardTitle>
        <CardDescription>Purchase seeds to plant on your farm. Purchased seeds will appear in "My Seeds".</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto p-4">
        {CROPS_DATA.map((crop) => {
          const IconComponent = crop.icon;
          const effectiveSeedPrice = getEffectiveCropSeedPrice(crop.seedPrice);
          const canAfford = currency >= effectiveSeedPrice;
          return (
            <div
              key={crop.id}
              className={`flex items-center justify-between p-3 rounded-md shadow-sm bg-secondary/20 hover:bg-secondary/40 transition-all duration-200 ${!canAfford ? 'opacity-60' : ''}`}
              title={!canAfford ? `Not enough gold (need ${effectiveSeedPrice})` : `Buy ${crop.name} seed`}
            >
              <div className="flex items-center space-x-3 flex-grow">
                {IconComponent ? (
                  <IconComponent className="w-8 h-8 text-green-600 flex-shrink-0" />
                ) : crop.imageUrl ? (
                  <Image 
                    src={crop.imageUrl} 
                    alt={crop.name} 
                    width={32} 
                    height={32} 
                    className="object-contain rounded-md flex-shrink-0"
                    data-ai-hint={crop.dataAiHint}
                  />
                ) : null}
                <div className="flex-grow text-left">
                  <p className="font-semibold">{crop.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Grows in: {crop.growTime / 1000}s | Sells for: <Coins className="inline w-3 h-3 mr-0.5" />{crop.sellPrice}
                  </p>
                </div>
              </div>
              <Button
                  variant="outline"
                  size="sm"
                  className="h-auto py-1 px-3 text-xs"
                  onClick={() => onBuySeed(crop.id)}
                  disabled={!canAfford}
                >
                  Buy <Coins className="inline w-3 h-3 ml-1 mr-0.5" />{effectiveSeedPrice}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SeedShopPanel;

    