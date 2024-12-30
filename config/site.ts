export type SiteConfig = typeof siteConfig;

export const TABLE_VERSIONS = "5";
export const LIVE_UPDATE = true;

export const siteConfig = {
  name: "Doctelligence Contributor",
  description: "An interface for doctelligence contributors",
  navItems: [
    {
      label: "Home",
      href: "https://doctelligence.com",
    },
    // {
    //   label: "Project Management",
    //   href: "https://pm.doctelligence.com",
    // },
    // {
    //   label: "Validators",
    //   href: "https://validator.doctelligence.com",
    // },
  ],
  navMenuItems: [] as { label: string; href: string }[],
  links: {
    github: "https://github.com/Doctelligence",
    twitter: "https://x.com/doctelligence",
    docs: "https://doctelligence.com",
    discord: "https://discord.com/invite/Z5592FHb",
    slack: "https://doctelligence.slack.com",
  },
};
