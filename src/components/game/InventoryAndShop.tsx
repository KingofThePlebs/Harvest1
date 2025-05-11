
import type { FC } from 'react';
import Image from 'next/image';
import type { InventoryItem, Crop, UpgradeDefinition, UpgradesState, UpgradeId, LeaderboardEntry } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Package, Coins, TrendingUp, CheckCircle, Sprout, Handshake, Building, Leaf, Trophy } from 'lucide-react';

interface InventoryAndShopProps {
  harvestedInventory: InventoryItem[];
  ownedSeeds: InventoryItem[];
  onSellCrop: (cropId: string, quantity: number) => void;
  onSelectSeedForPlanting: (seedId: string) => void;
  selectedSeedId?: string;
  currency: number;
  upgradesData: UpgradeDefinition[];
  purchasedUpgrades: UpgradesState;
  onBuyUpgrade: (upgradeId: UpgradeId) => void;
  getEffectiveCropSellPrice: (basePrice: number) => number;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  leaderboardData: LeaderboardEntry[];
}

const InventoryAndShop: FC<InventoryAndShopProps> = ({ 
  harvestedInventory, 
  ownedSeeds,
  onSellCrop, 
  onSelectSeedForPlanting,
  selectedSeedId,
  currency, 
  upgradesData, 
  purchasedUpgrades, 
  onBuyUpgrade,
  getEffectiveCropSellPrice,
  playerName,
  onPlayerNameChange,
  leaderboardData,
}) => {
  const getCropById = (cropId: string): Crop | undefined => CROPS_DATA.find(c => c.id === cropId);

  return (
    <Card className="shadow-lg">
      <Tabs defaultValue="mySeeds" className="w-full">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-5"> {/* Changed to 5 cols */}
            <TabsTrigger value="mySeeds" className="flex items-center gap-2"><Sprout className="w-4 h-4" />My Seeds</TabsTrigger>
            <TabsTrigger value="sellMarket" className="flex items-center gap-2"><Handshake className="w-4 h-4" />Sell Market</TabsTrigger>
            <TabsTrigger value="upgrades" className="flex items-center gap-2"><TrendingUp className="w-4 h-4" />Upgrades</TabsTrigger>
            <TabsTrigger value="town" className="flex items-center gap-2"><Building className="w-4 h-4" />Town</TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2"><Trophy className="w-4 h-4" />Leaderboard</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="mySeeds">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Your Seed Inventory</CardTitle>
            <CardDescription>Select a seed from your inventory to plant on an empty plot.</CardDescription>
            {ownedSeeds.length === 0 ? (
              <p className="text-muted-foreground">Your seed inventory is empty. Buy some seeds from the Seed Shop!</p>
            ) : (
              <ul className="space-y-3">
                {ownedSeeds.map(item => {
                  const crop = getCropById(item.cropId);
                  if (!crop) return null;
                  const IconComponent = crop.icon;
                  const isSelected = selectedSeedId === item.cropId;
                  return (
                    <li key={item.cropId} 
                        className={`flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm transition-all duration-200
                                    ${isSelected ? 'ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {crop.seedShopImageUrl ? (
                          <Image 
                            src={crop.seedShopImageUrl} 
                            alt={crop.name} 
                            width={32} 
                            height={32} 
                            className="object-contain rounded-md" 
                            data-ai-hint={crop.dataAiHintSeedShop || crop.dataAiHint} 
                          />
                        ) : IconComponent ? (
                          <IconComponent className="w-8 h-8 text-green-600" />
                        ) : <Leaf className="w-8 h-8 text-gray-400" />}
                        <div>
                          <p className="font-semibold">{crop.name}</p>
                          <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onSelectSeedForPlanting(item.cropId)} 
                        disabled={item.quantity <= 0}
                        variant={isSelected ? "default" : "outline"}
                        className="text-xs h-8"
                      >
                        {isSelected ? <CheckCircle className="w-4 h-4 mr-1" /> : null}
                        {isSelected ? 'Selected' : 'Select'}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="sellMarket">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Sell Harvested Crops</CardTitle>
            <CardDescription>Sell your harvested crops for gold.</CardDescription>
             <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                <Coins className="h-5 w-5 text-primary" />
                <span>Your Gold: {currency}</span>
            </div>
            {harvestedInventory.length === 0 ? (
              <p className="text-muted-foreground">Nothing to sell. Harvest some crops first!</p>
            ) : (
              <ul className="space-y-3">
                {harvestedInventory.map(item => {
                  const crop = getCropById(item.cropId);
                  if (!crop) return null;
                  const IconComponent = crop.icon;
                  const effectiveSellPrice = getEffectiveCropSellPrice(crop.sellPrice);
                  return (
                    <li key={item.cropId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm">
                      <div className="flex items-center space-x-3">
                        {crop.harvestedCropImageUrl ? ( 
                          <Image 
                            src={crop.harvestedCropImageUrl} 
                            alt={crop.name} 
                            width={32} 
                            height={32} 
                            className="object-contain rounded-md" 
                            data-ai-hint={crop.dataAiHintHarvestedCrop || crop.dataAiHint}
                          />
                        ) : IconComponent ? (
                          <IconComponent className="w-8 h-8 text-green-600" />
                        ) : <Leaf className="w-8 h-8 text-gray-400" />}
                        <div>
                          <p className="font-semibold">{crop.name} <span className="text-xs text-muted-foreground">(Qty: {item.quantity})</span></p>
                          <p className="text-xs text-muted-foreground">Sell Price: <Coins className="inline w-3 h-3 mr-0.5" />{effectiveSellPrice} each</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => onSellCrop(item.cropId, 1)} className="text-xs h-8">
                        Sell 1
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="upgrades">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Farm Upgrades</CardTitle>
            <CardDescription>Purchase upgrades to improve your farm.</CardDescription>
            <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                <Coins className="h-5 w-5 text-primary" />
                <span>Your Gold: {currency}</span>
            </div>
            <ul className="space-y-3">
              {upgradesData.map(upgrade => {
                const UpgradeIcon = upgrade.icon;
                const isPurchased = purchasedUpgrades[upgrade.id];
                const canAfford = currency >= upgrade.cost;
                return (
                  <li key={upgrade.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm">
                    <div className="flex items-center space-x-3">
                      <UpgradeIcon className="w-8 h-8 text-blue-500 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="font-semibold">{upgrade.name}</p>
                        <p className="text-xs text-muted-foreground">{upgrade.description}</p>
                      </div>
                    </div>
                    {isPurchased ? (
                      <div className="flex items-center text-green-600 font-semibold">
                        <CheckCircle className="w-5 h-5 mr-1" /> Purchased
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => onBuyUpgrade(upgrade.id)} 
                        disabled={!canAfford}
                        className="text-xs h-8"
                        title={!canAfford ? `Need ${upgrade.cost} gold` : `Buy for ${upgrade.cost} gold`}
                      >
                        Buy (<Coins className="inline w-3 h-3 mr-0.5" />{upgrade.cost})
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </TabsContent>

        <TabsContent value="town">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Welcome to Town!</CardTitle>
            <CardDescription>Explore different buildings and features in town.</CardDescription>
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Town features coming soon!</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> General Store</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Stock up on supplies or find rare items.</p>
                    </CardContent>
                    <CardContent className="pt-0">
                        <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
                    </CardContent>
                </Card>
                 <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Package className="w-5 h-5" /> Community Center</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Participate in events or take on quests.</p>
                    </CardContent>
                     <CardContent className="pt-0">
                        <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="leaderboard">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Leaderboard</CardTitle>
            <CardDescription>See how you rank against other farmers! Your name is saved automatically.</CardDescription>
            
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-sm font-medium">Your Name for Leaderboard</Label>
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => onPlayerNameChange(e.target.value)}
                placeholder="Enter your farmer name"
                className="max-w-sm"
              />
            </div>

            {leaderboardData.length === 0 && (!playerName || playerName.trim() === "") ? (
              <p className="text-muted-foreground">Enter your name to appear on the leaderboard. Other farmers' scores will show up here too!</p>
            ) : (
              <ul className="space-y-2 pt-2">
                {leaderboardData.map((entry, index) => (
                  <li 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-md shadow-sm 
                                ${entry.isCurrentUser ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary/30'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold w-6 text-center ${entry.isCurrentUser ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {index + 1}.
                      </span>
                      <span className={`font-medium ${entry.isCurrentUser ? 'text-primary-foreground' : ''}`}>
                        {entry.name} {entry.isCurrentUser ? '(You)' : ''}
                      </span>
                    </div>
                    <div className="flex items-center font-semibold">
                      <Coins className="w-4 h-4 mr-1 text-primary" />
                      {entry.score}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </TabsContent>

      </Tabs>
    </Card>
  );
};

export default InventoryAndShop;
    
