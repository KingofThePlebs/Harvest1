
"use client";

import type { FC } from 'react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export interface TabDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavSheetProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const MobileNavSheet: FC<MobileNavSheetProps> = ({ tabs, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false); // Close sheet after selection
  };

  const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Menu';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-sm md:text-base">
          <Menu className="w-5 h-5" />
          <span>{currentTabLabel}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto p-4 rounded-t-lg">
        <SheetHeader className="mb-2">
          <SheetTitle className="text-center">Navigation</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => handleTabClick(tab.id)}
                className="w-full justify-start text-left h-12 text-sm md:text-base"
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavSheet;
