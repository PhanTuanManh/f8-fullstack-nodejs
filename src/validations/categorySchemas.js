import * as z from "zod";

const categorySchema = z.object({
  title: z.string().min(6),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
  slug: z.string().optional(),
  products: z.array(z.string()).optional(),
});

export default categorySchema;
