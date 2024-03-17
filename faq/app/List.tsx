"use client";
import { Question } from "@/generated/client";

import { deleteQuestion } from "@/app/delete-question.action";

export const List = ({ x }: { x: Array<Question> }) => {
  return (
    <div>
      {x.map((answer) => (
        <p key={answer.id} onClick={() => deleteQuestion(answer.id)}>
          {answer.id} - {answer.title} | {answer.createdAt.toLocaleTimeString()}
        </p>
      ))}
    </div>
  );
};
