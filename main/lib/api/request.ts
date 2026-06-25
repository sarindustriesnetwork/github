import { z } from "zod";
import { validationError } from "@/lib/api/response";

export async function parseJsonBody<TSchema extends z.ZodTypeAny>(request: Request, schema: TSchema) {
  try {
    const body = await request.json();
    return { data: schema.parse(body) as z.infer<TSchema>, response: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { data: null, response: validationError("Request body validation failed.", error.flatten()) };
    }

    return { data: null, response: validationError("Invalid JSON request body.") };
  }
}
