import * as z from "zod";

const productSchema = z.object({
  title: z.string().min(6),
  price: z.number().min(0),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
  categoryID: z.string().min(1).optional(),
});

export default productSchema;
