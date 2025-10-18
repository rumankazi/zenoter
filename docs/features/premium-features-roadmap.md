# Premium Features Roadmap

**Last Updated**: 2025-10-18  
**Purpose**: Strategic plan for monetizable developer-centric features  
**Target Audience**: Product, Engineering, Business teams

---

## Overview

This document outlines premium features designed specifically for developers who want Zenoter to feel like their natural workspace. Each feature is evaluated for:

- **Developer appeal**: Does it solve real pain points?
- **Monetization potential**: Will users pay for it?
- **Technical feasibility**: Can we build it with our stack?
- **Competitive differentiation**: Does it make us unique?

---

## 💎 Pricing Tiers

### Free Tier ($0/month)

- Local notes (unlimited)
- Basic editor (Monaco on desktop, CodeMirror on mobile)
- Daily auto-commits (30-day retention)
- Markdown preview
- Dark/light themes
- 10 code snippets max
- Basic full-text search
- Mermaid diagrams (basic)

### Pro Tier ($9/month or $90/year)

- **Everything in Free, plus:**
- ☁️ Cloud sync (unlimited devices)
- 🕰️ On-demand commits (unlimited, 1-year retention)
- ⚡ Code execution (JavaScript/Python/TypeScript)
- 🔍 Advanced search (regex, AST-based)
- 📝 Unlimited snippets with tab-triggers
- 📊 Advanced diagrams (PlantUML, D2)
- 🌐 Browser extension (web clipper)
- 📚 API doc imports (100/month)

### Team Tier ($15/user/month, min 5 seats)

- **Everything in Pro, plus:**
- 👥 Team workspaces (5-50 users)
- 🔐 Role-based access control (RBAC)
- 📋 Shared snippets & templates
- 📝 Audit logs (90-day retention)
- 🗄️ Database query runner (PostgreSQL, MySQL, MongoDB)
- 🔗 Git repository integration (GitHub, GitLab)
- 🎫 Priority support (24h response)

### Enterprise Tier (Custom pricing, starting $500/month)

- **Everything in Team, plus:**
- 🔒 SSO/SAML authentication
- 🏢 On-premise deployment option
- ✅ SOC 2 compliance & audit reports
- 🤖 AI code assistant (unlimited)
- 🖥️ Terminal integration (cloud instances)
- 📞 Dedicated support (Slack channel)
- 🔌 Custom integrations & webhooks
- 📚 Unlimited API doc imports

---

## 🚀 Feature Specifications

### 5. Team Workspaces with RBAC

**Value Proposition**: Share knowledge across teams without friction

**Free Tier**: Individual notes only  
**Premium Tier**: Team ($15/user/month)

**Use Cases**:

- Onboarding documentation for new hires
- Shared runbooks for on-call rotations
- Architecture decision records (ADRs)
- Internal API documentation
- Team meeting notes & retrospectives

**Technical Implementation**:

- **Database**: Multi-tenant Firestore with workspace collections
- **Structure**:
  ```typescript
  workspaces/{workspaceId}/
    ├── members/{userId} - roles: owner, admin, editor, viewer
    ├── notes/{noteId}
    └── settings - name, avatar, billing
  ```
- **RBAC Model**:
  - **Owner**: Full control, billing, delete workspace
  - **Admin**: Invite/remove members, manage permissions
  - **Editor**: Create/edit all notes
  - **Viewer**: Read-only access
- **Sync**: Real-time Firestore listeners for live updates
- **Security**: Firestore rules validate role-based access
- **Effort**: 3 weeks (workspace UI, invitation system, permissions)

**Revenue Impact**: High (B2B expansion, $150-750/month per team)

---

### 6. AI Code Assistant Integration

**Value Proposition**: Generate, explain, and refactor code directly in notes

**Free Tier**: None (AI has infrastructure costs)  
**Premium Tier**: Enterprise (unlimited) or Pro add-on (+$5/month, 100 requests/day)

**Use Cases**:

- Generate boilerplate code from descriptions
- Explain complex code snippets
- Refactor legacy code with suggestions
- Auto-complete API documentation
- Generate unit tests from functions

**Technical Implementation**:

