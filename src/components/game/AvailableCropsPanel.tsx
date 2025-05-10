import type { FC } from 'react';
import Image from 'next/image';
import type { Crop } from '@/types';
import { CROPS_DATA } from '@/config/crops';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface AvailableCropsPanelProps {
  onSelectCrop: (cropId: string) => void;
  selectedCropId?: string;
}

const AvailableCropsPanel: FC<AvailableCropsPanelProps> = ({ onSelectCrop, selectedCropId }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary-foreground/80">Available Seeds</CardTitle>
        <CardDescription>Select a seed to plant on an empty plot.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto p-4">
        {CROPS_DATA.map((crop) => {
          const IconComponent = crop.icon;
          const isSelected = selectedCropId === crop.id;
          return (
            <Button
              key={crop.id}
              variant={isSelected ? "default" : "outline"}
              className={`w-full justify-start p-3 h-auto shadow-sm hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary' : ''}`}
              onClick={() => onSelectCrop(crop.id)}
            >
              <div className="flex items-center space-x-3 w-full">
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
                    Grows in: {crop.growTime / 1000}s, Sells for: ${crop.sellPrice}
                  </p>
                </div>
                {isSelected && <CheckCircle className="w-5 h-5 text-primary-foreground ml-auto flex-shrink-0" />}
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AvailableCropsPanel;
