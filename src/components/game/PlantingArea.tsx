import type { FC } from 'react';
import type { PlotState } from '@/types';
import CropPlot from './CropPlot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlantingAreaProps {
  plots: PlotState[];
  onPlant: (plotId: string, cropId: string) => void;
  onHarvest: (plotId: string, cropId: string) => void;
  selectedCropToPlantId?: string;
}

const PlantingArea: FC<PlantingAreaProps> = ({ plots, onPlant, onHarvest, selectedCropToPlantId }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary-foreground/80">Your Farm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-4 rounded-lg ">
          {plots.map((plot) => (
            <CropPlot
              key={plot.id}
              plot={plot}
              onPlant={onPlant}
              onHarvest={onHarvest}
              selectedCropToPlantId={selectedCropToPlantId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantingArea;
