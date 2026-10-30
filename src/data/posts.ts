/**
 * JOURNAL
 * ───────
 * Posts are structured blocks rather than MDX — typed, rendered through the
 * site's own design system, and impossible to drift out of style.
 *
 * ⚠ EVERY POST IS FLAGGED `draft: true`.
 * These are researched drafts written in your voice, not published opinions.
 * Read them, make them sound like you, correct anything you disagree with, then
 * set `draft: false`. Drafts show a visible badge on the index and the post.
 *
 * Factual claims carry a `sources` list. If you change a claim, change or drop
 * its source with it.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "list"; items: string[] }
  | { t: "quote"; text: string; cite?: string }
  | { t: "code"; lang: string; text: string }
  | { t: "note"; text: string };

export interface Post {
  slug: string;
  title: string;
  standfirst: string;
  date: string;        // ISO
  readingMinutes: number;
  topic: "Fintech" | "Infrastructure" | "Engineering" | "Machine learning";
  accent: string;
  draft: boolean;
  body: Block[];
  sources?: { label: string; href: string }[];
}

export const posts: Post[] = [
  /* ───────────────────────────────────────────────────────────── */
  {
    slug: "when-the-cooling-fails",
    title: "When the cooling fails",
    standfirst:
      "Namecheap took more than 5,000 servers offline to save the hardware. The interesting part is not the outage. It is which of your dependencies you have never actually named.",
    date: "2026-08-16",
    readingMinutes: 5,
    topic: "Infrastructure",
    accent: "#ff8a3d",
    draft: true,
    body: [
      {
        t: "p",
        text: "On 13 August 2026 a storm knocked out cooling at Namecheap's Phoenix data-centre provider. Namecheap's response was to deliberately power down more than 5,000 servers rather than let them cook, and then bring services back in stages over roughly 28 and a half hours.",
      },
      {
        t: "p",
        text: "Hosting, EasyWP, Private Email, DNS management, URL redirect management and, awkwardly, the support helpdesk all went with it. DNS zone resolution kept working, which is the single detail that saved a lot of people from a much worse day: domains still resolved, so anything hosted elsewhere stayed up.",
      },
      { t: "h", text: "The failure was thermal, not digital" },
      {
        t: "p",
        text: "There is a particular kind of engineer confidence that comes from having good backups, good CI, and a tidy deployment pipeline. None of that is a defence against a building getting too warm. The shutdown was correct, since hardware that overheats does not come back, but it was a physical decision that propagated straight through every abstraction layer above it.",
      },
      {
        t: "p",
        text: "This is worth sitting with if you build payment products. Most of the resilience conversation in fintech is about the parts we can see: idempotency keys, webhook replay, reconciliation jobs, retry budgets. Those matter. They also assume the machine is on.",
      },
      { t: "h", text: "Name your single points of failure out loud" },
      {
        t: "p",
        text: "The useful exercise after an incident like this is not to switch providers. It is to write down, without looking at any code, every third party that can take your product down, and then check the list against reality. Most of us are wrong in the same two ways: we forget the ones we did not choose, and we forget the ones we chose years ago.",
      },
      {
        t: "list",
        items: [
          "Registrar and DNS, often the same vendor, which is the concentration Namecheap customers just met",
          "Where your email actually sends from, including password resets and OTPs",
          "Your identity or KYC provider, which is a hard dependency on any regulated onboarding flow",
          "Your payment processor, and separately its settlement bank",
          "Your media and asset CDN, usually invisible until images stop loading in production",
          "Your status page, which should never share infrastructure with the thing it reports on",
        ],
      },
      {
        t: "note",
        text: "The support desk going down with the platform is the detail I would fix first. When customers cannot reach you is exactly when they most need to, and it is the cheapest thing on this list to host somewhere else.",
      },
      { t: "h", text: "What I actually changed" },
      {
        t: "p",
        text: "Splitting registrar from DNS from hosting is cheap and mostly a one-afternoon job. Moving transactional email off the same vendor as hosting is cheap. Genuine multi-region redundancy is not cheap, and for most products at most stages it is not the right trade. But knowing that you have chosen to accept the risk is different from discovering it during a storm.",
      },
      {
        t: "p",
        text: "Namecheap reports no data loss and says it will add redundancy across its US, European and Asian data centres. That is the right lesson for them. The right lesson for the rest of us is smaller: an outage at a vendor is a free audit of your own dependency graph, and it only stays free if you actually do the audit.",
      },
    ],
    sources: [
      {
        label: "Engadget: Hosting provider Namecheap is down after data center cooling failure",
        href: "https://www.engadget.com/2236616/hosting-provider-namecheap-is-down-after-data-center-cooling-failure/",
      },
      {
        label: "IncidentHub: The August 13, 2026 Namecheap Outage",
        href: "https://blog.incidenthub.cloud/namecheap-outage-aug-13-2026",
      },
      { label: "Namecheap status updates", href: "https://www.namecheap.com/status-updates/" },
    ],
  },

  /* ───────────────────────────────────────────────────────────── */
  {
    slug: "nigerias-enforcement-year",
    title: "Nigeria's enforcement year",
    standfirst:
      "Between March and June 2026 the CBN issued the most sweeping fintech rules in the country's history. If you build payments here, the deadlines are structural, not cosmetic.",
    date: "2026-08-14",
    readingMinutes: 7,
    topic: "Fintech",
    accent: "#2ecc8f",
    draft: true,
    body: [
      {
        t: "p",
        text: "For most of the last decade, Nigerian fintech regulation arrived as guidance you could absorb with a compliance hire and a few product tweaks. 2026 is not that. The rules the Central Bank of Nigeria issued between March and June carry two hard dates, 31 December 2026 and 1 January 2027, and they change company structure, not just user flows.",
      },
      { t: "h", text: "Ring-fencing is the headline" },
      {
        t: "p",
        text: "The proposed operational ring-fencing framework requires every regulated subsidiary to hold its own governance, capital adequacy, liquidity standards and risk management. In practice: you can no longer run payments, lending and savings as three tabs in one organisation with one balance sheet behind them.",
      },
      {
        t: "p",
        text: "That is an engineering problem long before it is a legal one. Shared services that quietly reach across product boundaries (one wallet ledger, one KYC record, one risk engine) are exactly what a ring-fence is designed to separate. If your architecture assumed a single trust domain, you are looking at real work.",
      },
      { t: "h", text: "Market share as a capped variable" },
      {
        t: "p",
        text: "A licensed institution holding more than 25% of the consumer-issuing market is capped at 15% in merchant acquiring, with monthly market-share reporting and the thresholds to be met before the end of 2026. Read that as the regulator explicitly deciding that dominance on one side of the market should not convert into dominance on the other.",
      },
      {
        t: "p",
        text: "Separately, from 1 April 2026 every POS agent must operate under a single principal institution. Agents had to choose. If you have ever looked at agent-banking data in Nigeria you know how much of the network was multi-homed, and how much of the growth story that quietly explained.",
      },
      { t: "h", text: "Open banking finally has a date" },
      {
        t: "p",
        text: "Nigeria published Africa's first open banking regulatory framework in February 2021 and finalised operational guidelines in March 2023. The rollout then slipped. The CBN's February 2026 policy report commits to a phased rollout during 2026, alongside AML automation, APP fraud rules and cash policy changes all landing in the same window.",
      },
      {
        t: "note",
        text: "The compounding is the actual risk. Any one of these is a quarter of work. All of them at once, against a fixed December date, is how teams end up shipping compliance and breaking their product at the same time.",
      },
      { t: "h", text: "The sandbox is a real option" },
      {
        t: "p",
        text: "The CBN opened the second cohort of its Regulatory Sandbox Programme on 12 August 2026, with applications closing 31 August. It includes a Virtual Asset Service Provider track covering stablecoins, payment and settlement services, custody and wallets. That is the first time a lot of crypto-adjacent product work in Nigeria has had a legible supervised path rather than an ambiguous one.",
      },
      { t: "h", text: "What I would do with two quarters left" },
      {
        t: "list",
        items: [
          "Draw the trust boundaries you already have, honestly, before drawing the ones the ring-fence requires; most teams find the two diagrams are further apart than expected",
          "Instrument market-share reporting now; monthly filings against numbers you cannot currently produce is its own outage",
          "Treat open banking consent as a product surface with real UX, not an API checkbox, because it is the part users will actually see",
          "If any part of your roadmap touches stablecoins or custody, the sandbox track is the cheapest way to find out what supervised looks like",
        ],
      },
      {
        t: "p",
        text: "None of this is an argument that the rules are right or wrong. It is an argument that they are dated, specific, and structural, and that the teams treating December as a compliance sprint rather than an architecture decision are the ones who will be rewriting in January.",
      },
    ],
    sources: [
      {
        label: "TechAfrica News: CBN opens regulatory sandbox for Nigeria's virtual asset and fintech sector",
        href: "https://techafricanews.com/2026/08/12/cbn-opens-regulatory-sandbox-for-nigerias-virtual-asset-and-fintech-sector/",
      },
      {
        label: "TechCabal Insights: The CBN's plan to make regulation work for fintechs",
        href: "https://insights.techcabal.com/the-cbn-has-a-plan-to-make-regulation-work-for-fintechs-here-is-what-it-looks-like/",
      },
      {
        label: "BusinessDay: As Nigeria prepares for the open banking rollout",
        href: "https://businessday.ng/opinion/article/as-nigeria-prepares-for-the-open-banking-rollout/",
      },
      {
        label: "Technext: CBN H1 2026 rules: the banks and fintechs most affected",
        href: "https://technext24.com/2026/07/03/cbn-h1-2026-nigerian-banks-fintechs/",
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────── */
  {
    slug: "stablecoins-stopped-being-a-crypto-story",
    title: "Stablecoins stopped being a crypto story",
    standfirst:
      "With the GENIUS Act and MiCA in force, the interesting question moved from issuance to interoperability, and from price to settlement speed.",
    date: "2026-08-10",
    readingMinutes: 6,
    topic: "Fintech",
    accent: "#4b5dff",
    draft: true,
    body: [
      {
        t: "p",
        text: "I build a product that converts USDT and BTC into Naira and lands it in a bank account. For most of the time I have worked on that, the honest description of the stablecoin leg was 'plumbing that happens to be legal in some places and tolerated in others'. That framing is now out of date.",
      },
      { t: "h", text: "Two regimes, both live" },
      {
        t: "p",
        text: "The GENIUS Act, enacted July 2025, is the first comprehensive US framework for payment stablecoins: federal or state supervision, 100% reserve backing, redemption rules and AML obligations. In the EU, MiCA has settled into something less like a licensing gate and more like an ongoing compliance regime, with the 2026 attention on governance, reserve management, disclosure and conduct rather than initial authorisation. A UK framework is expected to follow.",
      },
      {
        t: "p",
        text: "The practical effect is boring and important: the question a partner bank asks you has changed from 'is this allowed' to 'under which regime, and can you evidence the reserves'.",
      },
      { t: "h", text: "Speed overtook cost" },
      {
        t: "p",
        text: "The pitch used to be that cross-border transfers were expensive and stablecoins were cheap. In 2026 the reporting consistently says something different: institutional buyers care more about speed and reliability (24/7 settlement, predictable finality) than about shaving basis points. B2B cross-border is where that is landing first.",
      },
      {
        t: "p",
        text: "If you have ever watched a Friday-evening payout sit until Monday because a correspondent bank was closed, that reordering will make immediate sense. Cost is a line item. Settlement timing is a product constraint that shapes everything you can promise a user.",
      },
      { t: "h", text: "The next problem is interoperability" },
      {
        t: "p",
        text: "The phase we are entering is less about launching new stablecoins and more about making the existing ones work together and connect to traditional rails. Multiple coins operating under different regulatory regimes need mechanisms to transact seamlessly, and that is a harder engineering and legal problem than issuance ever was.",
      },
      {
        t: "note",
        text: "Watch which layer captures the value. Fintech and Big Tech re-entering this space are not trying to own a coin; they are trying to own settlement flow. That is a very different thing to compete with.",
      },
      { t: "h", text: "What it changes for a builder in Lagos or Ibadan" },
      {
        t: "list",
        items: [
          "Reserve attestation becomes a thing your product can surface, not just something your treasury team files",
          "Choosing a stablecoin is now partly a jurisdictional choice, with different disclosure and redemption guarantees behind each",
          "Nigeria's CBN sandbox now has an explicit VASP track covering stablecoins, custody and wallets: a supervised path where there previously was not one",
          "If your value proposition was 'cheaper', re-test it; if it was 'settles now, at 2am, on a Sunday', it just got stronger",
        ],
      },
      {
        t: "p",
        text: "I am not making a prediction about adoption curves. I am noting that the constraint set I design against changed, and the products that assumed the old constraints are the ones that will feel slow.",
      },
    ],
    sources: [
      {
        label: "Forbes: Stablecoin cross-border payments in 2026: from theory to practice",
        href: "https://www.forbes.com/sites/danielwebber/2026/03/30/stablecoin-cross-border-payments-in-2026-from-theory-to-practice/",
      },
      {
        label: "The Payments Association: How stablecoin regulation is reshaping payments in 2026",
        href: "https://thepaymentsassociation.org/article/how-stablecoin-regulation-is-reshaping-payments-in-2026/",
      },
      {
        label: "PYMNTS: This week in stablecoins: fintech, big tech and regulation",
        href: "https://www.pymnts.com/cryptocurrency/2026/this-week-in-stablecoins-fintech-big-tech-and-regulation",
      },
      {
        label: "FinTech Weekly: 2026 stablecoin predictions: from crypto plumbing to payments infrastructure",
        href: "https://www.fintechweekly.com/news/stablecoin-predictions-2026-payments-infrastructure-regulation",
      },
    ],
  },

  /* ───────────────────────────────────────────────────────────── */
  {
    slug: "trust-boundaries-are-enforced-everywhere-or-nowhere",
    title: "Trust boundaries are enforced everywhere, or nowhere",
    standfirst:
      "I audited all six repositories of a product I had helped build. The bugs were not exotic. They were the same idea, checked in one place and assumed in four others.",
    date: "2026-08-12",
    readingMinutes: 8,
    topic: "Engineering",
    accent: "#f0894b",
    draft: true,
    body: [
      {
        t: "p",
        text: "iléSure is a student-housing marketplace: a backend, a React Native app, and four web front-ends. Agents list properties, students book and pay in Naira, identities get verified, tenancy agreements get signed. Real money, real identity documents, real consequences for getting it wrong.",
      },
      {
        t: "p",
        text: "I read all six repositories end to end and wrote up every finding against a file and line reference. I expected to find clever bugs. What I actually found was one idea, repeated.",
      },
      { t: "h", text: "The system got the hard things right" },
      {
        t: "p",
        text: "Credit where it is due, because it matters for the argument. Payment amounts were computed server-side in every wired flow, so no client could tamper with what it owed. The payment webhook preserved the raw body so the HMAC actually verified. Ownership checks on listings, bookings and chats were mostly present. There was no mass assignment on create or update.",
      },
      {
        t: "p",
        text: "Those are the things teams usually get wrong. This team got them right, which is exactly why the pattern underneath was worth naming.",
      },
      { t: "h", text: "The pattern: enforced once, assumed thereafter" },
      {
        t: "p",
        text: "Every serious finding was a trust boundary that existed in one place and was taken on faith everywhere else.",
      },
      {
        t: "list",
        items: [
          "The auth middleware rejected admin-typed tokens but nothing else, so a 30-day refresh token worked as a bearer on every non-role-gated endpoint, quietly defeating logout and rotation",
          "Identity verification succeeded, but the result was not bound to the caller who requested it",
          "The admin console's gate was a client-side boolean; the server did not re-ask",
          "Private chat threads rode along inside public listing responses, because the listing serializer was written before chats existed",
          "Two shared-booking flows split the money wrong: the landlord was paid twice and the platform nothing",
        ],
      },
      {
        t: "p",
        text: "Read that list again and notice that none of them require an attacker to be clever. They require an attacker to try the second door after finding the first one locked.",
      },
      { t: "h", text: "Why this happens to good teams" },
      {
        t: "p",
        text: "Because the first implementation of a rule is a decision, and every implementation after it is a memory. You write the ownership check on the booking endpoint while you are thinking hard about ownership. Six weeks later you add the shared-booking endpoint while you are thinking hard about roommates, and the check is something you already did.",
      },
      {
        t: "quote",
        text: "A boundary enforced in one place is not a boundary. It is a convention with good intentions.",
      },
      { t: "h", text: "What actually helps" },
      {
        t: "p",
        text: "Not more code review. Review is where this class of bug hides best, because each diff looks reasonable on its own. What helps is making the rule impossible to forget rather than easy to remember.",
      },
      {
        t: "code",
        lang: "ts",
        text: `// Not this: the check is a thing you must remember to write
router.post("/bookings/:id/pay", auth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (booking.userId !== req.user.id) return res.sendStatus(403);
  // …
});

// This: the check is a thing you must deliberately opt out of
router.post(
  "/bookings/:id/pay",
  auth({ tokenType: "access" }),        // refresh tokens cannot reach here
  owns(Booking, "id"),                   // ownership is a route-level fact
  async (req, res) => { /* … */ }
);`,
      },
      {
        t: "p",
        text: "Same for serialization: a listing should not be able to return a chat thread because the model cannot reach one, not because this particular query remembered to exclude it. And token type should be a first-class claim the middleware asserts, not something inferred from what it is not.",
      },
      { t: "h", text: "The part I would tell a younger version of myself" },
      {
        t: "p",
        text: "Auditing your own system is uncomfortable and it is the fastest learning I have done. Reading six repositories with no intention of fixing anything, just recording with file and line what is actually true, surfaces things that months of feature work never will. The report was more valuable than any single fix in it.",
      },
      {
        t: "note",
        text: "This describes work on a project I built. Findings were reported privately with fixes; nothing here identifies an exploitable live endpoint, and the specifics have been kept at the level of the pattern rather than the payload.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export const TOPICS = ["All", "Fintech", "Infrastructure", "Engineering", "Machine learning"] as const;
