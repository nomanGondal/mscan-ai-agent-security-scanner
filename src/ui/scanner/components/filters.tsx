"use client";

import React, { useState, useMemo } from "react";
import { ScanResult, Vulnerability } from "@/services/scanner";
import { cn } from "@/utiils";
import { ChevronDown, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanType = "mcp_ast" | "pyre_typing" | "pysa_taint";
type Severity = "critical" | "high" | "medium" | "low";

export type FilterState = {
  scanTypes: Set<ScanType>;
  severities: Set<Severity>;
  mcpRules: Set<string>;
};

type ScanFiltersProps = {
  scanResults: ScanResult | null;
  onFilterChange: (filtered: Vulnerability[]) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SCAN_TYPE_LABELS: Record<ScanType, string> = {
  mcp_ast: "MCP / AST",
  pyre_typing: "Pyre",
  pysa_taint: "Pysa",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#E05252",
  high: "#D97757",
  medium: "#7C6AF7",
  low: "#52A878",
};

const ALL_MCP_RULES = [
  "CODE_INJECTION",
  "COMMAND_INJECTION",
  "PROMPT_INJECTION",
  "DESERIALIZATION",
  "SSRF",
  "HARDCODED_SECRET",
  "HARDCODED_OPENAI_KEY",
  "HARDCODED_BEARER_TOKEN",
  "SHELL_INJECTION",
  "ARBITRARY_CODE_EXECUTION",
  "DYNAMIC_IMPORT",
  "UNSAFE_DESERIALIZATION",
  "SCHEMA_EXPOSURE",
  "EXCESSIVE_TOOL_SCOPE",
  "TOOL_TRUST_BOUNDARY",
  "FILE_SYSTEM_ACCESS",
];

const MCP_RULE_LABELS: Record<string, string> = {
  CODE_INJECTION: "Code Injection",
  COMMAND_INJECTION: "Command Injection",
  PROMPT_INJECTION: "Prompt Injection",
  DESERIALIZATION: "Deserialization",
  SSRF: "SSRF",
  HARDCODED_SECRET: "Hardcoded Secret",
  HARDCODED_OPENAI_KEY: "OpenAI Key",
  HARDCODED_BEARER_TOKEN: "Bearer Token",
  SHELL_INJECTION: "Shell Injection",
  ARBITRARY_CODE_EXECUTION: "Arbitrary Code Exec",
  DYNAMIC_IMPORT: "Dynamic Import",
  UNSAFE_DESERIALIZATION: "Unsafe Deserialize",
  SCHEMA_EXPOSURE: "Schema Exposure",
  EXCESSIVE_TOOL_SCOPE: "Excessive Tool Scope",
  TOOL_TRUST_BOUNDARY: "Tool Trust Boundary",
  FILE_SYSTEM_ACCESS: "Filesystem Access",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAnalysisStage(vuln: Vulnerability): ScanType | "unknown" {
  return (vuln.analysisStage as ScanType) ?? "unknown";
}

function getMcpRule(vuln: Vulnerability): string | null {
  // Your Vulnerability type may use `rule` or `type` — adjust as needed
  return (vuln as any).rule ?? null;
}

function countByScanType(vulns: Vulnerability[], type: ScanType): number {
  return vulns.filter((v) => getAnalysisStage(v) === type).length;
}

function countBySeverity(vulns: Vulnerability[], severity: Severity): number {
  return vulns.filter((v) => v.severity?.toLowerCase() === severity).length;
}

function countByRule(vulns: Vulnerability[], rule: string): number {
  return vulns.filter((v) => getMcpRule(v) === rule).length;
}

function applyFilters(
  vulns: Vulnerability[],
  filters: FilterState,
): Vulnerability[] {
  const allScanTypesOff = filters.scanTypes.size === 0;
  const allSeveritiesOff = filters.severities.size === 0;
  const allRulesOff = filters.mcpRules.size === 0;

  return vulns.filter((v) => {
    // Scan type filter
    if (!allScanTypesOff) {
      const stage = getAnalysisStage(v);
      if (stage === "unknown") {
        // unknown stage: show only if at least one scan type is selected
      } else if (!filters.scanTypes.has(stage as ScanType)) {
        return false;
      }
    }

    // Severity filter
    if (!allSeveritiesOff) {
      const sev = v.severity?.toLowerCase() as Severity;
      if (!filters.severities.has(sev)) return false;
    }

    // MCP rule filter (only applies to mcp_ast findings with a rule)
    if (!allRulesOff) {
      const rule = getMcpRule(v);
      if (rule && !filters.mcpRules.has(rule)) return false;
    }

    return true;
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type FilterGroupProps = {
  label: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  count,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#3A3A38] last:border-b-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#2A2A29]"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9B9B99]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <span className="text-[11px] text-[#6B6B69]">{count}</span>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-[#6B6B69] transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
};

type FilterCheckboxProps = {
  label: string;
  count: number;
  checked: boolean;
  color?: string;
  onChange: (checked: boolean) => void;
};

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  count,
  checked,
  color,
  onChange,
}) => {
  return (
    <label className="group flex cursor-pointer items-center gap-3 px-4 py-1.5 transition hover:bg-[#2A2A29]">
      {/* Custom checkbox */}
      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            "h-4 w-4 rounded-[3px] border transition-all duration-150",
            checked
              ? "border-transparent"
              : "border-[#3A3A38] bg-transparent group-hover:border-[#6B6B69]",
          )}
          style={checked ? { backgroundColor: color ?? "#D97757" } : undefined}
        />
        {checked && (
          <svg
            className="pointer-events-none absolute h-2.5 w-2.5 text-white"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <span
        className={cn(
          "flex-1 text-sm transition-colors",
          checked
            ? "text-[#EDEDEC]"
            : "text-[#9B9B99] group-hover:text-[#EDEDEC]",
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          "text-xs tabular-nums transition-colors",
          checked ? "text-[#9B9B99]" : "text-[#6B6B69]",
        )}
      >
        {count}
      </span>
    </label>
  );
};

export const ScanFilters: React.FC<ScanFiltersProps> = ({
  scanResults,
  onFilterChange,
}) => {
  const allVulns = scanResults?.vulnerabilities ?? [];

  const [filters, setFilters] = useState<FilterState>({
    scanTypes: new Set(),
    severities: new Set(),
    mcpRules: new Set(),
  });

  const activeFilterCount =
    filters.scanTypes.size + filters.severities.size + filters.mcpRules.size;

  // Only show MCP rules that actually appear in results
  const presentRules = useMemo(() => {
    const rules = new Set<string>();
    for (const v of allVulns) {
      const rule = getMcpRule(v);
      if (rule) rules.add(rule);
    }
    return ALL_MCP_RULES.filter((r) => rules.has(r));
  }, [allVulns]);

  // Recompute filtered list whenever filters or results change
  const filteredVulns = useMemo(() => {
    const result = applyFilters(allVulns, filters);
    return result;
  }, [allVulns, filters]);

  // Notify parent of filter changes
  React.useEffect(() => {
    onFilterChange(filteredVulns);
  }, [filteredVulns, onFilterChange]);

  const toggleScanType = (type: ScanType, checked: boolean) => {
    setFilters((prev) => {
      const next = new Set(prev.scanTypes);
      checked ? next.add(type) : next.delete(type);
      return { ...prev, scanTypes: next };
    });
  };

  const toggleSeverity = (sev: Severity, checked: boolean) => {
    setFilters((prev) => {
      const next = new Set(prev.severities);
      checked ? next.add(sev) : next.delete(sev);
      return { ...prev, severities: next };
    });
  };

  const toggleRule = (rule: string, checked: boolean) => {
    setFilters((prev) => {
      const next = new Set(prev.mcpRules);
      checked ? next.add(rule) : next.delete(rule);
      return { ...prev, mcpRules: next };
    });
  };

  const clearAll = () => {
    setFilters({
      scanTypes: new Set(),
      severities: new Set(),
      mcpRules: new Set(),
    });
  };

  if (!scanResults) return null;

  return (
    <aside className="w-[260px] shrink-0 rounded-xl border border-[#3A3A38] bg-[#1F1F1E] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3A3A38] px-4 py-3">
        <span className="text-sm font-semibold text-[#EDEDEC]">Filters</span>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#9B9B99] transition hover:bg-[#2A2A29] hover:text-[#EDEDEC]"
          >
            <X className="h-3 w-3" />
            Clear {activeFilterCount}
          </button>
        )}
      </div>

      {/* Scrollable filter area */}
      <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
        {/* Scan Type */}
        <FilterGroup label="Scan Type">
          {(["mcp_ast", "pyre_typing", "pysa_taint"] as ScanType[]).map(
            (type) => (
              <FilterCheckbox
                key={type}
                label={SCAN_TYPE_LABELS[type]}
                count={countByScanType(allVulns, type)}
                checked={filters.scanTypes.has(type)}
                color="#D97757"
                onChange={(checked) => toggleScanType(type, checked)}
              />
            ),
          )}
        </FilterGroup>

        {/* Severity */}
        <FilterGroup label="Severity">
          {(["critical", "high", "medium", "low"] as Severity[]).map((sev) => (
            <FilterCheckbox
              key={sev}
              label={SEVERITY_LABELS[sev]}
              count={countBySeverity(allVulns, sev)}
              checked={filters.severities.has(sev)}
              color={SEVERITY_COLORS[sev]}
              onChange={(checked) => toggleSeverity(sev, checked)}
            />
          ))}
        </FilterGroup>

        {/* MCP Rules — only shown if any mcp_ast findings exist */}
        {presentRules.length > 0 && (
          <FilterGroup label="MCP Rules" defaultOpen={false}>
            {presentRules.map((rule) => (
              <FilterCheckbox
                key={rule}
                label={MCP_RULE_LABELS[rule] ?? rule}
                count={countByRule(allVulns, rule)}
                checked={filters.mcpRules.has(rule)}
                color="#D97757"
                onChange={(checked) => toggleRule(rule, checked)}
              />
            ))}
          </FilterGroup>
        )}
      </div>

      {/* Footer — active filter summary */}
      {activeFilterCount > 0 && (
        <div className="border-t border-[#3A3A38] px-4 py-3">
          <p className="text-[11px] text-[#6B6B69]">
            Showing{" "}
            <span className="text-[#D97757] font-medium">
              {filteredVulns.length}
            </span>{" "}
            of {allVulns.length} issues
          </p>
        </div>
      )}
    </aside>
  );
};

export default ScanFilters;
