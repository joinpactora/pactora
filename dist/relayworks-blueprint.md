# RelayWorks — Solo-founder blueprint

Planning draft v0.1 · October 24, 2026

## The decision

Build a recovery service for interrupted structured-data workflows. Prove that a specialist can finish the remaining work more cheaply or quickly than restarting or manually repairing it. Begin with curated providers. Expand into a marketplace after repeat paid demand is visible.

The landing page and console are live. A customer signs in with a wallet, sends the leftover work, and pays USDC only after accepting the output. The token is not launched. Sample figures on the marketing page are illustrations.

## Initial customer and task

Target small teams running repeated JSON/CSV enrichment, extraction, or normalization workflows. Ask for actual failed runs and a reproducible description of a correct result. Start with chunked jobs whose completed artifacts can be preserved and independently checked.

Exclude live trading, financial transactions, arbitrary code execution, browser sessions, and agents without explicit checkpoint boundaries. Another model cannot automatically inherit arbitrary private internal state. Different providers only help when their skills or environments address the actual cause of failure.

## MVP acceptance criteria

1. An authenticated customer submits a versioned package with input digests, completed and remaining chunk IDs, failure details, environment/adapter version, and acceptance checks.
2. A restricted worker reproduces the relevant failure and offers a bounded recovery strategy.
3. The customer selects a fixed quote, provider, total spend ceiling, deadline, and acceptance version.
4. An execution lease and chunk-level idempotency keys prevent concurrent duplicate work.
5. A provider resumes only authorized remaining chunks, with limited credentials and network destinations.
6. Independent verification checks schema, unit count, unique IDs, and preservation of completed artifacts.
7. Customer acceptance and actual financial settlement remain distinct states and records.
8. Expiry, failure, cancellation, retry, dispute, refund, and reconciliation paths have explicit behavior.

## Architecture

Use a static frontend, a small control API, one metadata database, private object storage, a queue, a restricted worker pool, an independent verifier, and a settlement adapter. Keep artifacts and sensitive data off-chain. A relational table or transactional store tracks jobs, attempts, leases, quotes, checks, acceptances, and receipts.

One developer should choose one API stack and one database. TypeScript is a reasonable default for integration speed; isolated workers can use Python for data tooling. Rust is useful if measured execution-control bottlenecks justify it, not a prerequisite for the first pilot.

Start with LangGraph as the candidate adapter. Carry observable artifacts, transformation specifications, environment requirements, and tool receipts. Do not require private reasoning traces. A handoff is not allowed to expand customer permissions.

Use ERC-8004 references for optional provider identity/outcome metadata, A2A for task exchange, and x402 for compatible programmatic tool purchases. They do not establish outcome truth, payout entitlement, or guaranteed data portability. Evaluate ERC-8183 only if an EVM escrow path is selected. Pick one payment network before production contracts. A Solana community token does not require a bridge or multichain MVP.

## Business model and measurement

Test a completed-recovery fee with a minimum charge, then a team subscription for private routing and monitoring. The frontend uses an illustrative 5% fee. At an $8 provider quote that is $0.40 before verification, support, failed attempts, and payment costs. Small jobs may need batching or subscriptions.

Measure recovered units, completion time, original and recovery compute cost, verification cost, failures, acceptance, and repeat customers. Compare each recovery against a retry and a clean restart on frozen inputs. Track actual contribution margin. Provider pass-through payments are not platform revenue. Demo sessions and token trading are not paid product adoption.

## Suggested six-week sequence

- Week 1: interview potential users; collect independent failed runs; choose one task class.
- Weeks 2–3: package validation, one adapter, restricted execution, durable state, independent checks.
- Week 4: curated quotes, capped authorization, expiry/retry handling, live settlement records.
- Weeks 5–6: small paid pilot; compare cost and time; identify repeat usage and contribution margin.
- After evidence: broader provider onboarding, stronger integrations, investor applications.

This is a planning sequence, not a delivery guarantee. Each phase advances on evidence.

## Operating envelope

Amounts below are USD planning caps, not vendor quotes or guaranteed all-in costs.

| Stage | Monthly planning range | Boundary |
|---|---:|---|
| Static frontend | $0–$15 | Hosting and optional domain allocation; excludes founder time |
| Curated backend pilot | $30–$100 | Small control plane, metadata, capped artifacts, restricted worker, live API budget |
| Small paid pilot | $100–$300 | Increase only against real demand and measured costs |

Cloudflare Workers Paid currently starts at $5/month. R2 Standard currently includes 10 GB-month free storage and operation allowances. These components are not a complete execution platform. Legal review, token launch/liquidity, audits, taxes, founder living costs, and uncapped model calls are excluded. Enforce CPU/time/storage limits and an actual spend ceiling. Customer execution must be priced into recoveries.

