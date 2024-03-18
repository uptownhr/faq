import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AddAnswerModal } from '@/app/topic/[id]/AddAnswerModal';

interface TopicPageParams {
  id: string;
}

const CreateQuestionValidation = z.object({
  title: z.string({ required_error: 'Title Required' }),
});

async function addTopicQuestion(id: number, formData: FormData) {
  'use server';
  const data = CreateQuestionValidation.parse({
    title: formData.get('title'),
  });

  await db.question.create({
    data: {
      title: data.title,
      topic: {
        connect: {
          id,
        },
      },
    },
  });
  revalidatePath(`/topic/${id}`);
}

const AddAnswerValidation = z.object({
  answer: z.string({ required_error: 'Title Required' }),
});

async function addAnswerAction(
  topicId: number,
  questionId: number,
  formData: FormData
) {
  'use server';
  const data = AddAnswerValidation.parse({
    answer: formData.get('answer'),
  });

  await db.answer.create({
    data: {
      value: data.answer,
      question: {
        connect: {
          id: questionId,
        },
      },
    },
  });

  revalidatePath(`/topic/${topicId}`);
}

export type addAnswerActionType = typeof addAnswerAction;

export default async function TopicPage({
  params,
}: {
  params: TopicPageParams;
}) {
  const id = parseInt(params.id);
  const topic = await db.topic.findUnique({
    where: {
      id,
    },
  });

  if (!topic) throw new Error('Topic not found');

  const questions = await db.question.findMany({
    where: {
      topic: {
        is: {
          id,
        },
      },
    },
    include: {
      answers: true,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-1">
      <h1 className="text-xl mb-4">{topic.title}</h1>

      <form
        action={addTopicQuestion.bind(undefined, id)}
        className="flex flex-col"
      >
        <input type="text" name="title" placeholder="Can you do x?" />
        <button type="submit" className="mt-1">
          Add a new Question
        </button>
      </form>

      <ul className="mt-4">
        {questions.map((question) => (
          <li key={question.id}>
            {question.title} - {question.createdAt.toLocaleTimeString()}
            <ul className="ml-4">
              <AddAnswerModal
                topicId={id}
                questionId={question.id}
                addAnswerAction={addAnswerAction}
              />
              {question.answers.map((answer) => (
                <li key={answer.id}>
                  {answer.id} - {answer.value} -{' '}
                  {answer.createdAt.toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
