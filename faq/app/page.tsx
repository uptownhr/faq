import { List } from "@/app/List";
import { getQuestionAction } from "@/app/get-questions.action";
import { createQuestionAction } from "@/app/create-question.action";

export default async function Home() {
  const questions = await getQuestionAction({ title: "test 1234" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={createQuestionAction}>
        <input type="text" name="title" />
        <button type="submit">Update User Name</button>
      </form>
      <List x={questions} />
    </main>
  );
}
