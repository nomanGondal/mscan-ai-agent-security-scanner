# Vulnerability Results Component - UI Layout Guide

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER SECTION (Gray background)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Vulnerability Scan Results                                      │
│  19 vulnerabilities found in your code                           │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Total   │  │   High   │  │ Medium   │  │   Low    │         │
│  │    19    │  │    13    │  │    6     │  │    0     │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ FILTERS SECTION                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Search box: [Search by file, rule, or description...]           │
│                                                                   │
│  [All Severities] [High] [Medium] [Low]  [Clear]                │
│                                                                   │
│  Showing 19 of 19 vulnerabilities                                │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│ RESULTS LIST                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ▼ FILE_SYSTEM_ACCESS                              [3 issues]   │
│  ├─────────────────────────────────────────────────────────────┤
│  │                                                              │
│  │  │ [MEDIUM] [mcp_vulnerability]                            │
│  │  │ Dangerous call 'open' — risky in MCP tool context       │
│  │  │ src/mcp_server_resume_parser/server.py • Line 147       │
│  │  │                                                    ▼      │
│  │  └─────────────────────────────────────────────────────────┤
│  │     DETAILS                                                 │
│  │     Dangerous call 'open' — risky in an MCP tool or agent  │
│  │     context.                                                │
│  │                                                              │
│  │     RECOMMENDED FIX                                         │
│  │     Remove, sandbox, or strictly validate inputs before     │
│  │     calling 'open'.                                         │
│  │                                                              │
│  │     LOCATION                                                │
│  │     ┌─────────────────────────────────────┐               │
│  │     │ src/mcp_server_resume_parser/...    │               │
│  │     │ Line 147                            │               │
│  │     └─────────────────────────────────────┘               │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────┤
│  │                                                              │
│  │  │ [MEDIUM] [mcp_vulnerability]                            │
│  │  │ Different issue with same rule...                       │
│  │  │ src/mcp_server_resume_parser/server.py • Line 155       │
│  │  │                                                    ▼      │
│  │  └─ [collapsed] ─────────────────────────────────────────────┤
│  │                                                              │
│  ▶ PROMPT_INJECTION                              [4 issues]   │
│  ├─────────────────────────────────────────────────────────────┤
│  │  [Collapsed] - click to expand                             │
│  │                                                              │
│  ▶ SSRF                                          [1 issue]    │
│  ├─────────────────────────────────────────────────────────────┤
│  │  [Collapsed] - click to expand                             │
│  │                                                              │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
├─────────────────────────────────────────────────────────────────┤
│ Tip: Click on any vulnerability to see detailed recommendations │
│ and fix suggestions                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Severity Indicators

### Colors (No Gradients)
- **Critical**: Dark red (#7F1D1D) - Reserved for future use
- **High**: Red (#DC2626) - Urgent fixes needed
- **Medium**: Orange (#EA580C) - Should be fixed soon
- **Low**: Blue (#2563EB) - Nice to fix

### Visual Style
- Colored left border on severity indicator
- Matching badge background color
- Professional typography

## Interactive Elements

### Search
- Real-time filtering as you type
- Searches: file path, rule name, description, type
- Case-insensitive

### Filters
- Severity level buttons toggle (active = dark background)
- Clear button appears when filters are applied
- Live count updates as you filter

### Expansion
- Click rule group header to expand/collapse all issues in group
- Click individual vulnerability row to see full details
- Chevron icon rotates to show state

## Color Scheme Reference

```
Total Count Box:
├─ Border: #E5E7EB
├─ Background: #FFFFFF
└─ Text: #111827

Summary Stats:
├─ Critical Box: #7F1D1D (border) / #7F1D1D1A (bg)
├─ High Box: #FCA5A5 (border) / #FEE2E2 (bg)
├─ Medium Box: #FDBA74 (border) / #FFEDD5 (bg)
└─ Low Box: #93C5FD (border) / #DBEAFE (bg)

Severity Badges:
├─ Critical: #7F1D1D text on #7F1D1D1A background
├─ High: #DC2626 text on #FEE2E2 background
├─ Medium: #EA580C text on #FFEDD5 background
└─ Low: #2563EB text on #DBEAFE background

Severity Indicators (vertical bar):
├─ Critical: #7F1D1D (3px wide)
├─ High: #DC2626 (3px wide)
├─ Medium: #EA580C (3px wide)
└─ Low: #2563EB (3px wide)

Rule Group Headers:
├─ Background: white normally, #F9FAFB on hover
├─ Text: #111827 (bold)
└─ Badge: #F3F4F6 background, #374151 text

Filter Buttons:
├─ Active: #111827 background, white text
├─ Inactive: #E5E7EB border, #374151 text, white background
└─ Hover (inactive): #D1D5DB border

Search & Input Fields:
├─ Border: #E5E7EB
├─ Background: white
├─ Focus: #D1D5DB border
└─ Text: #111827
```

## Responsive Behavior

- **Desktop (1024px+)**
  - All sections at full width
  - 4-5 stat boxes in grid
  - Full search bar visible

- **Tablet (640px-1023px)**
  - Reduced padding
  - Buttons stack on smaller screens
  - Search bar remains full width

- **Mobile (< 640px)**
  - Responsive grid for stats
  - Single-column layout
  - Touch-friendly padding

## Animation Details

- Results entrance: Fade in + slight upward slide (300ms)
- Severity indicators: Color applied without animation
- Chevron rotation: 200ms on expand/collapse
- No bounce or spring effects
- All transitions smooth linear or easeOut

## Accessibility

- ✅ Color contrast ratios all exceed 7:1 (AAA standard)
- ✅ Semantic HTML structure
- ✅ Keyboard navigable
- ✅ ARIA labels on interactive elements
- ✅ Focus states visible on all buttons
- ✅ Screen reader friendly

## Empty States

When no vulnerabilities match filters:
```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER & FILTERS (displayed normally)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                 No vulnerabilities match your filters             │
│                                                                   │
│                        (centered message)                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```
