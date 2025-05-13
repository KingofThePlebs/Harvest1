
import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import type { InventoryItem, Crop, UpgradeDefinition, UpgradesState, UpgradeId, NeittType, OwnedNeitt, Nit, OwnedNit, Farm, Quest, QuestItemRequirement } from '@/types';
import { CROPS_DATA } from '@/config/crops'; // Keep this if cropsData prop is removed and used directly
import { NITS_DATA } from '@/config/nits'; // Keep this if nitsData prop is removed
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Package, Coins, TrendingUp, CheckCircle, Sprout, Handshake, Building, Leaf, Smile as NeittIconLucide, Gem, Bone, Home as HomeIcon, Star, BarChart3, Clock, Users, DollarSign, HeartPulse, ScrollText, CheckSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavSheet from './MobileNavSheet';
import type { TabDefinition } from './MobileNavSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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

  neittsData: NeittType[];
  ownedNeitts: OwnedNeitt[];
  onBuyNeitt: (neittId: string) => void;
  onFeedNeitt: (instanceId: string) => void;

  producedNits: OwnedNit[];
  nitsData: Nit[];
  onSellNit: (nitId: string, quantity: number) => void;

  cropsData: Crop[];

  farmLevel: number;
  farmXp: number;
  xpForNextLevel: number;
  neittSlaverLevel: number;
  neittSlaverXp: number;
  xpForNextNeittSlaverLevel: number;
  traderLevel: number;
  traderXp: number;
  xpForNextTraderLevel: number;


  farms: Farm[];
  currentFarmId: string;
  onFarmChange: (farmId: string) => void;

  totalMoneySpent: number;
  totalCropsHarvested: number;
  totalNeittsFed: number;
  formattedGameTime: string;

  activeQuests: Quest[];
  onCompleteQuest: (questId: string) => void;
}