- **Provider**: OpenAI GPT-4 or Anthropic Claude
- **Integration**:

  ```typescript
  // Cloud Function to proxy AI requests
  export const generateCode = functions.https.onCall(async (data, context) => {
    // Verify entitlement (premium/enterprise)
    const isEntitled = await checkEntitlement(context.auth.uid, 'AI_ASSISTANT');
    if (!isEntitled) throw new Error('Upgrade required');

    // Rate limiting (100 requests/day for Pro)
    await checkRateLimit(context.auth.uid, 'ai_requests', 100);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: data.prompt }],
      max_tokens: 2000,
    });

    return { result: completion.choices[0].message.content };
  });
  ```

- **UI**: Floating button in editor, command palette (`Cmd+K`)
- **Caching**: Cache common prompts to reduce API costs
- **Effort**: 2 weeks (API integration, rate limiting, UI)

**Cost Analysis** (1,000 Pro users, 50 requests/user/month):

- OpenAI cost: 50,000 requests × $0.03/1K tokens × 500 tokens avg = $750/month
- Revenue: 1,000 users × $5 add-on = $5,000/month
- **Profit margin**: 85%

**Revenue Impact**: High (sticky feature, high perceived value)

---

### 7. Diagram-as-Code (Advanced)

**Value Proposition**: Create beautiful architecture diagrams that version with code

**Free Tier**: Basic Mermaid rendering  
**Premium Tier**: Pro ($9/month) - Advanced diagrams (PlantUML, D2, GraphViz)

**Use Cases**:

- System architecture diagrams
- Database schema visualizations
- Sequence diagrams for API flows
- Network topology diagrams
- State machine diagrams

**Technical Implementation**:

- **Free**: Client-side Mermaid rendering (already supported)
- **Premium**: Server-side rendering for PlantUML/D2

  ```typescript
  // Cloud Function for diagram rendering
  export const renderDiagram = functions.https.onCall(async (data, context) => {
    const { type, code } = data; // type: 'plantuml' | 'd2' | 'graphviz'

    if (type === 'plantuml') {
      // Use PlantUML Docker container
      const image = await execPlantUML(code);
      return { svg: image };
    } else if (type === 'd2') {
      // Use D2 CLI
      const svg = await execD2(code);
      return { svg };
    }
  });
  ```

- **Caching**: Cache rendered diagrams (code hash → SVG)
- **Export**: PNG, SVG, PDF formats
- **Animations**: Mermaid supports transitions (premium feature)
- **Effort**: 1-2 weeks (PlantUML Docker setup, D2 integration, caching)

**Cost Analysis**:

- Rendering: $10/month (Cloud Run for sporadic usage)
- Storage: $2/month (cached SVGs)
- **Total**: ~$12/month infrastructure

**Revenue Impact**: Medium (nice-to-have, not critical)

---

### 8. Terminal Integration

**Value Proposition**: Run commands directly from notes, capture output

**Free Tier**: None  
**Premium Tier**: Enterprise ($500+/month) - Security/compliance requirements

**Use Cases**:

- Document deployment steps with executable commands
- Troubleshooting runbooks with live output
- Database migration scripts
- API testing with curl commands
- Server diagnostics

**Technical Implementation**:

- **Architecture**: Cloud Run containers with ephemeral terminals
- **Tech Stack**: xterm.js (frontend) + WebSocket + Docker containers
- **Flow**:
  1. User clicks "Run" on code block
  2. Cloud Function spawns Docker container (timeout: 5 min)
  3. WebSocket connects to container terminal
  4. Output streams back to xterm.js
  5. Container destroyed after execution
- **Security**:
  - Sandboxed containers (no network, limited resources)
  - User-specific containers (isolated)
  - Command allowlist (prevent malicious commands)
  - Rate limiting (10 executions/hour)
- **Effort**: 4 weeks (container orchestration, WebSocket handling, security)

**Cost Analysis** (100 enterprise users, 100 executions/user/month):

- Cloud Run: 10,000 executions × $0.002 = $20/month
- Networking: $5/month
- **Total**: ~$25/month

**Revenue Impact**: Low (niche feature, but strong enterprise appeal)

---

### 9. Snippet Library with Auto-Complete

**Value Proposition**: Reusable code templates that boost productivity

