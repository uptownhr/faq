"use server";
import { Question } from "@/generated/client";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { CreateQuestionInput } from "@/app/create-question.action";

export async function getQuestionAction(
  input: CreateQuestionInput,
): Promise<Question[]> {
  const answers = await db.question.findMany();
  revalidatePath("/");
  return answers;
}