const tabDefinitions: TabDefinition[] = [
  { id: 'mySeeds', label: 'My Seeds', icon: Sprout },
  { id: 'myFarm', label: 'My Farm', icon: HomeIcon },
  { id: 'sellMarket', label: 'Sell Market', icon: Handshake },
  { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
  { id: 'town', label: 'Town', icon: Building }, // Icon for Quest Square
  { id: 'neittFarm', label: 'Neitt Farm', icon: NeittIconLucide },
];

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
  neittsData,
  ownedNeitts,
  onBuyNeitt,
  onFeedNeitt,
  producedNits,
  nitsData,
  onSellNit,
  cropsData, // Make sure this is passed if used directly for quest item names
  farmLevel,
  farmXp,
  xpForNextLevel,
  neittSlaverLevel,
  neittSlaverXp,
  xpForNextNeittSlaverLevel,
  traderLevel,
  traderXp,
  xpForNextTraderLevel,
  farms,
  currentFarmId,
  onFarmChange,
  totalMoneySpent,
  totalCropsHarvested,
  totalNeittsFed,
  formattedGameTime,
  activeQuests,
  onCompleteQuest,
}) => {
  const getCropById = (cropId: string): Crop | undefined => cropsData.find(c => c.id === cropId);
  const getNitById = (nitId: string): Nit | undefined => nitsData.find(n => n.id === nitId);

  const [activeTab, setActiveTab] = useState(tabDefinitions[1].id);
  const isMobile = useIsMobile();

  const farmProgressPercent = xpForNextLevel > 0 ? (farmXp / xpForNextLevel) * 100 : 0;
  const neittSlaverProgressPercent = xpForNextNeittSlaverLevel > 0 ? (neittSlaverXp / xpForNextNeittSlaverLevel) * 100 : 0;
  const traderProgressPercent = xpForNextTraderLevel > 0 ? (traderXp / xpForNextTraderLevel) * 100 : 0;
  const currentFarmName = farms.find(f => f.id === currentFarmId)?.name || "Farm";

  const availableUpgrades = upgradesData.filter(upgrade => {
    if (upgrade.id === 'unlockFarm2' || upgrade.id === 'unlockFarm3') {
        return !purchasedUpgrades[upgrade.id] && (upgrade.isUnlocked ? upgrade.isUnlocked(purchasedUpgrades) : true);
    }
    return upgrade.isUnlocked ? upgrade.isUnlocked(purchasedUpgrades) : true;
  });

  const canCompleteQuest = (quest: Quest): boolean => {
    for (const req of quest.requirements) {
      if (req.type === 'crop') {
        const itemInInventory = harvestedInventory.find(item => item.cropId === req.itemId);
        if (!itemInInventory || itemInInventory.quantity < req.quantity) {
          return false;
        }
      } else if (req.type === 'nit') {
        const itemInInventory = producedNits.find(item => item.nitId === req.itemId);
        if (!itemInInventory || itemInInventory.quantity < req.quantity) {
          return false;
        }
      }
    }
    return true;
  };


  return (
    <Card className="shadow-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="p-4 border-b border-border md:hidden">
            <MobileNavSheet
              tabs={tabDefinitions}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        ) : (
          <CardHeader className="pb-0 hidden md:block">
            <TabsList className="grid w-full grid-cols-6">
              {tabDefinitions.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />{tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardHeader>
        )}

        <TabsContent value="mySeeds">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[calc(60vh-100px)]">
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

        <TabsContent value="myFarm">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[calc(60vh-100px)]">
            <CardContent className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <CardTitle className="text-xl text-primary-foreground/80 flex items-center gap-2">
                  <HomeIcon className="w-6 h-6"/>My Farm Overview
                </CardTitle>
                {farms.length > 0 && (
                  <Select value={currentFarmId} onValueChange={onFarmChange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select Farm" />
                    </SelectTrigger>
                    <SelectContent>
                      {farms.map(farm => (
                        <SelectItem key={farm.id} value={farm.id}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <CardDescription>Currently viewing: <span className="font-semibold">{currentFarmName}</span>. Track your farm's progress and level.</CardDescription>

              <div className="space-y-3 p-4 bg-secondary/20 rounded-md shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Star className="w-5 h-5 text-primary" />
                    Farm Level:
                  </div>
                  <span className="text-lg font-bold text-primary">{farmLevel}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Farm XP:</span>
                    <span className="text-sm font-semibold">{farmXp} / {xpForNextLevel}</span>
                  </div>
                  <Progress value={farmProgressPercent} className="w-full h-3" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {Math.max(0, xpForNextLevel - farmXp)} XP to next level
                  </p>
                </div>
                
                <Separator/>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="w-5 h-5 text-purple-500" />
                    Neitt Slaver Level:
                  </div>
                  <span className="text-lg font-bold text-purple-500">{neittSlaverLevel}</span>
                </div>
                 <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Neitt Slaver XP:</span>
                    <span className="text-sm font-semibold">{neittSlaverXp} / {xpForNextNeittSlaverLevel}</span>
                  </div>
                  <Progress value={neittSlaverProgressPercent} className="w-full h-3" indicatorClassName="bg-purple-500" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {Math.max(0, xpForNextNeittSlaverLevel - neittSlaverXp)} XP to next level
                  </p>
                </div>

                <Separator/>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Trader Level:
                  </div>
                  <span className="text-lg font-bold text-emerald-500">{traderLevel}</span>
                </div>
                 <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Trader XP:</span>
                    <span className="text-sm font-semibold">{traderXp} / {xpForNextTraderLevel}</span>
                  </div>
                  <Progress value={traderProgressPercent} className="w-full h-3" indicatorClassName="bg-emerald-500" />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {Math.max(0, xpForNextTraderLevel - traderXp)} XP to next level
                  </p>
                </div>
              </div>

              <Separator className="my-4"/>

              <CardTitle className="text-lg text-primary-foreground/70 flex items-center gap-2">
                <BarChart3 className="w-5 h-5"/>Farm Statistics
              </CardTitle>
              <div className="space-y-2 p-4 bg-secondary/20 rounded-md shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins className="w-4 h-4 text-primary/80" />
                    Total Money Spent:
                  </div>
                  <span className="font-semibold">{totalMoneySpent}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sprout className="w-4 h-4 text-green-500" />
                    Crops Harvested:
                  </div>
                  <span className="font-semibold">{totalCropsHarvested}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HeartPulse className="w-4 h-4 text-red-500" />
                    Neitts Fed:
                  </div>
                  <span className="font-semibold">{totalNeittsFed}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Game Time:
                  </div>
                  <span className="font-semibold">{formattedGameTime}</span>
                </div>
              </div>
              <CardDescription className="mt-4 text-sm">
                Gain XP by harvesting crops to level up your Farm. Feed Neitts to level up your Neitt Slaver rank. Sell items to improve your Trader level!
              </CardDescription>
            </CardContent>
          </ScrollArea>
        </TabsContent>


        <TabsContent value="sellMarket">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[calc(60vh-100px)]">
            <CardContent className="space-y-4 pt-4">
              <CardTitle className="text-xl text-primary-foreground/80">Sell Harvested Items</CardTitle>
              <CardDescription>Sell your harvested crops and produced nits for gold.</CardDescription>
              <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                  <Coins className="h-5 w-5 text-primary" />
                  <span>Your Gold: {currency}</span>
              </div>
              {harvestedInventory.length === 0 && producedNits.length === 0 ? (
                <p className="text-muted-foreground">Nothing to sell. Harvest some crops or collect Nits from your Neitts!</p>
              ) : (
                <>
                  {harvestedInventory.length > 0 && (
                    <>
                      <h3 className="text-md font-semibold text-muted-foreground">Crops:</h3>
                      <ul className="space-y-3">
                        {harvestedInventory.map(item => {
                          const crop = getCropById(item.cropId);
                          if (!crop) return null;
                          const IconComponent = crop.icon;
                          const effectiveSellPrice = getEffectiveCropSellPrice(crop.sellPrice);
                          return (
                            <li key={`crop-${item.cropId}`} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm hover:bg-secondary/50">
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
                              <div className="flex items-center space-x-1">
                                <Button size="sm" onClick={() => onSellCrop(item.cropId, 1)} className="text-xs h-7 px-2" disabled={item.quantity < 1}>
                                  Sell 1
                                </Button>
                                <Button size="sm" onClick={() => onSellCrop(item.cropId, 10)} className="text-xs h-7 px-2" disabled={item.quantity < 10}>
                                  Sell 10
                                </Button>
                                <Button size="sm" onClick={() => onSellCrop(item.cropId, item.quantity)} className="text-xs h-7 px-2" disabled={item.quantity < 1}>
                                  Sell All
                                </Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                  {producedNits.length > 0 && (
                    <>
                      <Separator className="my-4"/>
                      <h3 className="text-md font-semibold text-muted-foreground">Nits:</h3>
                      <ul className="space-y-3">
                        {producedNits.map(item => {
                          const nit = getNitById(item.nitId);
                          if (!nit) return null;
                          const NitIconComponent = nit.icon || Gem;
                          return (
                            <li key={`nit-${item.nitId}`} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm hover:bg-secondary/50">
                              <div className="flex items-center space-x-3">
                                {nit.imageUrl && typeof nit.imageUrl === 'object' ? ( 
                                  <Image src={nit.imageUrl} alt={nit.name} width={32} height={32} className="object-contain rounded-md" data-ai-hint={nit.dataAiHint}/>
                                ) : (
                                  <NitIconComponent className="w-8 h-8 text-purple-500" />
                                )}
                                <div>
                                  <p className="font-semibold">{nit.name} <span className="text-xs text-muted-foreground">(Qty: {item.quantity})</span></p>
                                  <p className="text-xs text-muted-foreground">Sell Price: <Coins className="inline w-3 h-3 mr-0.5" />{nit.sellPrice} each</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button size="sm" onClick={() => onSellNit(item.nitId, 1)} className="text-xs h-7 px-2" disabled={item.quantity < 1}>
                                  Sell 1
                                </Button>
                                <Button size="sm" onClick={() => onSellNit(item.nitId, 10)} className="text-xs h-7 px-2" disabled={item.quantity < 10}>
                                  Sell 10
                                </Button>
                                <Button size="sm" onClick={() => onSellNit(item.nitId, item.quantity)} className="text-xs h-7 px-2" disabled={item.quantity < 1}>
                                  Sell All
                                </Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="upgrades">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[calc(60vh-100px)]">
            <CardContent className="space-y-4 pt-4">
              <CardTitle className="text-xl text-primary-foreground/80">Farm Upgrades</CardTitle>
              <CardDescription>Purchase upgrades to improve your farm.</CardDescription>
              <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                  <Coins className="h-5 w-5 text-primary" />
                  <span>Your Gold: {currency}</span>
              </div>
              <ul className="space-y-3">
                {availableUpgrades.map(upgrade => {
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
                 {upgradesData.filter(u => (u.id === 'unlockFarm2' && purchasedUpgrades.unlockFarm2) || (u.id === 'unlockFarm3' && purchasedUpgrades.unlockFarm3)).map(purchasedFarmUpgrade => (
                     <li key={`${purchasedFarmUpgrade.id}-purchased`} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm opacity-70">
                        <div className="flex items-center space-x-3">
                            <purchasedFarmUpgrade.icon className="w-8 h-8 text-blue-500 flex-shrink-0" />
                            <div className="flex-grow">
                            <p className="font-semibold">{purchasedFarmUpgrade.name}</p>
                            <p className="text-xs text-muted-foreground">{purchasedFarmUpgrade.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-green-600 font-semibold">
                          <CheckCircle className="w-5 h-5 mr-1" /> Purchased
                        </div>
                    </li>
                 ))}
              </ul>
            </CardContent>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="town">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[calc(60vh-100px)]">
            <CardContent className="space-y-4 pt-4">
                <CardTitle className="text-xl text-primary-foreground/80 flex items-center gap-2">
                    <ScrollText className="w-6 h-6" /> Quest Square
                </CardTitle>
                <CardDescription>Complete quests for rewards. New quests appear periodically.</CardDescription>

                {activeQuests.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground text-center">No active quests at the moment.<br/>Check back later for new opportunities!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeQuests.map(quest => {
                            const canAffordToComplete = canCompleteQuest(quest);
                            return (
                                <Card key={quest.id} className="bg-secondary/30 shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                                        <CardDescription className="text-sm">{quest.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2 pb-3">
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Requirements:</h4>
                                            <ul className="list-disc list-inside pl-2 text-sm space-y-0.5">
                                                {quest.requirements.map(req => {
                                                    const item = req.type === 'crop' ? getCropById(req.itemId) : getNitById(req.itemId);
                                                    return (
                                                        <li key={`${req.itemId}-${req.type}`}>
                                                            {req.quantity}x {item?.name || req.itemId}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div>
                                          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-0.5">Reward:</h4>
                                          <p className="text-sm flex items-center"><Coins className="w-4 h-4 mr-1 text-primary" /> {quest.rewardCurrency} Gold</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            onClick={() => onCompleteQuest(quest.id)}
                                            disabled={!canAffordToComplete}
                                            className="w-full"
                                            variant={canAffordToComplete ? "default" : "outline"}
                                        >
                                            <CheckSquare className="w-4 h-4 mr-2"/> Complete Quest
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
                 <Separator className="my-6"/>
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
            </CardContent>
          </ScrollArea>
        </TabsContent>


        <TabsContent value="neittFarm">
          <ScrollArea className="h-[300px] sm:h-[400px] lg:max-h-[calc(60vh-100px)]">
            <CardContent className="space-y-6 pt-4">
              <div>
                <CardTitle className="text-xl text-primary-foreground/80 mb-2">Your Neitt Pen</CardTitle>
                <CardDescription className="mb-4">Feed your Neitts to have them produce Nits over time.</CardDescription>
                {ownedNeitts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Your neitt pen is empty. Buy some neitts from the shop below!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 bg-background/50 rounded-md">
                    {ownedNeitts.map(ownedNeittInstance => {
                      const neittDetails = neittsData.find(s => s.id === ownedNeittInstance.neittTypeId);
                      if (!neittDetails) return null;

                      const NeittIcon = neittDetails.icon;
                      const requiredFeedCrop = cropsData.find(c => c.id === neittDetails.feedCropId);
                      const playerHasFeedCrop = requiredFeedCrop ? harvestedInventory.some(item => item.cropId === requiredFeedCrop.id && item.quantity > 0) : false;

                      let productionProgress = 0;
                      let statusText = "Hungry";

                      if (ownedNeittInstance.nitsLeftToProduce > 0 && ownedNeittInstance.initialNitsForCycle > 0) {
                        const elapsedTime = Date.now() - ownedNeittInstance.lastProductionCycleStartTime;
                        const progressForCurrentNit = Math.min(100, (elapsedTime / neittDetails.productionTime) * 100);
                        productionProgress = progressForCurrentNit;

                        const nitsProducedSoFar = ownedNeittInstance.initialNitsForCycle - ownedNeittInstance.nitsLeftToProduce;
                        statusText = `Producing Nit ${nitsProducedSoFar + 1}/${ownedNeittInstance.initialNitsForCycle}`;
                      }


                      let feedButtonText = "Feed";
                      if (requiredFeedCrop && ownedNeittInstance.nitsLeftToProduce <= 0) {
                          feedButtonText = `Feed (1 ${requiredFeedCrop.name})`;
                      } else if (ownedNeittInstance.nitsLeftToProduce > 0) {
                          feedButtonText = "Producing...";
                      }

                      const feedButtonDisabled = ownedNeittInstance.nitsLeftToProduce > 0 || (!!requiredFeedCrop && !playerHasFeedCrop && ownedNeittInstance.nitsLeftToProduce <= 0);

                      let buttonTitle = `Feed ${neittDetails.name}`;
                      if(ownedNeittInstance.nitsLeftToProduce > 0) {
                        buttonTitle = `${neittDetails.name} is producing`;
                      } else if (requiredFeedCrop && !playerHasFeedCrop) {
                        buttonTitle = `You need 1 ${requiredFeedCrop.name} to feed`;
                      } else if (requiredFeedCrop) {
                        buttonTitle = `Feed ${neittDetails.name} with 1 ${requiredFeedCrop.name}`;
                      }


                      return (
                        <Card key={ownedNeittInstance.instanceId} className="flex flex-col items-center p-3 bg-secondary/40 shadow-sm rounded-lg hover:shadow-md transition-shadow">
                           {neittDetails.imageUrl && typeof neittDetails.imageUrl === 'object' && 'src' in neittDetails.imageUrl ? (
                             <Image src={neittDetails.imageUrl} alt={neittDetails.name} width={48} height={48} className="rounded-full mb-1 object-cover ring-2 ring-primary/50" data-ai-hint={neittDetails.dataAiHint} />
                          ) : typeof neittDetails.imageUrl === 'string' ? (
                             <Image src={neittDetails.imageUrl} alt={neittDetails.name} width={48} height={48} className="rounded-full mb-1 object-cover ring-2 ring-primary/50" data-ai-hint={neittDetails.dataAiHint} />
                          ) : NeittIcon ? (
                            <NeittIcon className="w-12 h-12 mb-1" style={{ color: neittDetails.color || 'hsl(var(--primary))' }} />
                          ) : <NeittIconLucide className="w-12 h-12 mb-1 text-muted-foreground" />}
                          <p className="font-semibold text-sm text-center truncate w-full">{neittDetails.name}</p>
                          <div className="text-xs text-muted-foreground text-center mt-0.5 h-10 flex flex-col justify-center">
                            <span>{statusText}</span>
                            {requiredFeedCrop && ownedNeittInstance.nitsLeftToProduce <= 0 && (
                                <span className="block">Needs: 1 {requiredFeedCrop.name}</span>
                            )}
                          </div>
                          {ownedNeittInstance.nitsLeftToProduce > 0 && (
                             <Progress value={productionProgress} className="h-2 w-full mt-1 transition-all duration-100" />
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs h-7"
                            onClick={() => onFeedNeitt(ownedNeittInstance.instanceId)}
                            disabled={feedButtonDisabled}
                            title={buttonTitle}
                          >
                            <Bone className="w-3 h-3 mr-1" /> {feedButtonText}
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator className="my-6 border-border/50" />

              <div>
                <CardTitle className="text-xl text-primary-foreground/80 mb-2">Neitt Shop</CardTitle>
                <CardDescription className="mb-4">Purchase new neitts to add to your farm.</CardDescription>
                <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                    <Coins className="h-5 w-5 text-primary" />
                    <span>Your Gold: {currency}</span>
                </div>
                <ul className="space-y-3">
                  {neittsData.map(neitt => {
                    const NeittShopIcon = neitt.icon;
                    const canAfford = currency >= neitt.cost;
                    const feedCropForShop = cropsData.find(c => c.id === neitt.feedCropId);
                    const productionRange = neitt.minProductionCapacity === neitt.maxProductionCapacity
                                            ? `${neitt.minProductionCapacity}`
                                            : `${neitt.minProductionCapacity}-${neitt.maxProductionCapacity}`;
                    return (
                      <li key={neitt.id} className={`flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm hover:bg-secondary/50 transition-all ${!canAfford ? 'opacity-60' : ''}`}>
                        <div className="flex items-center space-x-3">
                           {neitt.imageUrl && typeof neitt.imageUrl === 'object' && 'src' in neitt.imageUrl ? (
                             <Image src={neitt.imageUrl} alt={neitt.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={neitt.dataAiHint}/>
                           ) : typeof neitt.imageUrl === 'string' ? (
                             <Image src={neitt.imageUrl} alt={neitt.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={neitt.dataAiHint}/>
                          ) : NeittShopIcon ? (
                            <NeittShopIcon className="w-10 h-10" style={{ color: neitt.color || 'hsl(var(--primary))' }}/>
                          ) : <NeittIconLucide className="w-10 h-10 text-muted-foreground" /> }
                          <div className="flex-grow">
                            <p className="font-semibold">{neitt.name}</p>
                            <p className="text-xs text-muted-foreground max-wxs truncate">{neitt.description}</p>
                             <p className="text-xs text-muted-foreground">Cost: <Coins className="inline w-3 h-3 mr-0.5" />{neitt.cost}</p>
                             <p className="text-xs text-muted-foreground">Produces: {nitsData.find(n=>n.id === neitt.producesNitId)?.name || 'Nit'} ({productionRange} per feed / {neitt.productionTime/1000}s each)</p>
                             {feedCropForShop && <p className="text-xs text-muted-foreground">Eats: {feedCropForShop.name}</p>}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onBuyNeitt(neitt.id)}
                          disabled={!canAfford}
                          className="text-xs h-8 min-w-[70px]"
                          title={!canAfford ? `Need ${neitt.cost} gold` : `Buy for ${neitt.cost} gold`}
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
