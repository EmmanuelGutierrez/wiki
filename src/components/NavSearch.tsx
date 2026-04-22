import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import type { NavEntry } from "./NavTree";

interface NavSearchProps {
  entries: NavEntry[];
}

export default function NavSearch({ entries }: NavSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const searchEntries = useMemo(() => {
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    return entries.map((e) => ({
      ...e,
      searchTitle: normalize(e.title),
      searchContent: normalize(e.content),
    }));
  }, [entries]);

  const fuse = useMemo(() => {
    return new Fuse(searchEntries, {
      keys: [
        { name: "searchTitle", weight: 2 },
        { name: "searchContent", weight: 1 },
      ],
      threshold: 0.2,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [searchEntries]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 5);
  }, [fuse, searchQuery]);

  return (
    <div className="p-3 pb-2 space-y-3">
      <div className="relative group">
        <InputGroup>
          <InputGroupAddon>
            <Search size={14} />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
          />

          <InputGroupAddon align={"inline-end"}>
            {results.length ? results.length : ""}
          </InputGroupAddon>
        </InputGroup>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors z-10"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Quick Results */}
      {searchQuery && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Resultados
          </div>
          <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-muted">
            {results.length > 0 ? (
              results.map(({ item }) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  asChild
                  onClick={() => setSearchQuery("")}
                  className="h-auto w-full justify-start gap-2 px-2 py-2.5 text-sm normal-case tracking-normal hover:bg-primary/10 hover:text-primary transition-all group/result"
                >
                  <a href={item.id === "index" ? "/wiki" : `/wiki/${item.id}`}>
                    <div className="flex flex-col items-start gap-0.5 text-left w-full overflow-hidden">
                      <span className="font-semibold truncate w-full group-hover/result:translate-x-0.5 transition-transform">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-clamp-1 opacity-70">
                        {item.id.replace(/\//g, " > ")}
                      </span>
                    </div>
                  </a>
                </Button>
              ))
            ) : (
              <div className="px-2 py-4 text-xs text-center text-muted-foreground italic border border-dashed border-border rounded-md">
                No se encontraron coincidencias
              </div>
            )}
          </div>
          <div className="border-b border-border/40 mx-2 mt-2" />
        </div>
      )}
    </div>
  );
}