**Free Tier**: 10 snippets max  
**Premium Tier**: Pro ($9/month) - Unlimited snippets, tab-triggers, variables

**Use Cases**:

- React component templates
- API endpoint boilerplate
- Database query patterns
- Test case skeletons
- Common utility functions

**Technical Implementation**:

- **Storage**: IndexedDB (local), Firestore (sync across devices)
- **Schema**:
  ```typescript
  interface Snippet {
    id: string;
    title: string;
    prefix: string; // Tab trigger (e.g., 'rfc' for React Function Component)
    body: string; // Code with variables: ${1:name}, ${2:props}
    language: string;
    tags: string[];
    createdAt: Date;
    sharedWith?: string[]; // Team workspace IDs
  }
  ```
- **Monaco Integration**: Use Monaco's `CompletionItemProvider`
  ```typescript
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model, position) => {
      const snippets = await loadUserSnippets();
      return {
        suggestions: snippets.map((s) => ({
          label: s.prefix,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: s.body,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
      };
    },
  });
  ```
- **Variables**: Support `${1:default}`, `$CURRENT_DATE`, `$CLIPBOARD`
- **Team Sharing**: Premium teams can share snippet libraries
- **Effort**: 1 week (snippet CRUD, Monaco integration, sync)

**Revenue Impact**: Medium (useful, but not deal-breaker)

---

### 10. Advanced Search with Regex/AST

**Value Proposition**: Find code patterns, not just text

**Free Tier**: Basic full-text search (keyword matching)  
**Premium Tier**: Pro ($9/month) - Regex, code structure search, search across commits

**Use Cases**:

- Find all functions with specific signatures
- Search for variable usages across notes
- Regex patterns for API endpoints
- Search within commit history
- Find TODOs assigned to specific people

**Technical Implementation**:

- **Free Search**: Simple IndexedDB query (note.content.includes(query))
- **Regex Search**: JavaScript RegExp engine
  ```typescript
  const results = notes.filter((note) => {
    try {
      const regex = new RegExp(query, 'gi');
      return regex.test(note.content);
    } catch {
      return false; // Invalid regex
    }
  });
  ```
- **AST Search**: Parse code blocks with Babel/TypeScript parser
  ```typescript
  // Example: Find all React components
  const ast = parse(codeBlock, { sourceType: 'module', plugins: ['jsx'] });
  const components = ast.program.body.filter(
    (node) =>
      node.type === 'FunctionDeclaration' && node.id.name[0] === node.id.name[0].toUpperCase()
  );
  ```
