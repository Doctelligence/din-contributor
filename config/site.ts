export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Doctelligence Contributor",
  description: "An interface for doctelligence contributors",
  navItems: [
    {
      label: "Home",
      href: "https://doctelligence.com",
    },
    {
      label: "Project Management",
      href: "https://pm.doctelligence.com",
    },
    {
      label: "Validators",
      href: "https://validator.doctelligence.com",
    },
    // {
    //   label: "Validators",
    //   href: "/pricing",
    // },
    // {
    //   label: "Blog",
    //   href: "/blog",
    // },
    // {
    //   label: "About",
    //   href: "/about",
    // },
  ],
  navMenuItems: [
    // {
    //   label: "Profile",
    //   href: "/profile",
    // },
    // {
    //   label: "Dashboard",
    //   href: "/dashboard",
    // },
    // {
    //   label: "Projects",
    //   href: "/projects",
    // },
    // {
    //   label: "Team",
    //   href: "/team",
    // },
    // {
    //   label: "Calendar",
    //   href: "/calendar",
    // },
    // {
    //   label: "Settings",
    //   href: "/settings",
    // },
    // {
    //   label: "Help & Feedback",
    //   href: "/help-feedback",
    // },
    // {
    //   label: "Logout",
    //   href: "/logout",
    // },
  ] as { label: string; href: string }[],
  links: {
    github: "https://github.com/Doctelligence",
    twitter: "https://x.com/doctelligence",
    docs: "https://doctelligence.com",
    discord: "https://discord.com/invite/Z5592FHb",
    slack: "https://doctelligence.slack.com",
  },
};
