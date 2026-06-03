import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const DrawerContext = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Drawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <DrawerContext.Provider value={{ open, setOpen }}>{children}</DrawerContext.Provider>;
}

export function DrawerTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const ctx = useContext(DrawerContext);
  if (!ctx) return <>{children}</>;
  const child = React.Children.only(children) as React.ReactElement<{ onClick?: (e: any) => void }>;
  const element = asChild ? child : <button type="button">{child}</button>;
  return React.cloneElement(element, {
    onClick: (e: any) => {
      e?.stopPropagation();
      ctx.setOpen(true);
      if (child.props.onClick) child.props.onClick(e);
    },
  });
}

export function DrawerContent({ children }: { children: React.ReactNode }) {
  const ctx = useContext(DrawerContext);
  if (!ctx) return null;
  if (!ctx.open) return null;
  return createPortal(
    <div className="fixed right-0 top-0 z-60 h-full w-full max-w-md bg-[#0b0b0b] shadow-2xl">
      <div className="p-4">{children}</div>
    </div>,
    document.body,
  );
}

export function DrawerClose({ children }: { children: React.ReactNode; asChild?: boolean }) {
  const ctx = useContext(DrawerContext);
  if (!ctx) return <>{children}</>;
  const child = React.Children.only(children) as React.ReactElement<{ onClick?: (e: any) => void }>;
  return React.cloneElement(child, {
    onClick: (e: any) => {
      e?.stopPropagation();
      ctx.setOpen(false);
      if (child.props.onClick) child.props.onClick(e);
    },
  });
}

export function DrawerHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DrawerTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-semibold">{children}</h3>;
}

export function DrawerDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}

export function DrawerFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6">{children}</div>;
}

export default Drawer;
