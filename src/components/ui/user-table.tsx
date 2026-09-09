"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Icon, { type IconName } from "./icon";
import ClickableButton from "./button";


export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
  sortFn?: (a: T, b: T) => number;
}

/** Action entry displayed inside the card action menus (mobile card view). */
export interface CardAction {
  label: string;
  icon?: IconName;
  /** Destructive action styling. */
  danger?: boolean;
  /** Pre-rendered node used as the whole menu item. Used when an action is
   *  derived from the table itself (e.g. the action column cell); it replaces
   *  `label`/`icon` and keeps its own interactivity. */
  content?: ReactNode;
  onSelect: () => void;
}


export interface UserTableCardActions<T> {
  /** Global table actions. */
  table?: CardAction[];

  selectAll?: CardAction;
  /** Actions specific to each row. */
  row?: (row: T) => CardAction[];
}

export interface UserTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
  emptyMessage?: string;
  getRowKey?: (row: T, index: number) => React.Key;

  cardVisiblePairs?: number;
  /** Déclare des actions pour la vue carte (sous `md`) — voir
   *  `UserTableCardActions`. Optionnel : sans `cardActions.row`, l'action de
   *  la dernière colonne sans libellé (ex. bouton « Voir ») est réutilisée
   *  automatiquement dans le menu 3 points de chaque carte. */
  cardActions?: UserTableCardActions<T>;

  selectedKeys?: Set<React.Key> | null;
  onToggleSelect?: ((rowKey: React.Key) => void) | null;
  className?: string;
  /** When true, the table is transposed: the first column shows row labels and
   *  each subsequent column represents one item from `data`. The first column
   *  header uses `transposeLabel` (or the first column's label), and each
   *  remaining column header is rendered via `transposeHeader` if provided. */
  transpose?: boolean;
  /** Label for the first column (row headers) when `transpose` is true. */
  transposeLabel?: string;
  /** Renders the header for each data column when `transpose` is true. */
  transposeHeader?: (item: T) => React.ReactNode;
}

type SortDirection = "asc" | "desc";

