export type Category =
  | "AI Strategy"
  | "AI Chatbots"
  | "Personalization"
  | "AI SEO"
  | "Lead Generation"
  | "AI Search"
  | "Case Study";

export type Block =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; author?: string }
  | {
      type: "callout";
      variant: "info" | "warning" | "success" | "tip";
      title?: string;
      text: string;
    }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "divider" };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  author: string;
  authorRole: string;
  authorInitials: string;
  authorColor: string;
  date: string;
  readTime: string;
  gradient: string;
  pattern: string;
  tags: string[];
  keyTakeaways: string[];
  featured?: boolean;
  content: Block[];
}

const CTA_PARAGRAPH =
  "If you'd like an honest, no-pressure walkthrough of where AI can move the needle on your specific website, we offer a free 30-minute audit. We'll look at your traffic, your funnel, and tell you exactly which two or three integrations would pay back fastest.";

export const POSTS: Post[] = [
  {
    slug: "ai-websites-revenue",
    title:
      "How AI-integrated websites are quietly adding 30% to small business revenue",
    excerpt:
      "Forget the hype. Here's the unglamorous, measurable way modern AI is shifting conversion rates, support costs, and lead quality for businesses doing under $5M a year.",
    category: "AI Strategy",
    author: "Adaeze Okafor",
    authorRole: "Head of Strategy, Blaze Studio",
    authorInitials: "AO",
    authorColor: "bg-primary/15 text-primary",
    date: "Apr 22, 2026",
    readTime: "9 min read",
    gradient: "from-orange-500 via-rose-500 to-fuchsia-600",
    pattern:
      "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.25) 0, transparent 50%)",
    tags: ["AI", "Conversion", "Revenue", "SMB"],
    keyTakeaways: [
      "AI on a website is plumbing, not a feature — it works when woven into the funnel.",
      "Four systems do 80% of the impact: lead qualification, AI search, personalisation, content.",
      "Total cost typically lands at $80–400/month — less than a part-time hire.",
      "Ship one integration, measure for 30 days, then expand. Never all four at once.",
    ],
    featured: true,
    content: [
      {
        type: "p",
        text: "Two years ago, AI on a small business website meant a clunky chatbot pretending to be human and failing politely. Today, it means three or four invisible systems working together — answering questions instantly, ranking leads in real time, surfacing the right product to the right visitor, and writing the first draft of your blog. Done well, the lift is not subtle.",
      },
      {
        type: "p",
        text: "We've now shipped AI integrations for 40+ businesses across retail, professional services, B2B SaaS and hospitality. The pattern is consistent: when AI is bolted on as a feature, it disappoints. When it's woven into the funnel as plumbing, the numbers move sharply.",
      },
      {
        type: "stats",
        items: [
          { value: "+34%", label: "Avg. lift in lead-to-meeting conversion" },
          { value: "−61%", label: "Drop in repetitive support tickets" },
          { value: "2.4x", label: "Increase in qualified pipeline value" },
          { value: "9 days", label: "Median time-to-first-result" },
        ],
      },
      {
        type: "h2",
        id: "the-shift",
        text: "The shift: from website-as-brochure to website-as-employee",
      },
      {
        type: "p",
        text: "The mental model that unlocks this is simple. Your website used to be a brochure: it sat there, waited, and hoped the right person clicked the right thing. With AI in the loop, your website becomes a junior employee that works 24/7 — qualifying leads, answering questions, recommending the next step, and quietly improving as it learns from every visitor.",
      },
      {
        type: "p",
        text: "That employee never calls in sick, never forgets the playbook, and costs roughly the same per month as a single part-time hire. For a business doing under $5M, that's the most leveraged hire you'll make this year.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "The reframe that matters",
        text: "Stop asking 'where can we add AI?'. Start asking 'where in our funnel are humans doing the same low-value task over and over?'. Those are the spots AI pays for itself in weeks, not months.",
      },
      {
        type: "h2",
        id: "four-systems",
        text: "The four systems that actually move the needle",
      },
      {
        type: "p",
        text: "Of all the integrations we've shipped, four account for roughly 80% of the revenue impact. Pick one, ship it well, then add the next.",
      },
      {
        type: "h3",
        text: "1. Conversational lead qualification",
      },
      {
        type: "p",
        text: "Instead of a static form, an AI assistant asks two or three smart questions, scores the lead, and routes hot ones straight to your sales WhatsApp or inbox. Cold ones get nurtured automatically. The form-fill rate typically rises 40-70% because the conversation feels lighter than a wall of fields.",
      },
      {
        type: "h3",
        text: "2. AI-powered on-site search",
      },
      {
        type: "p",
        text: "Old keyword search returns nothing if a visitor types the wrong word. AI search understands intent. For e-commerce and content-heavy sites, replacing the search bar alone has produced 2-4x conversion lifts in our case studies.",
      },
      {
        type: "h3",
        text: "3. Personalised landing experiences",
      },
      {
        type: "p",
        text: "The hero, headline and CTA quietly adapt to where the visitor came from, what they read last, and what stage of buying they look like. No two visitors see exactly the same homepage. This sounds complicated; in 2026, it's a single integration.",
      },
      {
        type: "h3",
        text: "4. Predictive content generation",
      },
      {
        type: "p",
        text: "AI drafts long-tail SEO articles, product descriptions and email sequences off your existing tone of voice. A human edits and approves. Output triples; quality stays high if (and only if) the editing step is real.",
      },
      {
        type: "h2",
        id: "where-it-fails",
        text: "Where it fails — and how to avoid those traps",
      },
      {
        type: "p",
        text: "Three failure modes account for almost every disappointed AI rollout we've seen:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Bolted on, not built in.** A chatbot widget dropped onto a brochure site is a gimmick. AI has to live inside the funnel — connected to your CRM, your inventory, your booking system.",
          "**No human escape hatch.** Visitors must always be one click away from a real person. The brands that win make the handoff feel seamless, not adversarial.",
          "**No measurement loop.** If you can't see week-over-week which AI touchpoint is moving conversion, you're flying blind. Every integration we ship comes with a single dashboard view.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Don't skip the handoff design",
        text: "70% of customer frustration with AI on websites comes from one thing: feeling trapped in a loop with no path to a human. Design the handoff first, the AI second.",
      },
      {
        type: "h2",
        id: "what-it-costs",
        text: "What it actually costs in 2026",
      },
      {
        type: "p",
        text: "For a typical small-to-mid business, expect a one-time integration cost of roughly $2,500-$8,000 depending on scope, and ongoing AI usage costs of $80-$400/month. That's the total. The cost of AI tokens has dropped over 90% in the last 18 months and continues to fall.",
      },
      {
        type: "p",
        text: "Compare that to one part-time customer support hire ($1,500-$2,500/month all-in) and the math gets uncomfortable for the do-nothing option.",
      },
      {
        type: "h2",
        id: "where-to-start",
        text: "Where to start this quarter",
      },
      {
        type: "p",
        text: "If you're going to do exactly one thing in the next 90 days, here's our recommendation in priority order:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Audit your top 3 conversion pages.** Where are visitors dropping off? That's your first AI integration target.",
          "**Pick one system from the four above.** Don't try to ship all four at once. Lead qualification or AI search are the safest first bets.",
          "**Set one number.** Define the one metric you're trying to move (lead-rate, support-ticket volume, AOV). If you can't name it, don't ship.",
          "**Run for 30 days, measure, then expand.** AI integrations get smarter with traffic. Give them a month before you judge.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "Quick gut check",
        text: "If your team currently spends more than 5 hours a week answering the same 10 questions on email, WhatsApp or your contact form — you have a textbook AI use case sitting in your inbox right now.",
      },
      {
        type: "h2",
        id: "closing",
        text: "The window is closing",
      },
      {
        type: "p",
        text: "In 2024, having AI on your website was a competitive advantage. By the end of 2026, not having it will be a competitive disadvantage. Customers are already learning to expect instant, intelligent answers — and they will quietly leave a site that can't deliver them.",
      },
      {
        type: "p",
        text: "The good news: the stack is mature, the costs are low, and you don't need an in-house engineering team. You just need a partner who's done it 40 times and can avoid the traps for you.",
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
  {
    slug: "ai-chatbot-vs-human",
    title:
      "AI chatbots vs human support: where each one wins (and how to combine them)",
    excerpt:
      "A practical breakdown of which conversations belong to AI, which belong to humans, and the handoff design that keeps your customers happy on both sides.",
    category: "AI Chatbots",
    author: "Ifeanyi Kalu",
    authorRole: "Lead Engineer, Blaze Studio",
    authorInitials: "IK",
    authorColor: "bg-emerald-500/15 text-emerald-600",
    date: "Apr 14, 2026",
    readTime: "8 min read",
    gradient: "from-emerald-500 via-teal-500 to-sky-600",
    pattern:
      "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.18) 0, transparent 55%)",
    tags: ["AI", "Chatbots", "Customer Support", "UX"],
    keyTakeaways: [
      "AI wins repetitive factual questions; humans win emotion, negotiation and apologies.",
      "Always offer a human escape hatch one click away from every AI message.",
      "Aim for 60–75% of tickets fully resolved by AI within 60 days.",
      "Train your AI on your top 20 real questions, not 'everything you know'.",
    ],
    content: [
      {
        type: "p",
        text: "The 'AI vs human' framing is wrong. The right question is: which conversation belongs to which, and how does the handoff feel? Get that split right and your customers feel served. Get it wrong and they feel processed.",
      },
      {
        type: "p",
        text: "We've now deployed AI support layers for businesses ranging from a 4-person law firm to a 200-store retail chain. The split that consistently works is surprisingly simple.",
      },
      {
        type: "h2",
        id: "what-ai-wins",
        text: "What AI wins at, hands down",
      },
      {
        type: "list",
        items: [
          "**Repetitive factual questions** (hours, prices, return policy, shipping)",
          "**Account-status lookups** (where's my order, when does my booking start, what's my balance)",
          "**Multi-step guidance** (how do I reset my password, how do I file a claim)",
          "**24/7 first-response** when no human is online",
          "**Triage and routing** to the right human team",
        ],
      },
      {
        type: "p",
        text: "These conversations are predictable, patterned, and exhausting for humans. AI handles them faster, more consistently, and at a fraction of the cost.",
      },
      {
        type: "h2",
        id: "what-humans-win",
        text: "What humans still win at, by a mile",
      },
      {
        type: "list",
        items: [
          "**Anything involving emotion** (a complaint, a loss, a frustrated customer)",
          "**Negotiation** (a discount request, a custom quote, a partnership)",
          "**Edge cases** that don't fit any script",
          "**Trust-building moments** (the first call with a high-value lead)",
          "**Apologies** — never let an AI deliver one",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The single biggest mistake",
        text: "Letting AI handle complaints. Even a good model will sound tone-deaf to a customer who's already upset. Always route 'frustrated' signals to a human within the first message.",
      },
      {
        type: "h2",
        id: "handoff-design",
        text: "The handoff is where it lives or dies",
      },
      {
        type: "p",
        text: "Customers don't actually mind talking to an AI. They mind being trapped with one. A clean handoff has four properties:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Always visible.** A 'Talk to a human' option is one click away from every AI message. Not buried.",
          "**Context preserved.** When the human takes over, they see the entire conversation. The customer never repeats themselves.",
          "**Honest framing.** The AI introduces itself as an assistant, not a person. Modern customers prefer the honesty.",
          "**Fast.** During business hours, a human responds within 2 minutes of a handoff. That's the bar.",
        ],
      },
      {
        type: "h2",
        id: "stack",
        text: "The stack we recommend in 2026",
      },
      {
        type: "p",
        text: "For most small and mid-sized businesses, the right setup is one AI assistant trained on your knowledge base, connected to your existing tools (WhatsApp, email, CRM), with a human dashboard where staff can take over any conversation. Off-the-shelf platforms like Intercom Fin, Crisp AI, and Customerly handle 90% of cases. For deeper integration we build custom assistants on top of OpenAI or Anthropic APIs.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Start narrow",
        text: "Don't train your AI on 'everything we know'. Start with the top 20 questions you actually get. You'll cover 80% of incoming conversations and the model will be much more accurate.",
      },
      {
        type: "h2",
        id: "results",
        text: "What 'good' looks like in numbers",
      },
      {
        type: "stats",
        items: [
          { value: "60-75%", label: "of tickets fully resolved by AI" },
          { value: "<2 min", label: "median first response time" },
          { value: ">85%", label: "customer satisfaction post-resolution" },
          { value: "−50%", label: "reduction in human workload" },
        ],
      },
      {
        type: "p",
        text: "If your numbers are below this range after 60 days, the issue is almost always content (your knowledge base is thin) or routing (the handoff is broken) — not the AI itself.",
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
  {
    slug: "personalization-engine",
    title:
      "Real-time personalization: turning one website into a thousand tailored experiences",
    excerpt:
      "What it actually takes to show every visitor a homepage that feels written for them — and the four data signals that do most of the work.",
    category: "Personalization",
    author: "Zara Mensah",
    authorRole: "Conversion Strategist",
    authorInitials: "ZM",
    authorColor: "bg-purple-500/15 text-purple-600",
    date: "Apr 06, 2026",
    readTime: "10 min read",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0, transparent 50%)",
    tags: ["Personalization", "Conversion", "AI"],
    keyTakeaways: [
      "Four signals (source, location, device, history) do 80% of the personalisation work.",
      "Personalise hero, headline, CTA and proof — never pricing or navigation.",
      "Subtlety wins. Don't reference the personal data in the copy.",
      "Lifts of 20–40% on the homepage are typical when the writing is right.",
    ],
    content: [
      {
        type: "p",
        text: "Personalization used to mean 'Hi, FIRST_NAME' in an email. In 2026, it means your website's hero section, headline, social proof, and CTA all quietly adapt to who's looking — without the visitor ever noticing.",
      },
      {
        type: "p",
        text: "Done well, this typically lifts conversion 20-40% on the homepage and 50%+ on landing pages. Done badly, it feels creepy or breaks the brand. Here's how we draw the line.",
      },
      {
        type: "h2",
        id: "four-signals",
        text: "The four signals that do 80% of the work",
      },
      {
        type: "p",
        text: "You don't need a data lake to personalize well. You need four signals, all available without any cookie consent fight:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Where they came from.** Search query, referring site, paid campaign source. This tells you their intent.",
          "**Where they are.** Country and city. This drives currency, language, and locally relevant social proof.",
          "**What device they're on.** Mobile vs desktop changes layout density, video vs static visuals.",
          "**What they've seen before.** Returning visitor? Read your pricing page? Saw your case studies? The CTA should know.",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "The rule of subtlety",
        text: "Personalization works best when the visitor doesn't notice it. If your message says 'because you're in Lagos…' you've broken the spell. Adapt the experience, not the explanation.",
      },
      {
        type: "h2",
        id: "what-to-personalize",
        text: "What to personalize (and what to leave alone)",
      },
      {
        type: "h3",
        text: "Personalize",
      },
      {
        type: "list",
        items: [
          "Hero headline and sub-headline",
          "Hero image or video",
          "Primary CTA copy and destination",
          "Featured testimonials (match industry or location)",
          "Social proof numbers (regional totals)",
          "Pricing currency and example use case",
        ],
      },
      {
        type: "h3",
        text: "Leave alone",
      },
      {
        type: "list",
        items: [
          "Your logo and brand voice",
          "Navigation structure",
          "Pricing tier values (varying these gets you in trouble)",
          "Anything in the footer",
        ],
      },
      {
        type: "h2",
        id: "stack",
        text: "The lightweight stack",
      },
      {
        type: "p",
        text: "You don't need a six-figure CDP. For most businesses we ship personalization on top of a stack like Vercel Edge Middleware + a small AI model + your existing analytics. Total monthly cost is usually under $200, and the page still loads in under a second because the personalization happens at the edge.",
      },
      {
        type: "h2",
        id: "case-study",
        text: "A 7-day case study",
      },
      {
        type: "p",
        text: "A B2B accounting SaaS we work with had a single homepage trying to speak to freelancers, SMEs and enterprise. Conversion sat at 1.8%. We split visitors into three audiences using nothing but referral source and entry page. Each saw a different hero, different testimonial, different CTA.",
      },
      {
        type: "stats",
        items: [
          { value: "1.8% → 4.2%", label: "homepage demo-request rate" },
          { value: "+27%", label: "average session duration" },
          { value: "0ms", label: "perceived load time difference" },
          { value: "7 days", label: "from kickoff to live" },
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "Why it worked",
        text: "Nothing fancy. Three audiences. One signal each. Different hero, headline and CTA. The technology was 10% of the win — the writing was 90%.",
      },
      {
        type: "h2",
        id: "ethics",
        text: "The ethics line",
      },
      {
        type: "p",
        text: "There's a clear line between helpful adaptation and uncomfortable surveillance. We follow three rules: never personalize with data the visitor didn't reasonably expect us to have, never use personalization to charge different people different prices for the same product, and never reference the personal data directly in copy. Cross those lines and you damage trust permanently.",
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
  {
    slug: "ai-seo-content",
    title:
      "AI-assisted SEO content: the workflow that scales output without sounding robotic",
    excerpt:
      "How to triple your blog output, keep your tone of voice intact, and avoid the Google penalties that have killed entire sites built on raw AI dumps.",
    category: "AI SEO",
    author: "Tunde Adebayo",
    authorRole: "SEO Director",
    authorInitials: "TA",
    authorColor: "bg-blue-500/15 text-blue-600",
    date: "Mar 28, 2026",
    readTime: "9 min read",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    pattern:
      "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.22) 0, transparent 55%)",
    tags: ["SEO", "AI", "Content"],
    keyTakeaways: [
      "Google penalises low effort, not AI use. Add one piece of original info per article.",
      "Strategy and angle stay human. AI handles outlining and first drafts only.",
      "Always rewrite the intro, conclusion and one key section by hand.",
      "Output triples; quality holds — if (and only if) the editing step is real.",
    ],
    content: [
      {
        type: "p",
        text: "Two camps emerged in 2024. Camp A used AI to publish 200 articles a month and got hit by Google's helpful-content updates. Camp B refused to touch AI and got out-published. Camp C — small, quiet, winning — figured out the workflow that uses AI as a leverage tool and a human as the final word. This article is camp C.",
      },
      {
        type: "h2",
        id: "what-google-actually-penalises",
        text: "What Google actually penalises",
      },
      {
        type: "p",
        text: "It's not AI use. It's signal of low effort. Google's helpful-content systems are looking for: shallow coverage, generic phrasing, no original data or examples, no clear author, and pages that read like they were generated to rank rather than to inform. Every one of those is solvable in your workflow.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "The rule that protects you",
        text: "Every published article must contain at least one piece of information a generic AI could not have produced — a real client number, a screenshot, an opinion, a counter-example. That single rule keeps you on the right side of every Google update.",
      },
      {
        type: "h2",
        id: "the-workflow",
        text: "The 5-step workflow we use",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Strategy by human.** A human picks the topic, the angle, the keyword, and the unique point of view. AI never picks the strategy.",
          "**Outline by AI, edited by human.** AI proposes a structure, the editor cuts the obvious, adds the non-obvious.",
          "**First draft by AI, with brand voice prompt.** Trained on 5-10 of your best articles. Output is 70% there.",
          "**Human rewrite of intro, conclusion, and one section.** These three sections carry 80% of the 'who wrote this' signal.",
          "**Add originals.** A real screenshot, a quote, a number, a chart, a counter-example. Always.",
        ],
      },
      {
        type: "p",
        text: "Total time per 1,500-word article: 60-90 minutes. Without AI, the same article takes 4-5 hours. The leverage is real and the quality holds.",
      },
      {
        type: "h2",
        id: "tone-of-voice",
        text: "Locking in tone of voice",
      },
      {
        type: "p",
        text: "The fastest way to get an AI to sound like your brand is to give it three things up front in every prompt: 5 example articles, a one-paragraph 'voice rules' doc (formal/casual, sentence length, what to avoid), and a single 'sounds like' reference (a writer or publication). With those three locked in a system prompt, output consistency jumps dramatically.",
      },
      {
        type: "h2",
        id: "scale-numbers",
        text: "What scaling looks like in numbers",
      },
      {
        type: "stats",
        items: [
          { value: "3-4x", label: "increase in publish frequency" },
          { value: "Same", label: "time spent per article (because of editing)" },
          { value: "+180%", label: "organic traffic over 6 months (typical client)" },
          { value: "$0.40", label: "average AI cost per published article" },
        ],
      },
      {
        type: "h2",
        id: "what-not-to-do",
        text: "What never to do",
      },
      {
        type: "list",
        items: [
          "Publish AI output unedited. Ever.",
          "Generate 'thin' programmatic pages with templated paragraphs.",
          "Hide the author. Always credit a real human writer or editor.",
          "Generate fake quotes or fake statistics. The cost of getting caught once is brutal.",
          "Use AI for legal, medical or financial content without a qualified human review.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The 'would I send this to a friend' test",
        text: "Before publishing, ask: would I email this article to a friend who genuinely needs the information, with my name on it? If no, it isn't ready. That single test catches almost every quality issue.",
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
  {
    slug: "predictive-lead-scoring",
    title:
      "Predictive lead scoring: how AI tells your sales team which leads to call first",
    excerpt:
      "If you're calling leads in the order they arrived, you're losing money. Here's how a small AI model trained on your own data can reorder the queue and lift close rates 20-40%.",
    category: "Lead Generation",
    author: "Adaeze Okafor",
    authorRole: "Head of Strategy, Blaze Studio",
    authorInitials: "AO",
    authorColor: "bg-primary/15 text-primary",
    date: "Mar 19, 2026",
    readTime: "8 min read",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    pattern:
      "radial-gradient(circle at 80% 60%, rgba(255,255,255,0.2) 0, transparent 50%)",
    tags: ["Lead Generation", "AI", "Sales"],
    keyTakeaways: [
      "Calling leads in arrival order leaves money on the table.",
      "Minimum useful dataset: 200 closed-won + 1,000 closed-lost deals.",
      "Time-on-site, pricing-page visits and lead source do most of the predictive work.",
      "Expect a 20–40% close-rate lift in the first 60 days.",
    ],
    content: [
      {
        type: "p",
        text: "Most sales teams call leads in the order they came in. Some call the loudest first. Almost none call them in the order most likely to close. That last list is what predictive scoring gives you, and the lift is one of the highest in any AI integration we ship.",
      },
      {
        type: "h2",
        id: "what-it-is",
        text: "What predictive lead scoring actually is",
      },
      {
        type: "p",
        text: "A small machine-learning model trained on your historical leads + closes. It looks at every signal you have — source, behaviour on site, form answers, company size, time-of-day they enquired — and outputs a single number: probability this lead closes in the next 30 days.",
      },
      {
        type: "p",
        text: "Your sales team works that list top-down. Same number of calls, same effort, dramatically more revenue. We typically see 20-40% lifts in close rate within 60 days.",
      },
      {
        type: "callout",
        variant: "info",
        title: "You don't need 100,000 leads",
        text: "The minimum useful dataset for a usable model is roughly 200 closed-won deals and 1,000 closed-lost deals. If you're below that, start collecting more signals now — you'll have your dataset within 6 months.",
      },
      {
        type: "h2",
        id: "the-signals",
        text: "The signals that actually matter",
      },
      {
        type: "p",
        text: "Out of dozens of inputs, a handful do almost all the predictive work:",
      },
      {
        type: "list",
        items: [
          "**Time-on-site before form fill** (longer = warmer, sharply)",
          "**Pricing page visited** (3-5x more likely to close)",
          "**Form fill quality** (real domain email, complete answers)",
          "**Lead source** (organic and referral beat paid by ~2x close rate)",
          "**Company-size indicators** (job title, domain, industry)",
          "**Time of day and week** (weekday afternoon enquiries close more)",
        ],
      },
      {
        type: "h2",
        id: "how-it-shows-up",
        text: "How it shows up for your sales team",
      },
      {
        type: "p",
        text: "Every new lead gets a score from 0-100 visible directly in your CRM (HubSpot, Pipedrive, Salesforce — all supported). Hot leads (80+) trigger an instant Slack or WhatsApp ping to the right rep. Lukewarm leads (40-79) drop into the normal queue. Cold leads (<40) get an automated nurture sequence and quiet attention.",
      },
      {
        type: "stats",
        items: [
          { value: "+27%", label: "average close rate lift in 60 days" },
          { value: "<5 min", label: "response time on hot leads (vs hours)" },
          { value: "−30%", label: "time wasted on poor-fit prospects" },
          { value: "200/1000", label: "minimum dataset to start training" },
        ],
      },
      {
        type: "h2",
        id: "what-it-costs",
        text: "What it costs to ship",
      },
      {
        type: "p",
        text: "Build cost: typically $3,000-$6,000 depending on CRM and data quality. Monthly running cost: $50-$150 in compute. Payback: most clients hit it within the first month from one extra closed deal.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Start with the 'next call' question",
        text: "Even before building a full model, audit your last 20 closed-won deals. Look at what they have in common (source, behaviour, role). You'll often find a manual scoring rule that lifts close rates 10-15% before any AI is involved.",
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
  {
    slug: "ai-search-onsite",
    title:
      "Replace your site search with AI: a 4x conversion case study",
    excerpt:
      "On-site search is one of the highest-intent surfaces on your website. Here's why upgrading it to a real AI model pays back faster than almost any other integration.",
    category: "AI Search",
    author: "Ifeanyi Kalu",
    authorRole: "Lead Engineer, Blaze Studio",
    authorInitials: "IK",
    authorColor: "bg-emerald-500/15 text-emerald-600",
    date: "Mar 11, 2026",
    readTime: "7 min read",
    gradient: "from-lime-500 via-emerald-600 to-teal-700",
    pattern:
      "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.22) 0, transparent 55%)",
    tags: ["AI Search", "E-commerce", "Conversion"],
    keyTakeaways: [
      "30–40% of site searches return zero results on a typical site.",
      "Search users convert 2–3x higher — fix this before almost anything else.",
      "Vector embeddings replace keyword matching for under $50/month.",
      "Skip if your site has fewer than 50 indexable items — old search is fine.",
    ],
    content: [
      {
        type: "p",
        text: "Visitors who use your search bar are 2-3x more likely to convert than those who don't. They've told you exactly what they want. So why are most site search bars in 2026 still doing dumb keyword matching from 2010?",
      },
      {
        type: "h2",
        id: "what-old-search-misses",
        text: "What old search misses",
      },
      {
        type: "p",
        text: "Type 'something for back pain' into most e-commerce sites and you get zero results. Type 'lawyer for car accident' on most legal sites and you get no match. Old search needs the visitor to know your terminology. New search understands intent.",
      },
      {
        type: "stats",
        items: [
          { value: "30-40%", label: "of site searches return zero results (typical site)" },
          { value: "<1 in 10", label: "users retry after a zero-result search" },
          { value: "2-3x", label: "conversion rate of search users vs non-search users" },
          { value: "0%", label: "amount of that revenue you keep with broken search" },
        ],
      },
      {
        type: "h2",
        id: "case-study",
        text: "Case study: Nigerian fashion retailer",
      },
      {
        type: "p",
        text: "A 35-store fashion brand we work with had 11,000 monthly searches on their site. Of those, 38% returned zero results — visitors typed colour names ('emerald'), occasion words ('owambe'), style terms ('coquette'), and brand-internal codes the catalogue didn't index.",
      },
      {
        type: "p",
        text: "We replaced the search with a vector-based AI model that understands semantic meaning. The visitor types 'something elegant for a wedding'; the search returns the relevant products. Took 12 days to ship.",
      },
      {
        type: "stats",
        items: [
          { value: "38% → 4%", label: "zero-result searches" },
          { value: "+312%", label: "search-driven revenue in 30 days" },
          { value: "+18%", label: "site-wide conversion rate" },
          { value: "1.4 sec", label: "median search response time" },
        ],
      },
      {
        type: "callout",
        variant: "success",
        title: "Why this one is the easiest first integration",
        text: "Site search is contained, measurable, and high-intent. You don't need to retrain anything brand-related. You don't risk breaking your funnel. And the lift shows up in week one.",
      },
      {
        type: "h2",
        id: "how-it-works",
        text: "How it works under the hood",
      },
      {
        type: "p",
        text: "We index your products, articles, or service pages as embeddings (mathematical representations of meaning) in a vector database. When someone searches, their query is also turned into an embedding. The system returns the closest matches by meaning, not by keyword. The whole stack runs for under $50/month for most businesses.",
      },
      {
        type: "h2",
        id: "when-not-to-do-it",
        text: "When NOT to do it",
      },
      {
        type: "list",
        items: [
          "If your site has fewer than 50 indexable items — old search is fine.",
          "If your search terminology is highly technical and exact-match matters (legal codes, drug names, SKUs).",
          "If your search traffic is below 200 queries/month — the lift won't be measurable.",
        ],
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
  {
    slug: "ai-roi-framework",
    title:
      "The 90-day AI integration roadmap for non-technical business owners",
    excerpt:
      "A week-by-week, decision-by-decision plan for adding AI to your website without hiring a technical team or burning budget on the wrong experiments.",
    category: "Case Study",
    author: "Adaeze Okafor",
    authorRole: "Head of Strategy, Blaze Studio",
    authorInitials: "AO",
    authorColor: "bg-primary/15 text-primary",
    date: "Feb 28, 2026",
    readTime: "11 min read",
    gradient: "from-pink-500 via-rose-600 to-red-600",
    pattern:
      "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.2) 0, transparent 55%)",
    tags: ["AI Strategy", "Roadmap", "ROI"],
    keyTakeaways: [
      "Don't ship anything in the first two weeks. Audit and pick exactly one win.",
      "Be able to fill the blanks: 'In 90 days this will move X from Y to Z.'",
      "Expand only after the first integration is shipped, measured, and proven.",
      "Treat AI rollout like hiring — one at a time, one owner, honest measurement.",
    ],
    content: [
      {
        type: "p",
        text: "Most AI rollouts fail not because the technology doesn't work — it does. They fail because there's no plan. The owner reads an article, gets excited, asks an agency to 'add AI', and three months later there's a chatbot nobody uses and a $4,000 invoice. This is the plan we wish more business owners had before they started.",
      },
      {
        type: "h2",
        id: "weeks-1-2",
        text: "Weeks 1-2: Audit and pick one win",
      },
      {
        type: "p",
        text: "Resist the urge to ship anything in the first two weeks. Instead, do three things:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Map your funnel.** From first visit to closed deal. Where are people falling out?",
          "**List your 10 most repetitive tasks.** Email replies, lookups, FAQ answers, lead routing. Time them.",
          "**Pick one win.** The one place where AI would save the most hours OR move the most revenue. Just one.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "The 'one number' rule",
        text: "Before week 3, you should be able to finish this sentence: 'In 90 days, this AI integration will move [specific metric] from [X] to [Y].' If you can't fill the blanks in, you're not ready to build.",
      },
      {
        type: "h2",
        id: "weeks-3-6",
        text: "Weeks 3-6: Ship the first integration",
      },
      {
        type: "p",
        text: "Hire a partner who's done it before (in-house dev teams take 3x longer for the first one). Scope tightly. Ship narrow. The first integration should solve one problem perfectly, not three problems badly.",
      },
      {
        type: "p",
        text: "During this phase, make sure you have:",
      },
      {
        type: "list",
        items: [
          "A clear baseline measurement (you can't claim a lift if you don't know the starting number)",
          "A human escape hatch on every AI surface",
          "A weekly check-in to look at what visitors are actually saying to the AI",
          "An owner inside your business — someone whose job is 'this thing works'",
        ],
      },
      {
        type: "h2",
        id: "weeks-7-10",
        text: "Weeks 7-10: Measure honestly",
      },
      {
        type: "p",
        text: "This is where most rollouts go quiet. Don't let yours. After 30 days of live traffic, compare the new number to the baseline. Three outcomes are possible:",
      },
      {
        type: "list",
        items: [
          "**Big win (>20% lift).** Document what worked, share it internally, plan integration #2.",
          "**Small win (5-20%).** Look at where AI is dropping conversations. Fix the top 3 gaps. Re-measure in 2 weeks.",
          "**No win.** Be honest. Either the use case was wrong, the implementation was wrong, or the measurement was wrong. Fix the cause, not the AI.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "The most common reason for 'no win'",
        text: "It almost always traces back to weeks 1-2. The use case was picked emotionally rather than analytically. Go back and re-do the audit honestly.",
      },
      {
        type: "h2",
        id: "weeks-11-13",
        text: "Weeks 11-13: Add integration #2",
      },
      {
        type: "p",
        text: "Only now — with one integration shipped, measured, and proven — do you add the second. The order that compounds best in our experience:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "AI search OR conversational lead qualification (whichever fits your funnel)",
          "Predictive lead scoring + automated routing",
          "AI-assisted SEO content workflow",
          "Personalised landing experiences",
        ],
      },
      {
        type: "h2",
        id: "what-it-costs-end-to-end",
        text: "What 90 days actually costs",
      },
      {
        type: "stats",
        items: [
          { value: "$3-8K", label: "Build cost for first integration" },
          { value: "$80-400", label: "Monthly running cost (all-in)" },
          { value: "30-90 days", label: "Typical payback period" },
          { value: "1 person", label: "Internal owner needed (not full-time)" },
        ],
      },
      {
        type: "h2",
        id: "the-mindset",
        text: "The mindset that wins",
      },
      {
        type: "p",
        text: "Treat AI integration the way you'd treat hiring. You wouldn't hire five people in week one. You'd hire one, train them well, see them succeed, then hire the next. Same logic, same patience, same honest measurement. Businesses that take this approach quietly outperform their competitors over 12 months. Businesses that try to 'do AI' all at once usually have nothing to show for it.",
      },
      { type: "divider" },
      {
        type: "p",
        text: CTA_PARAGRAPH,
      },
    ],
  },
];

export const CATEGORIES: ("All" | Category)[] = [
  "All",
  "AI Strategy",
  "AI Chatbots",
  "Personalization",
  "AI SEO",
  "Lead Generation",
  "AI Search",
  "Case Study",
];

export const categoryColor: Record<Category, string> = {
  "AI Strategy": "bg-primary/10 text-primary border-primary/20",
  "AI Chatbots": "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Personalization: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "AI SEO": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "Lead Generation": "bg-sky-500/10 text-sky-700 border-sky-500/20",
  "AI Search": "bg-lime-600/10 text-lime-700 border-lime-600/20",
  "Case Study": "bg-rose-500/10 text-rose-700 border-rose-500/20",
};

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPostBySlug(slug);
  if (!current) return POSTS.slice(0, limit);
  return POSTS.filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 1 : 0;
      const bMatch = b.category === current.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}
