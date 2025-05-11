
import type { FC } from 'react';
import Image from 'next/image';
import type { InventoryItem, Crop, UpgradeDefinition, UpgradesState, UpgradeId, SlimeType, OwnedSlime } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { SLIMES_DATA } from '@/config/slimes'; // Import slime data
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input'; // Removed as leaderboard name input is gone
// import { Label } from '@/components/ui/label'; // Removed
import { ShoppingCart, Package, Coins, TrendingUp, CheckCircle, Sprout, Handshake, Building, Leaf, /* Trophy, Loader2, Send */ Smile as SlimeIconLucide } from 'lucide-react'; // Removed leaderboard icons
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';


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
  
  // Leaderboard props removed
  // playerNameInput: string;
  // onPlayerNameInputChange: (name: string) => void;
  // onSubmitNameToLeaderboard: () => Promise<void>;
  // leaderboardData: LeaderboardEntry[];
  // isLeaderboardLoading: boolean;
  // isSubmittingScore: boolean;
  // confirmedPlayerName: string;

  // Slime Farm props
  slimesData: SlimeType[];
  ownedSlimes: OwnedSlime[];
  onBuySlime: (slimeId: string) => void;
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
  // Leaderboard props removed
  slimesData,
  ownedSlimes,
  onBuySlime,
}) => {
  const getCropById = (cropId: string): Crop | undefined => CROPS_DATA.find(c => c.id === cropId);

  return (
    <Card className="shadow-lg">
      <Tabs defaultValue="mySeeds" className="w-full">
        <CardHeader className="pb-0">
          {/* Adjusted grid-cols for 5 tabs */}
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mySeeds" className="flex items-center gap-2"><Sprout className="w-4 h-4" />My Seeds</TabsTrigger>
            <TabsTrigger value="sellMarket" className="flex items-center gap-2"><Handshake className="w-4 h-4" />Sell Market</TabsTrigger>
            <TabsTrigger value="upgrades" className="flex items-center gap-2"><TrendingUp className="w-4 h-4" />Upgrades</TabsTrigger>
            <TabsTrigger value="town" className="flex items-center gap-2"><Building className="w-4 h-4" />Town</TabsTrigger>
            <TabsTrigger value="slimeFarm" className="flex items-center gap-2"><SlimeIconLucide className="w-4 h-4" />Slime Farm</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="mySeeds">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[60vh]">
            <CardContent className="space-y-4 pt-4">
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
                                      ${isSelected ? 'ring-2 ring-primary-foreground ring-offset-2 ring-offset-background' : 'hover:bg-secondary/50'}`}
                      >
                        <div className="flex items-center space-x-3">
                          {crop.seedShopImageUrl && typeof crop.seedShopImageUrl === 'object' ? ( 
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sellMarket">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[60vh]">
            <CardContent className="space-y-4 pt-4">
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
                      <li key={item.cropId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm hover:bg-secondary/50">
                        <div className="flex items-center space-x-3">
                          {crop.harvestedCropImageUrl && typeof crop.harvestedCropImageUrl === 'object' ? ( 
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upgrades">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[60vh]">
            <CardContent className="space-y-4 pt-4">
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
                    <li key={upgrade.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm hover:bg-secondary/50">
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="town">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[60vh]">
            <CardContent className="space-y-4 pt-4">
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
          </ScrollArea>
        </TabsContent>

        <TabsContent value="slimeFarm">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[60vh]">
            <CardContent className="space-y-6 pt-4">
              {/* Slime Display Area */}
              <div>
                <CardTitle className="text-xl text-primary-foreground/80 mb-2">Your Slime Pen</CardTitle>
                <CardDescription className="mb-4">These are the slimes you own. Watch them jiggle!</CardDescription>
                {ownedSlimes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Your slime pen is empty. Buy some slimes from the shop below!</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2 bg-background/50 rounded-md">
                    {ownedSlimes.map(ownedSlime => {
                      const slimeDetails = slimesData.find(s => s.id === ownedSlime.slimeTypeId);
                      if (!slimeDetails) return null;
                      const SlimeIcon = slimeDetails.icon;
                      return (
                        <Card key={slimeDetails.id} className="flex flex-col items-center p-3 bg-secondary/40 shadow-sm rounded-lg hover:shadow-md transition-shadow">
                          {slimeDetails.imageUrl ? (
                             <Image src={slimeDetails.imageUrl} alt={slimeDetails.name} width={48} height={48} className="rounded-full mb-2 object-cover ring-2 ring-primary/50" data-ai-hint={slimeDetails.dataAiHint} />
                          ) : SlimeIcon ? (
                            <SlimeIcon className="w-12 h-12 mb-2" style={{ color: slimeDetails.color || 'hsl(var(--primary))' }} />
                          ) : <SlimeIconLucide className="w-12 h-12 mb-2 text-muted-foreground" />}
                          <p className="font-semibold text-sm text-center truncate w-full">{slimeDetails.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {ownedSlime.quantity}</p>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator className="my-6 border-border/50" />

              {/* Slime Shop Area */}
              <div>
                <CardTitle className="text-xl text-primary-foreground/80 mb-2">Slime Shop</CardTitle>
                <CardDescription className="mb-4">Purchase new slimes to add to your farm.</CardDescription>
                <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                    <Coins className="h-5 w-5 text-primary" />
                    <span>Your Gold: {currency}</span>
                </div>
                <ul className="space-y-3">
                  {slimesData.map(slime => {
                    const SlimeShopIcon = slime.icon;
                    const canAfford = currency >= slime.cost;
                    return (
                      <li key={slime.id} className={`flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm hover:bg-secondary/50 transition-all ${!canAfford ? 'opacity-60' : ''}`}>
                        <div className="flex items-center space-x-3">
                           {slime.imageUrl ? (
                             <Image src={slime.imageUrl} alt={slime.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={slime.dataAiHint}/>
                          ) : SlimeShopIcon ? (
                            <SlimeShopIcon className="w-10 h-10" style={{ color: slime.color || 'hsl(var(--primary))' }}/>
                          ) : <SlimeIconLucide className="w-10 h-10 text-muted-foreground" /> }
                          <div className="flex-grow">
                            <p className="font-semibold">{slime.name}</p>
                            <p className="text-xs text-muted-foreground max-w-xs truncate">{slime.description}</p>
                             <p className="text-xs text-muted-foreground">Cost: <Coins className="inline w-3 h-3 mr-0.5" />{slime.cost}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => onBuySlime(slime.id)} 
                          disabled={!canAfford}
                          className="text-xs h-8 min-w-[70px]"
                          title={!canAfford ? `Need ${slime.cost} gold` : `Buy for ${slime.cost} gold`}
                          variant="outline"
                        >
                          Buy
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
          </ScrollArea>
        </TabsContent>

      </Tabs>
    </Card>
  );
};

export default InventoryAndShop;
