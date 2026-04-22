import { useState, useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import NavSearch from "./NavSearch";

export interface NavEntry {
  id: string;
  title: string;
  order: number;
  content: string;
}

interface TreeNode {
  name: string;
  displayName: string;
  path: string | null;
  title: string | null;
  order: number;
  children: TreeNode[];
  isFolder: boolean;
}

function buildTree(entries: NavEntry[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const entry of entries) {
    const parts = entry.id.split("/");
    let currentLevel = root;
    let parentNode: TreeNode | null = null;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const isIndex = isLast && part === "index";

      // Find existing node by name regardless of type
      let node = currentLevel.find((n) => n.name === part);

      if (!node) {
        node = {
          name: part,
          displayName: capitalize(part.replace(/-/g, " ")),
          path: null,
          title: null,
          order: 999,
          children: [],
          isFolder: false,
        };
        currentLevel.push(node);
      }

      if (isLast) {
        if (isIndex && parentNode) {
          // If it's index.mdx and we have a parent, it's the folder's cover
          parentNode.path = `/wiki/${entry.id}`;
          parentNode.title = entry.title;
          parentNode.order = entry.order;
          // Remove the "index" node as it's now represented by the parent
          const idx = currentLevel.indexOf(node);
          if (idx > -1) currentLevel.splice(idx, 1);
        } else if (isIndex && i === 0) {
          // Root index (Home)
          node.path = "/wiki";
          node.title = entry.title;
          node.order = entry.order;
        } else {
          // Leaf page
          node.path = `/wiki/${entry.id}`;
          node.title = entry.title;
          node.order = entry.order;
        }
      } else {
        // Intermediate node - it's a folder
        node.isFolder = true;
        parentNode = node;
        currentLevel = node.children;
      }
    }
  }

  // Refinement pass for folder icons
  const refineNodes = (nodes: TreeNode[]) => {
    nodes.forEach((n) => {
      if (n.children.length > 0) {
        n.isFolder = true;
        refineNodes(n.children);
      }
    });
  };
  refineNodes(root);

  sortTree(root);
  return root;
}

function sortTree(nodes: TreeNode[]) {
  nodes.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.displayName.localeCompare(b.displayName);
  });
  for (const node of nodes) {
    if (node.children.length > 0) {
      sortTree(node.children);
    }
  }
}

function capitalize(s: string): string {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function isPathActive(nodePath: string | null, currentPath: string): boolean {
  if (!nodePath) return false;
  // Normalize paths: remove trailing slash and trailing /index
  const normalize = (p: string) => p.replace(/\/$/, "").replace(/\/index$/, "");
  return normalize(currentPath) === normalize(nodePath);
}

function isPathInSubtree(node: TreeNode, currentPath: string): boolean {
  if (isPathActive(node.path, currentPath)) return true;
  return node.children.some((child) => isPathInSubtree(child, currentPath));
}

interface FolderNodeProps {
  node: TreeNode;
  currentPath: string;
  depth: number;
}

function FolderNode({ node, currentPath, depth }: FolderNodeProps) {
  const isActive = isPathActive(node.path, currentPath);
  const isInSubtree = isPathInSubtree(node, currentPath);
  const [open, setOpen] = useState(isInSubtree);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          asChild={!!node.path}
          className={cn(
            "h-auto w-full justify-start gap-2 px-2 py-1.5 font-medium normal-case tracking-normal",
            isActive && "bg-accent text-accent-foreground",
            depth > 0 && "ml-3",
          )}
        >
          {node.path ? (
            <a href={node.path}>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  open && "rotate-90",
                )}
              />
              <Folder className="size-4 shrink-0 text-primary" />
              <span className="truncate">{node.title || node.displayName}</span>
            </a>
          ) : (
            <>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  open && "rotate-90",
                )}
              />
              <Folder className="size-4 shrink-0 text-primary" />
              <span className="truncate">{node.title || node.displayName}</span>
            </>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-2 border-l border-border pl-1">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.name}
              node={child}
              currentPath={currentPath}
              depth={depth + 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FileNodeProps {
  node: TreeNode;
  currentPath: string;
  depth: number;
}

function FileNode({ node, currentPath, depth }: FileNodeProps) {
  const isActive = isPathActive(node.path, currentPath);
  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "h-auto w-full justify-start gap-2 px-2 py-1.5 text-sm normal-case tracking-normal",
        isActive
          ? "bg-primary/10 text-primary font-medium hover:bg-primary/20 hover:text-primary"
          : "text-muted-foreground",
        depth > 0 && "ml-3",
      )}
    >
      <a href={node.path || "#"}>
        <FileText className="size-4 shrink-0 ml-4" />
        <span className="truncate">{node.title || node.displayName}</span>
      </a>
    </Button>
  );
}

interface TreeNodeComponentProps {
  node: TreeNode;
  currentPath: string;
  depth: number;
}

function TreeNodeComponent({
  node,
  currentPath,
  depth,
}: TreeNodeComponentProps) {
  if (node.isFolder) {
    return <FolderNode node={node} currentPath={currentPath} depth={depth} />;
  }
  return <FileNode node={node} currentPath={currentPath} depth={depth} />;
}

interface NavTreeProps {
  entries: NavEntry[];
  currentPath: string;
}

export default function NavTree({ entries, currentPath }: NavTreeProps) {
  const tree = useMemo(() => buildTree(entries), [entries]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Bar */}
      <NavSearch entries={entries} />

      <ScrollArea className="flex-1">
        <div className="p-3 pt-1 space-y-1">
          {/* Tree */}
          {tree.map((node) => (
            <TreeNodeComponent
              key={node.isFolder ? node.name : node.path}
              node={node}
              currentPath={currentPath}
              depth={0}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