- **Search Across Commits**: Query Firestore commit metadata, download blobs
- **Performance**: Web Worker for heavy parsing (don't block UI)
- **Effort**: 2 weeks (regex UI, AST parser, commit search)

**Revenue Impact**: High (power users love advanced search)

---

### 11. Live Markdown Templates

**Value Proposition**: Standardize documentation with dynamic templates

**Free Tier**: 3 templates max  
**Premium Tier**: Pro ($9/month) - Unlimited, variables, conditional sections, team templates

**Use Cases**:

- Meeting notes (pre-filled date, attendees)
- Bug report templates
- RFC/design doc templates
- Postmortem templates
- Sprint planning templates

**Technical Implementation**:

- **Template Engine**: Handlebars.js
- **Schema**:
  ```typescript
  interface Template {
    id: string;
    name: string;
    description: string;
    content: string; // Handlebars template
    variables: Array<{
      name: string;
      type: 'text' | 'date' | 'select' | 'multiline';
      default?: string;
      options?: string[]; // For select type
    }>;
    sharedWith?: string[]; // Team workspace IDs
  }
  ```
- **Example Template**:

  ```markdown
  # Bug Report: {{bugTitle}}

  **Date**: {{currentDate}}
  **Reporter**: {{userName}}
  **Severity**: {{severity}}

  ## Description

  {{description}}

  ## Steps to Reproduce

  1. {{step1}}
  2. {{step2}}

  {{#if includeStackTrace}}

  ## Stack Trace
  ```

  {{stackTrace}}

  ```
  {{/if}}
  ```

- **UI**: Template picker in "New Note" dropdown, variable form on create
- **Effort**: 1 week (template CRUD, Handlebars integration, form generator)

**Revenue Impact**: Medium (nice for teams, not critical for individuals)

---

### 12. Browser Extension for Capture

**Value Proposition**: Save web content to notes instantly

**Free Tier**: None (extension is premium value-add)  
**Premium Tier**: Pro ($9/month) - Bundled with subscription

**Use Cases**:

- Save Stack Overflow answers
- Clip GitHub issues/PRs
- Capture documentation pages
- Screenshot with annotations
- Save code snippets from web

**Technical Implementation**:

- **Platforms**: Chrome, Firefox, Edge (Chromium-based)
- **Manifest V3** (Chrome requirement)
- **Features**:
  - Context menu: "Save to Zenoter"
  - Keyboard shortcut: `Cmd+Shift+Z`
  - Screenshot tool with annotations
  - Auto-tag by domain (stackoverflow.com → tag:stackoverflow)
- **API Integration**:
  ```typescript
  // Background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveNote') {
      fetch('https://api.zenoter.com/v1/notes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: request.title,
          content: request.content,
          url: request.url,
          screenshot: request.screenshot,
          tags: request.tags,
        }),
      });
    }
  });
  ```
- **Content Extraction**: Readability.js (clean HTML → Markdown)
- **Effort**: 2 weeks (extension boilerplate, API integration, screenshot tool)

**Revenue Impact**: High (acquisition tool, increases stickiness)

---

## 📊 Implementation Priority Matrix

| Feature                  | Dev Appeal | Revenue Potential | Technical Effort | Priority         |
| ------------------------ | ---------- | ----------------- | ---------------- | ---------------- |
| **Team Workspaces**      | ⭐⭐⭐⭐⭐ | 💰💰💰💰💰        | 🛠️🛠️🛠️           | **P0** (Q2 2026) |
| **AI Code Assistant**    | ⭐⭐⭐⭐⭐ | 💰💰💰💰💰        | 🛠️🛠️             | **P0** (Q3 2026) |
| **Advanced Search**      | ⭐⭐⭐⭐⭐ | 💰💰💰💰          | 🛠️🛠️             | **P1** (Q2 2026) |
| **Browser Extension**    | ⭐⭐⭐⭐   | 💰💰💰💰          | 🛠️🛠️             | **P1** (Q2 2026) |
| **Snippet Library**      | ⭐⭐⭐⭐   | 💰💰💰            | 🛠️               | **P1** (Q2 2026) |
| **Diagram-as-Code**      | ⭐⭐⭐⭐   | 💰💰💰            | 🛠️🛠️             | **P2** (Q3 2026) |
| **Live Templates**       | ⭐⭐⭐     | 💰💰              | 🛠️               | **P2** (Q3 2026) |
| **Terminal Integration** | ⭐⭐⭐     | 💰💰              | 🛠️🛠️🛠️🛠️         | **P3** (Q4 2026) |

**Legend**:

- ⭐ = Developer appeal (1-5 stars)
- 💰 = Revenue potential (1-5 dollar signs)
- 🛠️ = Technical effort (1-5 tools)

---

## 💵 Revenue Projections

### Scenario: 10,000 Total Users

**Conversion Rates** (industry standard for dev tools):

- Free → Pro: 5% = 500 users
- Pro → Team: 20% = 100 users → 20 teams (5 users/team)
- Team → Enterprise: 5% = 1 team (10 users)

**Monthly Recurring Revenue (MRR)**:

- 500 Pro users × $9 = $4,500
- 100 Team users × $15 = $1,500
- 10 Enterprise users × $50 = $500
- **Total MRR**: $6,500

**Annual Recurring Revenue (ARR)**: $78,000

**With 100,000 users** (10x scale):

- **Total MRR**: $65,000
- **Total ARR**: $780,000

---

## 🎯 Feature Rollout Timeline

### Phase 4: Pro Features (Q2 2026)

- **Week 1-2**: On-demand commits (already spec'd)
- **Week 3-4**: Advanced search (regex + AST)
- **Week 5-6**: Snippet library with sync
- **Week 7-8**: Browser extension (Chrome + Firefox)
- **Week 9-10**: Diagram-as-code (PlantUML + D2)
- **Goal**: 5% free → Pro conversion ($4,500 MRR)

### Phase 5: Team Features (Q3 2026)

- **Week 1-3**: Team workspaces + RBAC
- **Week 4-5**: Shared snippets & templates
- **Week 6-7**: Audit logs
- **Week 8-9**: Database query runner
- **Week 10-11**: Git integration
- **Week 12**: Beta testing + rollout
- **Goal**: 20% Pro → Team conversion ($1,500 MRR)

### Phase 6: Enterprise Features (Q4 2026)

- **Week 1-4**: AI code assistant (OpenAI integration)
- **Week 5-8**: Terminal integration (Docker + WebSocket)
- **Week 9-10**: SSO/SAML authentication
- **Week 11-12**: On-premise deployment docs
- **Goal**: Close 5 enterprise deals ($2,500+ MRR)

---

## 🔐 Security & Compliance Considerations

### Team Workspaces

- **Data isolation**: Firestore rules enforce workspace boundaries
- **Encryption**: TLS in transit, at-rest encryption for blobs
- **Audit logs**: Track all note access, edits, deletions

### AI Code Assistant

- **Privacy**: User code never stored, only transient for API calls
- **Rate limiting**: Prevent abuse (100 requests/day Pro, unlimited Enterprise)
- **Content filtering**: Block malicious prompts

### Terminal Integration

- **Sandboxing**: Docker containers with no network access
- **Allowlist**: Only safe commands (no `rm -rf`, `sudo`, etc.)
- **Timeout**: 5-minute max execution
- **Monitoring**: Log all commands for security audits

### Enterprise Features

- **SOC 2 Type II**: Required for large companies
- **GDPR compliance**: Data export, right to be forgotten
- **SSO/SAML**: Okta, Azure AD, Google Workspace
- **On-premise**: Deploy behind customer firewall

---

## 📈 Success Metrics

### Pro Tier Metrics

- Conversion rate: Free → Pro (Target: 5%)
- Activation rate: New Pro users using ≥1 premium feature within 7 days (Target: 80%)
- Retention: Month-2 retention (Target: 85%)
- NPS: Net Promoter Score (Target: 50+)

### Team Tier Metrics

- Seat expansion: Average seats per team (Target: 8)
- Team retention: Annual churn (Target: <10%)
- Feature adoption: % teams using shared templates (Target: 70%)

### Enterprise Metrics

- Average contract value (ACV): (Target: $10,000+/year)
- Sales cycle: Days from first contact to closed deal (Target: <90 days)
- Logo retention: Annual churn (Target: <5%)

---

## 🚧 Open Questions

1. **AI Assistant Pricing**: Separate add-on or bundled in Pro?
   - **Recommendation**: Add-on for Pro (+$5), included in Enterprise

2. **Database Query Runner**: Which databases to prioritize?
   - **Recommendation**: PostgreSQL, MySQL (Phase 1) → MongoDB, Redis (Phase 2)

3. **Terminal Integration**: Cloud-based or local execution?
   - **Recommendation**: Cloud for Enterprise (security), local for desktop app

4. **Git Integration**: GitHub only or multi-platform?
   - **Recommendation**: GitHub first (largest market share) → GitLab → Bitbucket

5. **Browser Extension**: Manifest V2 or V3?
   - **Recommendation**: Manifest V3 (Chrome requirement, future-proof)

---

## 📚 References

- [Notion Pricing](https://www.notion.so/pricing) - Team collaboration model
- [Obsidian Pricing](https://obsidian.md/pricing) - Plugin ecosystem
- [Linear Pricing](https://linear.app/pricing) - Developer tool pricing
- [GitHub Copilot Pricing](https://github.com/features/copilot) - AI assistant pricing
- [Stripe Atlas Pricing Research](https://stripe.com/atlas/guides/saas-pricing) - SaaS pricing strategies

---

**Next Steps**:

1. Validate features with beta users (surveys, interviews)
2. Prioritize Phase 4 roadmap (Q2 2026)
3. Create detailed specs for P0 features (team workspaces, AI assistant)
4. Set up billing infrastructure (Stripe integration)
5. Design premium onboarding flows (trial CTAs, upgrade modals)
