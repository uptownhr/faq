"use server";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(id: number): Promise<boolean> {
  return db.question
    .delete({
      where: { id },
    })
    .then((res) => {
      revalidatePath("/");
      return true;
    })
    .catch((err) => false);
}
