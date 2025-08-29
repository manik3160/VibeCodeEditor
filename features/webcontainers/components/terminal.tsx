"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import "xterm/css/xterm.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  webcontainerUrl?: string;
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: any;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
}

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(
  ({ webcontainerUrl, className, theme = "dark", webContainerInstance }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<any>(null);
    const fitAddon = useRef<any>(null);
    const searchAddon = useRef<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // Dynamically import xterm only on client
    const initializeTerminal = useCallback(async () => {
      if (!terminalRef.current || term.current) return;

      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");
      const { WebLinksAddon } = await import("xterm-addon-web-links");
      const { SearchAddon } = await import("xterm-addon-search");

      const terminal = new Terminal({
        cursorBlink: true,
        fontFamily: '"Fira Code", monospace',
        fontSize: 14,
        theme: {
          background: theme === "dark" ? "#09090B" : "#FFFFFF",
          foreground: theme === "dark" ? "#FAFAFA" : "#18181B",
        },
      });

      const fitAddonInstance = new FitAddon();
      const searchAddonInstance = new SearchAddon();

      terminal.loadAddon(fitAddonInstance);
      terminal.loadAddon(new WebLinksAddon());
      terminal.loadAddon(searchAddonInstance);

      terminal.open(terminalRef.current);

      fitAddon.current = fitAddonInstance;
      searchAddon.current = searchAddonInstance;
      term.current = terminal;

      setTimeout(() => fitAddonInstance.fit(), 100);

      terminal.writeln("🚀 WebContainer Terminal");
      terminal.write("\r\n$ ");
    }, [theme]);

    useImperativeHandle(ref, () => ({
      writeToTerminal: (data: string) => {
        if (term.current) term.current.write(data);
      },
      clearTerminal: () => {
        if (term.current) {
          term.current.clear();
          term.current.writeln("🚀 WebContainer Terminal");
          term.current.write("\r\n$ ");
        }
      },
      focusTerminal: () => {
        term.current?.focus();
      },
    }));

    useEffect(() => {
      initializeTerminal();
    }, [initializeTerminal]);

    return (
      <div
        className={cn(
          "flex flex-col h-full bg-background border rounded-lg overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">WebContainer Terminal</span>
          <div className="flex items-center gap-1">
            {showSearch && (
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchAddon.current?.findNext(e.target.value);
                }}
                className="h-6 w-32 text-xs"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="h-6 w-6 p-0"
            >
              <Search className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigator.clipboard.writeText(term.current?.getSelection() ?? "")
              }
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (term.current) term.current.clear();
              }}
              className="h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex-1 relative">
          <div ref={terminalRef} className="absolute inset-0 p-2" />
        </div>
      </div>
    );
  }
);

TerminalComponent.displayName = "TerminalComponent";

export default TerminalComponent;
