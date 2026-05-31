import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type MenuContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchorRef: React.RefObject<HTMLElement> | null;
};

const MenuContext = createContext<MenuContextType | null>(null);

export function ContextMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const value = React.useMemo(() => ({ open, setOpen, anchorRef }), [open, setOpen]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function ContextMenuTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = useContext(MenuContext);
  if (!ctx) return <>{children}</>;
  return (
    <div
      ref={(node) => {
        ctx.anchorRef.current = node;
      }}
      className={className}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        ctx.setOpen(true);
      }}
      onClick={(e) => {
        e.stopPropagation();
        ctx.setOpen(false);
      }}
    >
      {children}
    </div>
  );
}

export function ContextMenuContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = useContext(MenuContext);
  const [mounted, setMounted] = useState(false);

  // keep a ref to the latest context so our document listener can close the
  // most-recent menu without forcing this effect to re-run on every render.
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  });

  useEffect(() => {
    function handleDocClick() {
      ctxRef.current?.setOpen(false);
    }
    document.addEventListener("click", handleDocClick);
    setMounted(true);
    return () => document.removeEventListener("click", handleDocClick);
    // run once on mount; listener reads current ctx via ref
  }, []);

  if (!ctx) return null;
  if (!ctx.open) return null;

  const anchor = ctx.anchorRef?.current;
  const parent = anchor?.parentElement ?? null;

  const menu = (
    <div className={className + " absolute right-3 top-full mt-2 z-50 rounded-md bg-[#0b0b0b] p-1 shadow-lg"} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );

  if (parent && mounted) {
    return createPortal(menu, parent);
  }
  return menu;
}

export function ContextMenuGroup({ children }: { children: React.ReactNode }) {
  return <div className="p-1">{children}</div>;
}

export function ContextMenuItem({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className="w-full text-left px-3 py-2 text-sm hover:bg-white/5"
    >
      {children}
    </button>
  );
}

export function ContextMenuShortcut({ children }: { children: React.ReactNode }) {
  return <span className="ml-2 text-xs text-muted">{children}</span>;
}

// No-ops for API parity with example
export function ContextMenuCheckboxItem({ children, checked }: { children: React.ReactNode; checked?: boolean }) {
  return (
    <div className="flex items-center px-3 py-2 text-sm">
      <input aria-label="toggle" type="checkbox" checked={!!checked} readOnly className="mr-2" />
      <div>{children}</div>
    </div>
  );
}

export function ContextMenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1 text-xs text-muted">{children}</div>;
}

export function ContextMenuSeparator() {
  return <div className="my-1 h-px bg-white/5" />;
}

export function ContextMenuSub({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function ContextMenuSubTrigger({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function ContextMenuSubContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function ContextMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function ContextMenuRadioItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default ContextMenu;