## Token strategy and founder income

The user intends a community token to help fund development and compensate the founder. The proposed working ticker is $RELAY; neither name nor ticker is reserved. Solana is a candidate. Chain, launchpad, supply, distribution, creator-fee recipient, founder allocation, vesting, and launch date must be decided before deployment.

Keep three money sources separate:

- Product revenue: fees or subscriptions actually paid for services.
- Token creator fees: eligible fees actually received under the chosen platform's rules. These depend on trading activity and can be zero.
- Founder token sales: sales from disclosed holdings. These are distinct from product revenue and should have explicit ownership, vesting, and sale disclosures.

Market capitalization and unrealized token gains are not spendable runway. Do not commit operating expenses against hoped-for appreciation. Personal compensation is legitimate when disclosed; separate personal and project wallets and records.

Draft allocation of realized funds explicitly committed to development:

| Use | Draft share |
|---|---:|
| Pilot operation, providers, and infrastructure | 50% |
| Disclosed founder development compensation | 25% |
| Security review and contingency | 15% |
| Documentation, community, and distribution | 10% |

This is not a token supply allocation or an executed treasury policy. Maintain a project ledger of receipts, expenses, compensation, and remaining runway. Publish a regular build/treasury update. If token proceeds are zero, keep the live service capped and seek customer-funded work.

Token ownership is not required for proposed USDC product payments. Do not promise yield, revenue sharing, guaranteed returns, exchange listings, or future utility as if it exists today. A token used to fund a business can have securities implications; review the actual offer, issuer, buyer jurisdictions, tax treatment, vesting, and platform rules before launch. Calling it a memecoin or utility token does not settle its classification.

## Prelaunch decisions

1. Final project name, domain, and brand availability.
2. Issuer/entity and relevant jurisdiction review.
3. Token network, platform, supply, distribution, and authority settings.
4. Founder allocation, vesting, compensation, and sale policy.
5. Canonical project, fee-recipient, and personal-wallet disclosures.
6. Exact use of funds, reporting cadence, and product stage description.
7. Verified contract address and official social/trading links.

No token or transaction was created as part of this frontend build.

## Fundraising preparation

The investor story is portable recovery infrastructure and verified customer outcomes. Start relationships early; a completed MVP is not required to learn investor fit.

Prepare a two-minute live walkthrough, actual accepted output examples, several unrelated paying teams, repeat usage, recovery-versus-restart comparisons, contribution margins, integration distribution, provider supply, and a 12-month use-of-funds plan. Keep company ownership, IP, token obligations, treasury receipts, founder holdings, and vesting ready for diligence.

Alliance and a16z CSX are relevant accelerator programs to investigate, not partners or funding commitments. Confirm current terms, location requirements, application dates, and equity/token rights. Do not place their logos in a sponsor section without authorization.

## Current frontend capabilities

- Responsive landing page, custom relay artwork, step walkthrough, provider examples, roadmap, FAQs, token preparation page, and blueprint.
- Console overview, recovery jobs, filters/search, provider profiles/saves, budget caps, and workspace preferences.
- JSON import and create, live recovery, acceptance or rejection, receipts, and exports.
- Wallet sign-in, worker execution, and USDC after acceptance. Preferences stay in the browser.

## Primary references checked October 24, 2026

- LangGraph persistence: https://docs.langchain.com/oss/python/langgraph/persistence
- Promptise recovery: https://docs.promptise.com/blog/ai-agent-failover-to-another-node/
- ERC-8004: https://ercs.ethereum.org/ERCS/erc-8004
- ERC-8183 draft: https://eips.ethereum.org/EIPS/eip-8183
- A2A: https://a2a-protocol.org/v1.0.1/specification/
- x402 flow: https://docs.cdp.coinbase.com/x402/how-it-works
- Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Pump fee rules: https://pump.fun/docs/fees
- CSA token offering guidance: https://www.osc.ca/en/securities-law/instruments-rules-policies/4/46-308/csa-staff-notice-46-308-securities-law-implications-offerings-tokens
- Alliance: https://alliance.xyz/
- a16z CSX: https://a16zcrypto.com/accelerator/

## Three.js presentation layer

The v0.2 landing uses an original procedural relay model and downloadable animated GLB to illustrate capture, specialist matching, recovery, and verification. This does not execute a job. The browser-local console and backend milestones above retain their existing scope. See THREE.md for the model pipeline and rendering verification limits.

## Recovery workshop presentation · v0.3

The live site includes Patch, an original articulated recovery specialist, plus the product narrative: checkpoint comparison, four recovery stages, a workspace preview, specialist profiles, architecture, bounded use cases, milestones, and community launch preparation. Job execution and USDC settlement run after acceptance. The source and editable model are included in the handoff. See PATCH.md for implementation boundaries.
