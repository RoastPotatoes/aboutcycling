import type { Site, Metadata, Socials } from "@types";



export const SITE: Site = {
  NAME: "About Cycling",
  EMAIL: "",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_BIKES_ON_HOMEPAGE: 2,
  NUM_EVENTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Astro Nano is a minimal and lightweight blog and portfolio.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const BIKES: Metadata = {
  TITLE: "Bikes",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const EVENTS: Metadata = {
  TITLE: "Events",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "",
  },
  { 
    NAME: "github",
    HREF: ""
  },
  { 
    NAME: "linkedin",
    HREF: "",
  }
];
