import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NavTree, { type NavEntry } from "./NavTree";

interface MobileNavProps {
  entries: NavEntry[];
  currentPath: string;
  currentHeadings?: any[];
  wikiName: string;
}

export default function MobileNav({ entries, currentPath, currentHeadings, wikiName }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger >
        <div className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Abrir menú</span>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="px-4 pt-4 pb-2 text-lg font-bold tracking-tight">
          📜 {wikiName}
        </SheetTitle>
        <NavTree entries={entries} currentPath={currentPath} currentHeadings={currentHeadings} />
      </SheetContent>
    </Sheet>
  );
}
