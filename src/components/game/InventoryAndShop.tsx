import type { FC } from 'react';
import Image from 'next/image';
import type { InventoryItem, Crop, UpgradeDefinition, UpgradesState, UpgradeId } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Coins, TrendingUp, CheckCircle } from 'lucide-react';

interface InventoryAndShopProps {
  inventory: InventoryItem[];
  onSellCrop: (cropId: string, quantity: number) => void;
  currency: number;
  upgradesData: UpgradeDefinition[];
  purchasedUpgrades: UpgradesState;
  onBuyUpgrade: (upgradeId: UpgradeId) => void;
  getEffectiveCropSellPrice: (basePrice: number) => number;
}

const InventoryAndShop: FC<InventoryAndShopProps> = ({ 
  inventory, 
  onSellCrop, 
  currency, 
  upgradesData, 
  purchasedUpgrades, 
  onBuyUpgrade,
  getEffectiveCropSellPrice
}) => {
  const getCropById = (cropId: string): Crop | undefined => CROPS_DATA.find(c => c.id === cropId);

  return (
    <Card className="shadow-lg">
      <Tabs defaultValue="inventory" className="w-full">
        <CardHeader className="pb-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory" className="flex items-center gap-2"><Package className="w-4 h-4" />Inventory</TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" />Shop</TabsTrigger>
            <TabsTrigger value="upgrades" className="flex items-center gap-2"><TrendingUp className="w-4 h-4" />Upgrades</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="inventory">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Your Harvest</CardTitle>
            {inventory.length === 0 ? (
              <p className="text-muted-foreground">Your inventory is empty. Harvest some crops!</p>
            ) : (
              <ul className="space-y-3">
                {inventory.map(item => {
                  const crop = getCropById(item.cropId);
                  if (!crop) return null;
                  const IconComponent = crop.icon;
                  return (
                    <li key={item.cropId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm">
                      <div className="flex items-center space-x-3">
                        {IconComponent ? (
                          <IconComponent className="w-8 h-8 text-green-600" />
                        ) : crop.imageUrl ? (
                          <Image src={crop.imageUrl} alt={crop.name} width={32} height={32} className="object-contain rounded-md" data-ai-hint={crop.dataAiHint} />
                        ) : null}
                        <div>
                          <p className="font-semibold">{crop.name}</p>
                          <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="shop">
          <CardContent className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            <CardTitle className="text-xl text-primary-foreground/80">Sell Crops</CardTitle>
            <CardDescription>Sell your harvested crops for gold.</CardDescription>
             <div className="flex items-center space-x-2 text-lg font-semibold mb-4">
                <Coins className="h-5 w-5 text-primary" />
                <span>Your Gold: {currency}</span>
            </div>
            {inventory.length === 0 ? (
              <p className="text-muted-foreground">Nothing to sell. Harvest some crops first!</p>
            ) : (
              <ul className="space-y-3">
                {inventory.map(item => {
                  const crop = getCropById(item.cropId);
                  if (!crop) return null;
                  const IconComponent = crop.icon;
                  const effectiveSellPrice = getEffectiveCropSellPrice(crop.sellPrice);
                  return (
                    <li key={item.cropId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md shadow-sm">
                      <div className="flex items-center space-x-3">
                        {IconComponent ? (
                          <IconComponent className="w-8 h-8 text-green-600" />
                        ) : crop.imageUrl ? (
                          <Image src={crop.imageUrl} alt={crop.name} width={32} height={32} className="object-contain rounded-md" data-ai-hint={crop.dataAiHint}/>
                        ) : null}
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
      </Tabs>
    </Card>
  );
};

export default InventoryAndShop;