function defaultCompare<T>(a: T, b: T, key: keyof T): number {
  const aValue = a[key];
  const bValue = b[key];

  if (typeof aValue === "number" && typeof bValue === "number") {
    return aValue - bValue;
  }

  const aString = aValue == null ? "" : String(aValue);
  const bString = bValue == null ? "" : String(bValue);

  return aString.localeCompare(bString, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

interface CardActionsMenuProps {
  /** Global table actions (group "Tableau"). */
  tableActions: CardAction[];
  /** Row-specific actions (group "Cette ligne"). */
  rowActions: CardAction[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  /** Icon-only 3-dot trigger (card header) or labeled trigger (toolbars). */
  trigger: "kebab" | "labeled";
  /** Panel placement: below the trigger (default) or above it (bottom toolbar). */
  direction?: "down" | "up";
}


function CardActionsMenu({
  tableActions,
  rowActions,
  open,
  onToggle,
  onClose,
  trigger,
  direction = "down",
}: CardActionsMenuProps) {
  const hasGroups = tableActions.length > 0 && rowActions.length > 0;

  const renderGroup = (actions: CardAction[]) =>
    actions.map((action, index) =>
      action.content ? (
        // Action dérivée d'une colonne du tableau : le nœud rendu (ex. bouton
        // « Voir ») est l'élément interactif ; le clic ferme le menu (bulle).
        <div
          key={action.label || `derived-${index}`}
          onClick={onClose}
          className="rounded-small focus-within:ring-primary"
        >
          {action.content}
        </div>
      ) : (
        <button
          key={action.label}
          type="button"
          role="menuitem"
          onClick={() => {
            onClose();
            action.onSelect();
          }}
          className={`flex items-center gap-inline whitespace-nowrap rounded-small px-component py-control text-left text-body-medium transition-colors hover:bg-surface-muted focus-visible:ring-primary ${
            action.danger ? "text-danger" : "text-foreground"
          }`}
        >
          {action.icon && (
            <Icon
              name={action.icon}
              size="small"
              variant={action.danger ? "danger" : "muted"}
              aria-hidden="true"
            />
          )}
          {action.label}
        </button>
      ),
    );

  return (
    <div className="relative">
      {trigger === "kebab" ? (
        <ClickableButton
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Plus d'actions"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={onToggle}
          className="text-muted-foreground hover:text-primary focus-visible:ring-primary"
        >
          <Icon name="EllipsisVertical" aria-hidden="true" />
        </ClickableButton>
      ) : (
        <ClickableButton
          type="button"
          variant="secondary"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={onToggle}
          leftIcon={<Icon name="EllipsisVertical" size="small" />}
        >
          Actions
          <Icon
            name="ChevronDown"
            size="small"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </ClickableButton>
      )}
      {open && (
        <>
          {/* Backdrop : ferme le menu au tap extérieur. */}
          <button
            type="button"
            aria-label="Fermer le menu"
            tabIndex={-1}
            onClick={onClose}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className={`absolute right-0 z-50 flex min-w-[10rem] max-w-[16rem] flex-col rounded-medium border border-border bg-surface shadow-lg ${
              direction === "up" ? "bottom-full mb-micro" : "top-full mt-micro"
            }`}
          >
            {hasGroups && (
              <p className="px-component pt-micro text-label text-muted-foreground">
                Tableau
              </p>
            )}
            {renderGroup(tableActions)}
            {hasGroups && <div className="mx-component my-micro h-px bg-border" />}
            {hasGroups && (
              <p className="px-component pt-micro text-label text-muted-foreground">
                Cette ligne
              </p>
            )}
            {renderGroup(rowActions)}
          </div>
        </>
      )}
    </div>
  );
}


export default function UserTable<T extends object>({
  columns,
  data,
  rowsPerPage = 8,
  emptyMessage = "Aucune donnée trouvée.",
  getRowKey = (_row, index) => index,
  cardVisiblePairs = 6,
  cardActions,
  selectedKeys = null,
  onToggleSelect = null,
  className,
  transpose = false,
  transposeLabel,
  transposeHeader,
}: UserTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  // Vue carte (sous `md`) : clés des lignes dont la carte est dépliée
  // (toutes les paires label/valeur révélées par la bascule « Voir tout »).
  const [expandedCards, setExpandedCards] = useState<Set<React.Key>>(new Set());
  // Menus d'actions des cartes enrichies : un seul menu ouvert à la fois
  // (règle knowledge-base/components/dropdowns.mdc).
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;

    const column = columns.find((c) => String(c.key) === sortKey);
    if (!column) return 0;

    const comparison = column.sortFn
      ? column.sortFn(a, b)
      : defaultCompare(a, b, column.key);

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const visibleData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (column: Column<T>) => {
    const key = String(column.key);
    if (key === sortKey) {
      setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const toggleCard = (rowKey: React.Key) => {
    setExpandedCards((previous) => {
      const next = new Set(previous);
      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }
      return next;
    });
  };

  const toggleMenu = (key: string) =>
    setOpenMenu((current) => (current === key ? null : key));

  const getCellValue = (row: T, column: Column<T>): ReactNode => {
    if (column.render) return column.render(row);
    const value = row[column.key];
    if (value == null) return "";
    if (typeof value === "object") return String(value);
    return value as ReactNode;
  };

  // Actions de ligne du menu carte : celles déclarées par la page
  // (`cardActions.row`) priment ; sinon la cellule de la colonne d'action
  // (dernière colonne sans libellé) est réutilisée telle quelle dans le menu,
  // pour que chaque tableau expose ses actions sans configuration par page.
  const resolveRowActions = (row: T): CardAction[] => {
    if (cardActions?.row) return cardActions.row(row);
    if (!actionColumn?.render) return [];
    const cell = getCellValue(row, actionColumn);
    if (cell == null || cell === false || cell === "") return [];
    return [{ label: "", content: cell, onSelect: () => {} }];
  };

  // Colonnes spéciales utilisées par la vue carte (sous `md`).
  const emptyLabelColumns = columns.filter(
    (column) => column.label.trim() === "",
  );
  const titleColumn =
    columns.find((column) => column.label.trim() !== "") ?? columns[0];
  const headerControlColumn =
    emptyLabelColumns.length > 1 ? emptyLabelColumns[0] : undefined;
  const actionColumn = emptyLabelColumns[emptyLabelColumns.length - 1] ?? undefined;
  const contentColumns = columns.filter(
    (column) =>
      column !== titleColumn &&
      column !== headerControlColumn &&
      column !== actionColumn,
  );

  // Vue carte (sous `md`) : cartes visuellement séparées, sélection à gauche,
  // menu 3 points par carte et dropdowns « Actions » au-dessus et en dessous
  // de la liste ; « tout sélectionner » sort des menus et devient un bouton
  // dédié à côté de ces dropdowns. Menus et barres ne s'affichent que s'il y
  // a au moins une action à montrer.
  const tableActions = cardActions?.table ?? [];
  const selectAllAction = cardActions?.selectAll;
  // État « toutes les lignes sont sélectionnées » : pilote l'état enfoncé
  // (aria-pressed) du bouton « tout sélectionner » dédié ; la bascule
  // (second clic = désélection) est implémentée par la page dans `onSelect`.
  const allSelected =
    data.length > 0 &&
    data.every((row, index) => selectedKeys?.has(getRowKey(row, index)) ?? false);
  // Bouton de sélection automatique sur les cartes dès qu'il y a des actions
  // globales (ou un « tout sélectionner » dédié) et que la page fournit le
  // toggle de sélection.
  const hasSelectionControl =
    onToggleSelect !== null &&
    (tableActions.length > 0 || selectAllAction !== undefined);

  const SortIcon = () => (
    <Icon name="ChevronsUpDown" aria-hidden="true" />
  );

  const SortableHeader = ({ column }: { column: Column<T> }) => (
    <th className="text-left">
      <ClickableButton
        type="button"
        variant="bare"
        onClick={() => handleSort(column)}
        className="px-component py-control text-muted-foreground transition-colors hover:text-primary focus-visible:ring-primary"
      >
        <span className="text-label">{column.label}</span>
        <SortIcon />
      </ClickableButton>
    </th>
  );

  return (
    <div className={`flex flex-col overflow-hidden rounded-large border border-border bg-surface md:h-full ${className ?? ""}`}>
      <div className="hidden flex-1 overflow-auto md:flex">
        <table className="w-full border-collapse text-body">
          {transpose ? (
            <>
              <thead className="sticky top-0 z-10 bg-surface-muted">
                <tr className="border-b border-border">
                  <th className="px-component py-control text-left text-label text-muted-foreground">
                    {transposeLabel ?? columns[0]?.label ?? ""}
                  </th>
                  {data.map((item, i) => (
                    <th key={i} className="px-component py-control text-left">
                      {transposeHeader ? transposeHeader(item) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={1} className="px-component py-section text-center text-muted-foreground">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  columns.slice(1).map((column) => (
                    <tr key={String(column.key)} className="border-t border-border">
                      <td className="px-component py-control text-label text-muted-foreground">
                        {column.label}
                      </td>
                      {data.map((item, i) => (
                        <td
                          key={i}
                          className={`px-component py-control ${
                            column.className ?? "text-body-medium text-foreground"
                          }`}
                        >
                          {getCellValue(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead className="sticky top-0 z-10 bg-surface-muted">
                <tr className="border-b border-border">
                  {columns.map((column) =>
                    column.sortable ? (
                      <SortableHeader
                        key={String(column.key)}
                        column={column}
                      />
                    ) : (
                      <th
                        key={String(column.key)}
                        className="px-component py-control text-left text-label text-muted-foreground"
                      >
                        {column.label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {visibleData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-component py-section text-center text-muted-foreground"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  visibleData.map((row, rowIndex) => (
                    <tr
                      key={getRowKey(row, startIndex + rowIndex)}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-muted"
                    >
                      {columns.map((column) => (
                        <td
                          key={String(column.key)}
                          className={`px-component py-control ${
                            column.className ?? "text-body-medium text-foreground"
                          }`}
                        >
                          {getCellValue(row, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </>
          )}
        </table>
      </div>


      <div className="md:hidden">
        {visibleData.length === 0 ? (
          <div className="px-component py-section text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="flex flex-col gap-component p-component">
            {(tableActions.length > 0 || selectAllAction) && (
              <div className="flex items-center justify-end gap-inline">
                {selectAllAction && (
                  <ClickableButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    aria-pressed={allSelected}
                    onClick={selectAllAction.onSelect}
                    leftIcon={
                      selectAllAction.icon ? (
                        <Icon
                          name={selectAllAction.icon}
                          size="small"
                          variant={allSelected ? "primary" : "muted"}
                          aria-hidden="true"
                        />
                      ) : undefined
                    }
                  >
                    {selectAllAction.label}
                  </ClickableButton>
                )}
                {tableActions.length > 0 && (
                  <CardActionsMenu
                    trigger="labeled"
                    direction="down"
                    tableActions={tableActions}
                    rowActions={[]}
                    open={openMenu === "actions-top"}
                    onToggle={() => toggleMenu("actions-top")}
                    onClose={() => setOpenMenu(null)}
                  />
                )}
              </div>
            )}
            {visibleData.map((row, rowIndex) => {
              const rowKey = getRowKey(row, startIndex + rowIndex);
              const pairLimit = Math.max(1, cardVisiblePairs);
              const isExpanded = expandedCards.has(rowKey);
              const collapsible = contentColumns.length > pairLimit;
              const visiblePairs =
                collapsible && !isExpanded
                  ? contentColumns.slice(0, pairLimit)
                  : contentColumns;
              const rowActions = resolveRowActions(row);
              const menuKey = `card:${String(rowKey)}`;

              return (
                <article
                  key={rowKey}
                  className="flex flex-col overflow-hidden rounded-large border border-border bg-surface"
                >
                  {/* Barre de titre — mêmes couleurs que l'en-tête du tableau. */}
                  <div className="flex items-center gap-inline bg-surface-muted px-component py-control">
                    {hasSelectionControl ? (
                      <button
                        type="button"
                        onClick={() => onToggleSelect?.(rowKey)}
                        aria-pressed={selectedKeys?.has(rowKey) ?? false}
                        aria-label={
                          selectedKeys?.has(rowKey)
                            ? "Retirer la sélection"
                            : "Sélectionner"
                        }
                        className="grid size-8 shrink-0 place-items-center rounded-small text-muted-foreground transition-colors hover:text-primary focus-visible:ring-primary"
                      >
                        <Icon
                          name={selectedKeys?.has(rowKey) ? "SquareCheck" : "Square"}
                          size="default"
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      headerControlColumn && (
                        <div className="shrink-0">{getCellValue(row, headerControlColumn)}</div>
                      )
                    )}
                    <p className="min-w-0 flex-1 text-component-title text-foreground">
                      {getCellValue(row, titleColumn)}
                    </p>
                    {(tableActions.length > 0 || rowActions.length > 0) && (
                      <CardActionsMenu
                        trigger="kebab"
                        tableActions={tableActions}
                        rowActions={rowActions}
                        open={openMenu === menuKey}
                        onToggle={() => toggleMenu(menuKey)}
                        onClose={() => setOpenMenu(null)}
                      />
                    )}
                  </div>

                  {/* Lignes label/valeur — même style que les lignes du tableau. */}
                  {visiblePairs.map((column) => (
                    <div
                      key={String(column.key)}
                      className="flex items-center justify-between gap-inline border-t border-border px-component py-control"
                    >
                      <span className="shrink-0 text-label text-muted-foreground">
                        {column.label}
                      </span>
                      <span className="min-w-0 text-right text-body-medium text-foreground">
                        {getCellValue(row, column)}
                      </span>
                    </div>
                  ))}

                  {collapsible && (
                    <div className="border-t border-border px-component py-control">
                      <ClickableButton
                        type="button"
                        variant="bare"
                        onClick={() => toggleCard(rowKey)}
                        aria-expanded={isExpanded}
                        className="flex items-center gap-micro text-small text-primary transition-colors hover:text-primary focus-visible:ring-primary"
                      >
                        <Icon
                          name="ChevronDown"
                          aria-hidden="true"
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                        {isExpanded
                          ? "Réduire"
                          : `Voir tout (+${contentColumns.length - pairLimit})`}
                      </ClickableButton>
                    </div>
                  )}

                  {actionColumn && rowActions.length === 0 && (
                    <div className="flex justify-end border-t border-border px-component py-control">
                      {getCellValue(row, actionColumn)}
                    </div>
                  )}
                </article>
              );
            })}
            {(tableActions.length > 0 || selectAllAction) && (
              <div className="flex items-center justify-end gap-inline">
                {selectAllAction && (
                  <ClickableButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    aria-pressed={allSelected}
                    onClick={selectAllAction.onSelect}
                    leftIcon={
                      selectAllAction.icon ? (
                        <Icon
                          name={selectAllAction.icon}
                          size="small"
                          variant={allSelected ? "primary" : "muted"}
                          aria-hidden="true"
                        />
                      ) : undefined
                    }
                  >
                    {selectAllAction.label}
                  </ClickableButton>
                )}
                {tableActions.length > 0 && (
                  <CardActionsMenu
                    trigger="labeled"
                    direction="up"
                    tableActions={tableActions}
                    rowActions={[]}
                    open={openMenu === "actions-bottom"}
                    onToggle={() => toggleMenu("actions-bottom")}
                    onClose={() => setOpenMenu(null)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border bg-surface px-component py-control">
          <p className="text-small text-muted-foreground">
            {startIndex + 1}–{Math.min(startIndex + rowsPerPage, sortedData.length)} sur{" "}
            {sortedData.length}
          </p>
          <div className="flex items-center gap-inline">
            <ClickableButton
              type="button"
              variant="bare"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="rounded-medium border border-border p-inline text-muted-foreground transition-colors hover:text-primary disabled:opacity-50 focus-visible:ring-primary"
              aria-label="Page précédente"
            >
              <Icon name="ChevronLeft" aria-hidden="true" />
            </ClickableButton>
            <span className="text-small text-muted-foreground">
              {safePage} / {totalPages}
            </span>
            <ClickableButton
              type="button"
              variant="bare"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="rounded-medium border border-border p-inline text-muted-foreground transition-colors hover:text-primary disabled:opacity-50 focus-visible:ring-primary"
              aria-label="Page suivante"
            >
              <Icon name="ChevronRight" aria-hidden="true" />
            </ClickableButton>
          </div>
        </div>
      )}
    </div>
  );
}