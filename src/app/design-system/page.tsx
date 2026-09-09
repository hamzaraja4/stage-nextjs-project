"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  LayoutGrid,
  Plus,
  Search,
  X,
} from "lucide-react";

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <div className="container-system py-major-section">
        <div className="mb-section">
          <p className="mb-inline text-label uppercase tracking-[0.12em] text-muted-foreground">
            {number}
          </p>
          <h2 className="text-section-title text-foreground">{title}</h2>
          {description && (
            <p className="mt-inline max-w-2xl text-body text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function TokenCard({
  title,
  value,
  description,
  children,
}: {
  title: string;
  value: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-large border border-border bg-surface p-card">
      {children}
      <div className="mt-component">
        <p className="text-component-title text-foreground">{title}</p>
        <p className="mt-micro font-mono text-small text-muted-foreground">
          {value}
        </p>
        {description && (
          <p className="mt-inline text-small text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ColorSwatch({
  name,
  value,
  className,
}: {
  name: string;
  value: string;
  className: string;
}) {
  return (
    <div className="overflow-hidden rounded-large border border-border bg-surface">
      <div className={`h-28 w-full ${className}`} />
      <div className="p-component">
        <p className="text-body-medium text-foreground">{name}</p>
        <p className="mt-micro font-mono text-small text-muted-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="flex-1">
      {/* Intro */}
      <section className="border-b border-border bg-surface">
        <div className=" py-major-section container mx-auto">
          <div className="max-w-3xl">
            <p className="mb-inline text-label uppercase tracking-[0.12em] text-primary">
              Foundation
            </p>
            <h1 className="text-page-title text-foreground">
              A practical visual language for building consistent interfaces.
            </h1>
            <p className="mt-component max-w-2xl text-body text-muted-foreground">
              This system defines the visual rules used across the product:
              colors, typography, spacing, radius, icons and layout. Components
              should consume these rules rather than introducing their own
              visual values.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto">
        {/* 01 COLORS */}
        <Section
          number="01"
          title="Colors"
          description="Core visual palette used throughout the interface."
        >
          <div className="space-y-section">
            <div>
              <h3 className="mb-component text-component-title">Brand</h3>
              <div className="grid grid-cols-2 gap-component md:grid-cols-3 lg:grid-cols-6">
                <ColorSwatch
                  name="Primary"
                  value="#264DBF"
                  className="bg-primary"
                />
                <ColorSwatch
                  name="Primary Hover"
                  value="#1F41A8"
                  className="bg-primary-hover"
                />
                <ColorSwatch
                  name="Primary Active"
                  value="#19378F"
                  className="bg-primary-active"
                />
                <ColorSwatch
                  name="Primary Light"
                  value="#E8EDFF"
                  className="bg-primary-light"
                />
                <ColorSwatch
                  name="Primary Muted"
                  value="#C9D4FF"
                  className="bg-primary-muted"
                />
                <ColorSwatch
                  name="Primary Foreground"
                  value="#FFFFFF"
                  className="bg-primary-foreground"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-component text-component-title">Neutral</h3>
              <div className="grid grid-cols-2 gap-component md:grid-cols-4 lg:grid-cols-5">
                <ColorSwatch
                  name="Background"
                  value="#F8F9FC"
                  className="bg-background"
                />
                <ColorSwatch
                  name="Foreground"
                  value="#171A24"
                  className="bg-foreground"
                />
                <ColorSwatch
                  name="Surface"
                  value="#FFFFFF"
                  className="bg-surface"
                />
                <ColorSwatch
                  name="Surface Muted"
                  value="#F1F3F8"
                  className="bg-surface-muted"
                />
                <ColorSwatch
                  name="Muted"
                  value="#E7EAF1"
                  className="bg-muted"
                />
                <ColorSwatch
                  name="Muted Foreground"
                  value="#687086"
                  className="bg-muted-foreground"
                />
                <ColorSwatch
                  name="Border"
                  value="#DDE1EA"
                  className="bg-border"
                />
                <ColorSwatch
                  name="Border Strong"
                  value="#C7CCDA"
                  className="bg-border-strong"
                />
                <ColorSwatch
                  name="Input"
                  value="#FFFFFF"
                  className="bg-input"
                />
                <ColorSwatch
                  name="Placeholder"
                  value="#9299AA"
                  className="bg-placeholder"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-component text-component-title">Semantic</h3>
              <div className="grid grid-cols-2 gap-component md:grid-cols-4">
                <ColorSwatch
                  name="Success"
                  value="#15966C"
                  className="bg-success"
                />
                <ColorSwatch
                  name="Success Light"
                  value="#E5F7F0"
                  className="bg-success-light"
                />
                <ColorSwatch
                  name="Warning"
                  value="#D99016"
                  className="bg-warning"
                />
                <ColorSwatch
                  name="Warning Light"
                  value="#FFF4DB"
                  className="bg-warning-light"
                />
                <ColorSwatch
                  name="Danger"
                  value="#D9364F"
                  className="bg-danger"
                />
                <ColorSwatch
                  name="Danger Light"
                  value="#FDE9ED"
                  className="bg-danger-light"
                />
                <ColorSwatch name="Info" value="#267CC7" className="bg-info" />
                <ColorSwatch
                  name="Info Light"
                  value="#E7F2FC"
                  className="bg-info-light"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-component text-component-title">Accent</h3>
              <div className="grid grid-cols-2 gap-component md:grid-cols-4">
                <ColorSwatch
                  name="Accent"
                  value="#7047D9"
                  className="bg-accent"
                />
                <ColorSwatch
                  name="Accent Hover"
                  value="#5E39BD"
                  className="bg-accent-hover"
                />
                <ColorSwatch
                  name="Accent Light"
                  value="#F0EBFF"
                  className="bg-accent-light"
                />
                <ColorSwatch
                  name="Accent Foreground"
                  value="#FFFFFF"
                  className="bg-accent-foreground"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* 02 TYPOGRAPHY */}
        <Section
          number="02"
          title="Typography"
          description="Role-based typography. Each style has a defined purpose within the interface."
        >
          <div className="overflow-hidden rounded-large border border-border bg-surface">
            <div className="grid gap-component border-b border-border p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Page Title</p>
                <p className="mt-micro text-small text-muted-foreground">
                  2rem / 2.5rem / 700
                </p>
              </div>
              <p className="text-page-title">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Main title of a page or primary screen.
              </p>
            </div>

            <div className="grid gap-component border-b border-border p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Section Title</p>
                <p className="mt-micro text-small text-muted-foreground">
                  1.5rem / 2rem / 700
                </p>
              </div>
              <p className="text-section-title">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Title introducing a major section of a page.
              </p>
            </div>

            <div className="grid gap-component border-b border-border p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Component Title</p>
                <p className="mt-micro text-small text-muted-foreground">
                  1rem / 1.5rem / 600
                </p>
              </div>
              <p className="text-component-title">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Titles inside cards, panels, dialogs and components.
              </p>
            </div>

            <div className="grid gap-component border-b border-border p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Body</p>
                <p className="mt-micro text-small text-muted-foreground">
                  0.875rem / 1.25rem / 400
                </p>
              </div>
              <p className="text-body">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Default interface and descriptive text.
              </p>
            </div>

            <div className="grid gap-component border-b border-border p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Body Medium</p>
                <p className="mt-micro text-small text-muted-foreground">
                  0.875rem / 1.25rem / 500
                </p>
              </div>
              <p className="text-body-medium">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Emphasized body text and supporting information.
              </p>
            </div>

            <div className="grid gap-component border-b border-border p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Small / Metadata</p>
                <p className="mt-micro text-small text-muted-foreground">
                  0.75rem / 1rem / 400
                </p>
              </div>
              <p className="text-small">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Secondary information, metadata and supporting labels.
              </p>
            </div>

            <div className="grid gap-component p-card lg:grid-cols-[12rem_1fr_18rem]">
              <div>
                <p className="text-body-medium">Label / Badge</p>
                <p className="mt-micro text-small text-muted-foreground">
                  0.75rem / 1rem / 600
                </p>
              </div>
              <p className="text-label">Aa — Interface Typography</p>
              <p className="text-small text-muted-foreground">
                Labels, compact states and categorical information.
              </p>
            </div>
          </div>
        </Section>

        {/* 03 SPACING */}
        <Section
          number="03"
          title="Spacing"
          description="Adopted spacing values used to establish consistent relationships between interface elements."
        >
          <div className="grid gap-component md:grid-cols-2 lg:grid-cols-3">
            <TokenCard
              title="Micro"
              value="0.25rem"
              description="Icon/text adjustments and compact internal spacing."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-micro rounded-full bg-primary" />
              </div>
            </TokenCard>

            <TokenCard
              title="Inline"
              value="0.5rem"
              description="Spacing between closely related elements."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-inline rounded-full bg-primary" />
              </div>
            </TokenCard>

            <TokenCard
              title="Control"
              value="0.75rem"
              description="Control padding and label/control relationships."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-control rounded-full bg-primary" />
              </div>
            </TokenCard>

            <TokenCard
              title="Component"
              value="1rem"
              description="Default spacing between related UI elements."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-component rounded-full bg-primary" />
              </div>
            </TokenCard>

            <TokenCard
              title="Card"
              value="1.5rem"
              description="Internal spacing for cards and larger containers."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-card rounded-full bg-primary" />
              </div>
            </TokenCard>

            <TokenCard
              title="Section"
              value="2rem"
              description="Separation between groups within a page."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-section rounded-full bg-primary" />
              </div>
            </TokenCard>

            <TokenCard
              title="Major Section"
              value="3rem"
              description="Major page-level section separation."
            >
              <div className="flex h-20 items-center rounded-large bg-surface-muted p-component">
                <div className="h-1 w-major-section rounded-full bg-primary" />
              </div>
            </TokenCard>
          </div>
        </Section>

        {/* 04 RADIUS */}
        <Section
          number="04"
          title="Border Radius"
          description="A four-level radius scale used consistently across the interface."
        >
          <div className="grid gap-component sm:grid-cols-2 lg:grid-cols-4">
            <TokenCard
              title="Small"
              value="0.75rem"
              description="Used for compact UI elements. (Ex: small controls, tags and badges.)"
            >
              <div className="flex h-20 items-center justify-center rounded-small bg-surface-muted">
                <div className="h-12 w-24 rounded-small border-2 border-primary bg-primary-light" />
              </div>
            </TokenCard>

            <TokenCard
              title="Medium"
              value="0.875rem"
              description="Used for standard interactive components. (Ex: buttons, inputs, selects and dropdowns.)"
            >
              <div className="flex h-20 items-center justify-center rounded-small bg-surface-muted">
                <div className="h-12 w-24 rounded-medium border-2 border-primary bg-primary-light" />
              </div>
            </TokenCard>

            <TokenCard
              title="Large"
              value="1rem"
              description="Used for larger containers and surfaces. (Ex: cards, panels and major content blocks.)"
            >
              <div className="flex h-20 items-center justify-center rounded-small bg-surface-muted">
                <div className="h-12 w-24 rounded-large border-2 border-primary bg-primary-light" />
              </div>
            </TokenCard>

            <TokenCard
              title="Full"
              value="9999rem"
              description="Used for fully rounded elements. (Ex: pills, badges, avatars and circular buttons.)"
            >
              <div className="flex h-20 items-center justify-center rounded-small bg-surface-muted">
                <div className="rounded-full border-2 border-primary bg-primary-light px-card py-control text-label text-primary">
                  Rounded Element
                </div>
              </div>
            </TokenCard>
          </div>
        </Section>

        {/* 05 ICONOGRAPHY */}
        <Section
          number="05"
          title="Iconography"
          description="Lucide Icons are the standard icon library across the interface."
        >
          <div className="space-y-section">
            <div className="rounded-large border border-border bg-surface p-card">
              <div className="flex flex-col gap-card lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-component-title">Lucide Icons</p>
                  <p className="mt-inline max-w-xl text-body text-muted-foreground">
                    Use Lucide as the single icon library throughout the
                    product. Avoid mixing icon libraries or introducing custom
                    icons when an equivalent Lucide icon exists.
                  </p>
                </div>
                <div className="flex items-center justify-center rounded-large bg-primary-light p-card">
                  <LayoutGrid
                    className="icon-display text-primary"
                    strokeWidth={1.8}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-component text-component-title">Icon Sizes</h3>
              <div className="grid gap-component sm:grid-cols-2 lg:grid-cols-4">
                <TokenCard
                  title="Small"
                  value="1rem"
                  description="Compact UI and supporting metadata."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <LayoutGrid
                      className="icon-sm text-primary"
                      strokeWidth={1.8}
                    />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Default"
                  value="1.25rem"
                  description="Default interface icons."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <LayoutGrid
                      className="icon-default text-primary"
                      strokeWidth={1.8}
                    />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Large"
                  value="1.5rem"
                  description="Prominent controls and visual indicators."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <LayoutGrid
                      className="icon-lg text-primary"
                      strokeWidth={1.8}
                    />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Display"
                  value="2rem"
                  description="Large visual elements and empty states."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <LayoutGrid
                      className="icon-display text-primary"
                      strokeWidth={1.8}
                    />
                  </div>
                </TokenCard>
              </div>
            </div>

            <div>
              <h3 className="mb-component text-component-title">Stroke</h3>
              <div className="grid gap-component md:grid-cols-2">
                <TokenCard
                  title="Default Stroke"
                  value="1.8"
                  description="Default stroke weight for interface icons."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <Search
                      className="icon-display text-primary"
                      strokeWidth={1.8}
                    />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Strong Stroke"
                  value="2"
                  description="Use when an icon needs stronger visual emphasis."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <Check
                      className="icon-display text-primary"
                      strokeWidth={2}
                    />
                  </div>
                </TokenCard>
              </div>
            </div>

            <div>
              <h3 className="mb-component text-component-title">Icon Color</h3>
              <div className="grid gap-component sm:grid-cols-2 lg:grid-cols-4">
                <TokenCard
                  title="Default"
                  value="Foreground"
                  description="Primary interface actions and navigation."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <Search className="icon-lg text-foreground" />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Muted"
                  value="Muted Foreground"
                  description="Secondary or supporting icons."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted">
                    <Info className="icon-lg text-muted-foreground" />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Primary"
                  value="Primary"
                  description="Selected, active or brand-related icons."
                >
                  <div className="flex h-20 items-center justify-center rounded-large bg-primary-light">
                    <ArrowRight className="icon-lg text-primary" />
                  </div>
                </TokenCard>
                <TokenCard
                  title="Semantic"
                  value="Semantic Colors"
                  description="Only when the icon communicates a system state."
                >
                  <div className="flex items-center justify-center gap-component rounded-large bg-surface-muted py-card">
                    <Check className="icon-default text-success" />
                    <Info className="icon-default text-warning" />
                    <X className="icon-default text-danger" />
                  </div>
                </TokenCard>
              </div>
            </div>

            <div className="rounded-large border border-border bg-surface p-card">
              <h3 className="text-component-title">Icon Rules</h3>
              <div className="mt-component grid gap-component md:grid-cols-2">
                <div className="flex gap-inline rounded-large bg-surface-muted p-component">
                  <Check className="icon-sm shrink-0 text-primary" />
                  <div>
                    <p className="text-body-medium">Use Lucide consistently</p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Use Lucide as the default source for interface icons.
                    </p>
                  </div>
                </div>
                <div className="flex gap-inline rounded-large bg-surface-muted p-component">
                  <Check className="icon-sm shrink-0 text-primary" />
                  <div>
                    <p className="text-body-medium">Prefer clarity</p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Choose the simplest icon that clearly communicates the
                      intended action.
                    </p>
                  </div>
                </div>
                <div className="flex gap-inline rounded-large bg-surface-muted p-component">
                  <Check className="icon-sm shrink-0 text-primary" />
                  <div>
                    <p className="text-body-medium">
                      Keep visual weight consistent
                    </p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Keep stroke weights consistent across the interface.
                    </p>
                  </div>
                </div>
                <div className="flex gap-inline rounded-large bg-surface-muted p-component">
                  <Check className="icon-sm shrink-0 text-primary" />
                  <div>
                    <p className="text-body-medium">
                      Do not use icons as decoration
                    </p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Every interface icon should have a functional or semantic
                      purpose.
                    </p>
                  </div>
                </div>
                <div className="flex gap-inline rounded-large bg-surface-muted p-component">
                  <Check className="icon-sm shrink-0 text-primary" />
                  <div>
                    <p className="text-body-medium">
                      Match surrounding typography
                    </p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Icon size should visually align with the text or control
                      it belongs to.
                    </p>
                  </div>
                </div>
                <div className="flex gap-inline rounded-large bg-surface-muted p-component">
                  <Check className="icon-sm shrink-0 text-primary" />
                  <div>
                    <p className="text-body-medium">
                      Use semantic color intentionally
                    </p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Semantic colors should only communicate a system state.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* 06 LAYOUT */}
        <Section
          number="06"
          title="Layout Rules"
          description="Global rules that define how pages and sections are structured."
        >
          <div className="grid gap-component md:grid-cols-2">
            <TokenCard
              title="Content Container"
              value="80rem"
              description="Keep primary page content within a controlled readable width."
            >
              <div className="flex h-20 items-center justify-center rounded-large bg-surface-muted p-component">
                <div className="w-4/5 rounded-large border border-primary bg-primary-light" />
              </div>
            </TokenCard>
            <TokenCard
              title="Page Padding"
              value="1.5rem mobile / 2.5rem desktop"
              description="Horizontal padding applied to main page content."
            >
              <div className="flex h-20 items-center gap-inline rounded-large bg-surface-muted px-[var(--layout-padding-mobile)] lg:px-[var(--layout-padding-desktop)]">
                <div className="w-6 rounded-large bg-primary-muted" />
                <div className="flex-1 rounded-large bg-primary" />
                <div className="w-6 rounded-large bg-primary-muted" />
              </div>
            </TokenCard>
            <TokenCard
              title="Grid Gap"
              value="1rem"
              description="Default gap between cards and grid-based content."
            >
              <div className="grid h-20 grid-cols-3 gap-component rounded-large bg-surface-muted p-component">
                <div className="rounded-large bg-primary-muted" />
                <div className="rounded-large bg-primary" />
                <div className="rounded-large bg-primary-muted" />
              </div>
            </TokenCard>
            <TokenCard
              title="Section Gap"
              value="2rem"
              description="Default separation between major groups inside a page."
            >
              <div className="flex h-20 flex-col justify-center gap-section rounded-large bg-surface-muted p-component">
                <div className="h-2 rounded-full bg-primary" />
                <div className="h-2 rounded-full bg-primary-muted" />
              </div>
            </TokenCard>
          </div>
        </Section>

        {/* 07 SIZING */}
        <Section
          number="07"
          title="Sizing Principle"
          description="Interactive elements derive their dimensions from content and spacing rather than fixed heights."
        >
          <div className="grid gap-card lg:grid-cols-2">
            <div className="rounded-large border border-border bg-surface p-card">
              <div className="mb-card">
                <p className="text-component-title">Content-driven sizing</p>
                <p className="mt-micro text-small text-muted-foreground">
                  Padding establishes visual size while content determines final
                  dimensions.
                </p>
              </div>

              <div className="space-y-component">
                <div className="flex flex-wrap gap-inline">
                  <button className="rounded-large bg-primary px-component py-control text-body-medium text-primary-foreground">
                    Primary action
                  </button>
                  <button className="rounded-large border border-border bg-surface px-component py-control text-body-medium">
                    Secondary
                  </button>
                </div>

                <div className="flex flex-wrap gap-inline">
                  <span className="rounded-full bg-success-light px-component py-micro text-label text-success-foreground">
                    Active
                  </span>
                  <span className="rounded-full bg-surface-muted px-component py-micro text-label text-muted-foreground">
                    Draft
                  </span>
                </div>

                <div className="flex items-center gap-inline">
                  <div className="flex flex-1 items-center gap-inline rounded-large border border-border bg-surface px-component py-control">
                    <Search className="icon-sm text-placeholder" />
                    <span className="text-body text-placeholder">
                      Search...
                    </span>
                  </div>
                  <button className="rounded-large border border-border px-component py-control text-body">
                    Filter
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-large border border-border bg-surface p-card">
              <p className="text-component-title">Sizing hierarchy</p>
              <div className="mt-card space-y-component">
                <div className="flex gap-component rounded-large bg-muted p-component">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-label text-primary-foreground">
                    1
                  </span>
                  <div>
                    <p className="text-body-medium">Content</p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Text, icon or internal content.
                    </p>
                  </div>
                </div>
                <div className="flex gap-component rounded-large bg-surface-muted p-component">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-label text-primary-foreground">
                    2
                  </span>
                  <div>
                    <p className="text-body-medium">Padding</p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Creates breathing room around content.
                    </p>
                  </div>
                </div>
                <div className="flex gap-component rounded-large bg-surface-muted p-component">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-label text-primary-foreground">
                    3
                  </span>
                  <div>
                    <p className="text-body-medium">Radius</p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Follows the physical scale of the element.
                    </p>
                  </div>
                </div>
                <div className="flex gap-component rounded-large bg-surface-muted p-component">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-label text-primary-foreground">
                    4
                  </span>
                  <div>
                    <p className="text-body-medium">Container</p>
                    <p className="mt-micro text-small text-muted-foreground">
                      Defines available layout space.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-card rounded-large border border-primary-muted bg-primary-light p-card">
            <p className="text-body-medium text-primary-active">
              Global principle
            </p>
            <p className="mt-inline text-body text-primary-active">
              Avoid fixed component heights whenever possible. Use typography,
              padding and spacing tokens to allow controls to adapt naturally to
              their content.
            </p>
          </div>
        </Section>

        {/* 08 VISUAL HIERARCHY */}
        <Section
          number="08"
          title="Visual Hierarchy"
          description="Hierarchy is created through surface contrast, borders, spacing and typography — not shadows."
        >
          <div className="grid gap-component md:grid-cols-3">
            <TokenCard
              title="Surface Contrast"
              value="Surface / Surface Muted"
              description="Use background contrast to distinguish areas without elevation."
            >
              <div className="overflow-hidden rounded-large border border-border">
                <div className="bg-surface p-component">
                  <div className="h-2 w-24 rounded-full bg-border" />
                </div>
                <div className="bg-surface-muted p-component">
                  <div className="h-2 w-32 rounded-full bg-border-strong" />
                </div>
              </div>
            </TokenCard>

            <TokenCard
              title="Borders"
              value="Border / Border Strong"
              description="Use borders to establish structure and separation."
            >
              <div className="rounded-large border border-border bg-surface p-component">
                <div className="rounded-large border border-border-strong p-component">
                  <div className="h-2 w-20 rounded-full bg-border" />
                </div>
              </div>
            </TokenCard>

            <TokenCard
              title="Spacing"
              value="1rem → 3rem"
              description="Use whitespace to establish hierarchy."
            >
              <div className="space-y-component rounded-large bg-surface-muted p-component">
                <div className="h-2 w-28 rounded-full bg-primary" />
                <div className="h-2 w-20 rounded-full bg-border-strong" />
              </div>
            </TokenCard>
          </div>

          <div className="mt-card rounded-large border border-border bg-surface p-card">
            <div className="flex items-start gap-inline">
              <Info className="icon-default shrink-0 text-info" />
              <div>
                <p className="text-body-medium">No shadows</p>
                <p className="mt-micro text-small text-muted-foreground">
                  The interface does not use box shadows. Visual hierarchy is
                  represented through borders, surfaces, spacing and typography.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* 09 SEMANTIC STATES */}
        <Section
          number="09"
          title="Semantic States"
          description="Semantic colors communicate system states consistently across the interface."
        >
          <div className="grid gap-component md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-large border border-border bg-surface p-card">
              <div className="flex items-center gap-inline">
                <Check className="icon-sm text-success" />
                <span className="text-body-medium text-success-foreground">
                  Success
                </span>
              </div>
              <div className="mt-component rounded-large bg-success-light p-component text-small text-success-foreground">
                Operation completed successfully.
              </div>
            </div>

            <div className="rounded-large border border-border bg-surface p-card">
              <div className="flex items-center gap-inline">
                <Info className="icon-sm text-warning" />
                <span className="text-body-medium text-warning-foreground">
                  Warning
                </span>
              </div>
              <div className="mt-component rounded-large bg-warning-light p-component text-small text-warning-foreground">
                This action requires attention.
              </div>
            </div>

            <div className="rounded-large border border-border bg-surface p-card">
              <div className="flex items-center gap-inline">
                <X className="icon-sm text-danger" />
                <span className="text-body-medium text-danger-foreground">
                  Danger
                </span>
              </div>
              <div className="mt-component rounded-large bg-danger-light p-component text-small text-danger-foreground">
                Something requires immediate attention.
              </div>
            </div>

            <div className="rounded-large border border-border bg-surface p-card">
              <div className="flex items-center gap-inline">
                <Info className="icon-sm text-info" />
                <span className="text-body-medium text-info-foreground">
                  Information
                </span>
              </div>
              <div className="mt-component rounded-large bg-info-light p-component text-small text-info-foreground">
                Additional information is available.
              </div>
            </div>
          </div>
        </Section>

        {/* 10 COMPLETE EXAMPLE */}
        <Section
          number="10"
          title="Complete Example"
          description="A practical composition showing how the foundation tokens work together."
        >
          <div className="overflow-hidden rounded-large border border-border bg-surface">
            <div className="border-b border-border p-card">
              <div className="flex flex-wrap items-center justify-between gap-component">
                <div>
                  <p className="text-small text-muted-foreground">Overview</p>
                  <h3 className="mt-micro text-section-title">Dashboard</h3>
                </div>
                <div className="flex flex-wrap gap-inline">
                  <button className="rounded-large border border-border bg-surface px-component py-control text-body-medium">
                    Export
                  </button>
                  <button className="flex items-center gap-inline rounded-large bg-primary px-component py-control text-body-medium text-primary-foreground">
                    Add new
                    <Plus className="icon-sm" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-background p-card">
              <div className="grid gap-component md:grid-cols-3">
                <div className="rounded-large border border-border bg-surface p-card">
                  <p className="text-small text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="mt-inline text-section-title">$48,240</p>
                  <span className="mt-component inline-flex rounded-full bg-success-light px-component py-micro text-label text-success-foreground">
                    +12.5%
                  </span>
                </div>
                <div className="rounded-large border border-border bg-surface p-card">
                  <p className="text-small text-muted-foreground">
                    Active Users
                  </p>
                  <p className="mt-inline text-section-title">12,842</p>
                  <span className="mt-component inline-flex rounded-full bg-success-light px-component py-micro text-label text-success-foreground">
                    +8.2%
                  </span>
                </div>
                <div className="rounded-large border border-border bg-surface p-card">
                  <p className="text-small text-muted-foreground">Conversion</p>
                  <p className="mt-inline text-section-title">7.24%</p>
                  <span className="mt-component inline-flex rounded-full bg-success-light px-component py-micro text-label text-success-foreground">
                    +2.1%
                  </span>
                </div>
              </div>

              <div className="mt-component grid gap-component lg:grid-cols-[1.5fr_1fr]">
                <div className="rounded-large border border-border bg-surface p-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-component-title">Performance</h4>
                      <p className="mt-micro text-small text-muted-foreground">
                        Monthly overview
                      </p>
                    </div>
                    <button className="flex items-center gap-inline rounded-large border border-border px-component py-control text-small">
                      This month
                      <ChevronDown className="icon-sm" />
                    </button>
                  </div>

                  <div className="mt-card flex h-40 items-end gap-inline">
                    <div className="h-[35%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[52%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[42%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[68%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[55%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[76%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[62%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[88%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[72%] flex-1 rounded-small bg-primary-light" />
                    <div className="h-[94%] flex-1 rounded-small bg-primary-light" />
                  </div>
                </div>

                <div className="rounded-large border border-border bg-surface p-card">
                  <div className="flex items-center justify-between">
                    <h4 className="text-component-title">Recent Activity</h4>
                    <button className="text-small font-medium text-primary">
                      View all
                    </button>
                  </div>

                  <div className="mt-card space-y-component">
                    <div className="flex items-center gap-inline">
                      <div className="flex items-center justify-center rounded-small bg-primary-light p-inline">
                        <LayoutGrid className="icon-sm text-primary" />
                      </div>
                      <div>
                        <p className="text-body-medium">New account created</p>
                        <p className="mt-micro text-small text-muted-foreground">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-inline">
                      <div className="flex items-center justify-center rounded-small bg-primary-light p-inline">
                        <LayoutGrid className="icon-sm text-primary" />
                      </div>
                      <div>
                        <p className="text-body-medium">Payment received</p>
                        <p className="mt-micro text-small text-muted-foreground">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-inline">
                      <div className="flex items-center justify-center rounded-small bg-primary-light p-inline">
                        <LayoutGrid className="icon-sm text-primary" />
                      </div>
                      <div>
                        <p className="text-body-medium">Report generated</p>
                        <p className="mt-micro text-small text-muted-foreground">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>
    </main>
  );
}
