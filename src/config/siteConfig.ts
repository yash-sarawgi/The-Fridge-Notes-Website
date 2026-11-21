import { SiteConfig } from "@/types";

/**
 * Central Configuration for The Fridge Notes
 * 
 * Changing the site name, tagline, or theme properties here
 * automatically updates the entire application everywhere.
 */
export const siteConfig: SiteConfig = {
  name: "The Fridge Notes",
  fridgeBadgeText: "THE FRIDGE NOTES",
  tagline: "A little taste of home.",
  subIntro: "Recipes, experiments and things worth making again.",
  description: "An interactive vintage refrigerator displaying delicious handmade recipes on sticky notes, polaroids, and kitchen reminders.",
  authorName: "The Family Kitchen",
  defaultAudioEnabled: false,
  colors: {
    fridgeCream: "#faf5ec",
    fridgeCreamLight: "#fffefb",
    fridgeCreamDark: "#e8ded1",
    chromeAccent: "#b8c0c8",
  },
};
