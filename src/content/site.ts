// Everything Anjusha might want to edit lives in this one file.

export const person = {
  firstName: "Anjusha",
  fullName: "Anjusha Khandavalli",
  role: "front-end developer",
  city: "Sydney, Australia",
  email: "anjusha.khandavalli@gmail.com",
  hireSubject: "👋 Hi Anjusha, I'd like to talk to you about a role",
  // Shown on the thin rail at the left edge, like the reference site.
  rail: "© MMXXVI. Made in Sydney.",
};

export type SocialKey = "github" | "linkedin" | "devto" | "medium" | "email";

export const socials: { key: SocialKey; label: string; href: string }[] = [
  { key: "github", label: "Visit my GitHub", href: "https://github.com/anjusha-k" },
  { key: "linkedin", label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/anjusha-khandavalli/" },
  { key: "devto", label: "Read me on DEV", href: "https://dev.to/anjushakhandavalli" },
  { key: "medium", label: "Read me on Medium", href: "https://medium.com/@anjusha.khandavalli" },
  { key: "email", label: "Send me an email", href: `mailto:${person.email}` },
];

export const pages = [
  { href: "/", label: "Home", blurb: "Back to the home page.", theme: "home" },
  { href: "/work", label: "Work", blurb: "What I've built, and where.", theme: "work" },
  { href: "/about", label: "About", blurb: "A little about me and my background.", theme: "about" },
  { href: "/writing", label: "Writing", blurb: "Notes on React, CSS and Git.", theme: "writing" },
] as const;

export type ThemeKey = (typeof pages)[number]["theme"];

export function themeFor(pathname: string): ThemeKey {
  const match = pages.find((p) => p.href !== "/" && pathname.startsWith(p.href));
  return match ? match.theme : "home";
}

export const jobs = [
  {
    when: "Apr 2022 – Now",
    place: "Sydney",
    title: "Software Developer, Frontend",
    company: "HelloFresh",
    points: [
      "Led the move of Australian local services onto HelloFresh's global supply chain platform.",
      "Sole front-end developer on the Claims Management System, from first commit to launch.",
      "Built an Incident Management System connected to Jira for tracking supply chain problems.",
      "Built AU/NZ operations tools, including order forecasting, with Next.js, TypeScript, MUI and Redux.",
      "Set up CI/CD with GitHub Actions and SonarQube, and feature flags for safe, gradual releases.",
    ],
  },
  {
    when: "Jul 2019 – Mar 2022",
    place: "Hyderabad",
    title: "Application Developer",
    company: "ThoughtWorks",
    points: [
      "Built the IDFC FIRST Bank website, Android app and iPhone app (10M+ downloads on Google Play).",
      "Shipped deep linking, two-factor login, force-upgrade and UPI payments.",
      "Worked on the user interface of BHIM, India's UPI payments app made by NPCI.",
      "Worked on payment flows for everyday customers and business accounts.",
      "Built a travel booking app in Elixir that joined several bus and train sites into one.",
    ],
  },
  {
    when: "May 2018 – May 2019",
    place: "Bangalore",
    title: "Intern",
    company: "Intel",
    points: [
      "Reproduced and fixed bugs in processor validation tools, using GDB, Linux and x86.",
      "Helped upgrade the GCC toolchain from C98 to C11.",
    ],
  },
];

export type IllustrationKey = "claims" | "incident" | "banking" | "payments" | "delivery";

export type ProjectLink = { label: "Google Play" | "App Store" | "Website"; href: string };

export const projects: {
  slug: string;
  name: string;
  tag: string;
  art: IllustrationKey;
  body: string[];
  tech: string[];
  links?: ProjectLink[];
}[] = [
  {
    slug: "claims",
    name: "Claims Management",
    tag: "HelloFresh · Internal tool",
    art: "claims",
    body: [
      "I was the only front-end developer, from setting up the repo to launch day.",
      "The screens and notifications change based on where each claim is in its workflow. The Australian team gave it outstanding feedback, and that led to more projects.",
    ],
    tech: ["Next.js", "TypeScript", "MUI", "Redux", "Testing Library"],
  },
  {
    slug: "incident",
    name: "Incident Management",
    tag: "HelloFresh · Internal tool",
    art: "incident",
    body: [
      "A system for tracking supply chain problems as they happen.",
      "It creates and syncs Jira tickets, and keeps data from several sources linked and correct.",
    ],
    tech: ["Next.js", "TypeScript", "Jira API", "GitHub Actions"],
  },
  {
    slug: "idfc",
    name: "IDFC FIRST Bank",
    tag: "ThoughtWorks · Banking app",
    art: "banking",
    body: [
      "The bank's customer app on Android and iPhone, plus its website. The app has over 10 million downloads on Google Play.",
      "I built two-factor login, deep links, force upgrades and UPI payments, and worked on payment flows for everyday customers and business accounts.",
    ],
    tech: ["React", "React Native", "Jest", "Enzyme"],
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.idfcfirstbank.optimus" },
      { label: "App Store", href: "https://apps.apple.com/app/id1521443352" },
      { label: "Website", href: "https://www.idfcfirst.bank.in/" },
    ],
  },
  {
    slug: "bhim",
    name: "BHIM UPI",
    tag: "ThoughtWorks · Payments app",
    art: "payments",
    body: [
      "BHIM is India's own UPI payments app, made by NPCI (National Payments Corporation of India). It has over 100 million downloads on Google Play.",
      "I worked on the app's user interface: the screens people use to send and receive money.",
    ],
    tech: ["React Native"],
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=in.org.npci.upiapp" },
      { label: "App Store", href: "https://apps.apple.com/app/id1200315258" },
      { label: "Website", href: "https://www.bhimupi.org.in/" },
    ],
  },
  {
    slug: "delivery",
    name: "Delivery Manager",
    tag: "Side project · Web + Android",
    art: "delivery",
    body: [
      "I took a friend's business online with a web app and an Android app.",
      "It has Google Maps for routes and secure login on both platforms. I handled everything from setup to launch.",
    ],
    tech: ["React Native", "React", "Node.js", "MongoDB", "Google Maps"],
  },
];

export const skillGroups = [
  { name: "Front end", items: ["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "React Native", "Redux", "HTML5", "CSS", "MUI"] },
  { name: "Testing", items: ["Jest", "React Testing Library", "Enzyme", "TDD"] },
  { name: "Tools", items: ["GitHub Actions", "SonarQube", "LaunchDarkly", "Sentry", "Grafana", "AWS", "BrowserStack", "Postman"] },
  { name: "Also", items: ["Python", "Go", "Linux", "Android Studio", "Xcode"] },
];

export const stats = [
  { value: "7+", label: "years building for web and mobile" },
  { value: "80%", label: "test coverage kept across projects" },
  { value: "2", label: "systems built as the sole front-end developer" },
  { value: "9.64", label: "CGPA in Computer Science" },
];

export const hobbies = [
  { name: "Travel", note: "New places, new food" },
  { name: "Photography", note: "All on my phone" },
  { name: "Quilling", note: "Paper art, one curl at a time" },
  { name: "Cooking", note: "Testing recipes, not just code" },
];

export const awards = [
  { name: "Pratibha Award, 2019", by: "Government of Andhra Pradesh" },
  { name: "Winner, National Entrepreneurship Challenge", by: "IIT Bombay" },
  { name: "B.Tech, Computer Science", by: "IIIT RGUKT RK Valley · CGPA 9.64" },
];
