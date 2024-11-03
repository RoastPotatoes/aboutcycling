import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional()
  }),
});

const bikes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string()
  }),
});

const updates = defineCollection({
  type: "content",
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    description: z.string().optional(),
    bikeSlug: z.string(), // Add bikeSlug to link each update to a specific bike
  }),
});


const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    demoURL: z.string().optional(),
    eventURL: z.string().optional()
  }),
});

export const collections = { blog, bikes, events , updates};
