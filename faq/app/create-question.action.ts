"use server";
import { z } from "zod";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export interface CreateQuestionInput {
  title: string;
}

const CreateQuestionValidation = z.object({
  title: z.string({ required_error: "Title Required" }),
});

export async function createQuestionAction(formData: FormData) {
  const data = CreateQuestionValidation.parse({
    title: formData.get("title"),
  });

  await db.question.create({
    data: {
      title: data.title,
      topic: {
        connectOrCreate: {
          where: { id: 1 },
          create: {
            slug: "x",
            title: "x",
          },
        },
      },
    },
  });
  revalidatePath("/");
}
