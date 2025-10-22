"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionMenu = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    classNames?: {
      group?: string
      separator?: string
      item?: string
      sub?: string
      subTrigger?: string
      subContent?: string
      indicator?: string
    }
    selectedValue?: string | string[]
    matchPath?: (href: string) => boolean
  }
>(({ className, classNames, children, ...props }, ref) => (
        <AccordionPrimitive.Root
    ref={ref}
    className={cn("w-full space-y-1", className)}
          {...props}
        >
          {children}
        </AccordionPrimitive.Root>
))
AccordionMenu.displayName = "AccordionMenu"

const AccordionMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
      {...props}
  />
))
AccordionMenuGroup.displayName = "AccordionMenuGroup"

const AccordionMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
      className
    )}
      {...props}
  />
))
AccordionMenuLabel.displayName = "AccordionMenuLabel"

const AccordionMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("my-2 h-px bg-border", className)}
      {...props}
    />
))
AccordionMenuSeparator.displayName = "AccordionMenuSeparator"

const AccordionMenuItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    variant?: "default" | "active"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
        className={cn(
      "rounded-lg transition-colors",
      variant === "active" && "bg-accent",
      className
    )}
    {...props}
  />
))
AccordionMenuItem.displayName = "AccordionMenuItem"

const AccordionMenuTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: React.ReactNode
  }
>(({ className, children, icon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground [&[data-state=open]>svg]:rotate-90",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionMenuTrigger.displayName = "AccordionMenuTrigger"

const AccordionMenuContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-1 pt-0 pl-6", className)}>{children}</div>
    </AccordionPrimitive.Content>
))
AccordionMenuContent.displayName = "AccordionMenuContent"

const AccordionMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
    icon?: React.ReactNode
  }
>(({ className, children, active, icon, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
      active && "bg-accent text-accent-foreground",
      className
    )}
    {...props}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    <span>{children}</span>
  </a>
))
AccordionMenuLink.displayName = "AccordionMenuLink"

const AccordionMenuIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full",
      className
    )}
      {...props}
    />
))
AccordionMenuIndicator.displayName = "AccordionMenuIndicator"

export {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuItem,
  AccordionMenuTrigger,
  AccordionMenuContent,
  AccordionMenuLink,
  AccordionMenuIndicator,
}
