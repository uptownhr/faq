import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AddAnswerModal } from '@/app/topic/[slug]/AddAnswerModal';

interface TopicPageParams {
  slug: string;
}

const CreateQuestionValidation = z.object({
  title: z.string({ required_error: 'Title Required' }),
});

export async function addTopicQuestion(slug: string, formData: FormData) {
  'use server';
  const data = CreateQuestionValidation.parse({
    title: formData.get('title'),
  });

  await db.question.create({
    data: {
      title: data.title,
      topic: {
        connect: {
          slug,
        },
      },
    },
  });
  revalidatePath(`/topic/${slug}`);
}

const AddAnswerValidation = z.object({
  answer: z.string({ required_error: 'Title Required' }),
});

export async function addAnswerAction(
  topicSlug: string,
  questionId: number,
  formData: FormData
) {
  'use server';

  console.log('questionId', questionId);
  console.log('formData', formData);

  const data = AddAnswerValidation.parse({
    answer: formData.get('answer'),
  });

  console.log('data', data);

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

  revalidatePath(`/topic/${topicSlug}`);
}

export default async function TopicPage({
  params,
}: {
  params: TopicPageParams;
}) {
  const topic = await db.topic.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!topic) throw new Error('Topic not found');

  const questions = await db.question.findMany({
    where: {
      topic: {
        is: {
          slug: params.slug,
        },
      },
    },
    include: {
      answers: true,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Topic Slug: {topic.title}</h1>

      <form action={addTopicQuestion.bind(undefined, params.slug)}>
        <input type="text" name="title" />
        <button type="submit">Add a new Question</button>
      </form>

      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            {question.title} - {question.createdAt.toLocaleTimeString()}
            <ul className="ml-4">
              <AddAnswerModal
                topicSlug={params.slug}
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
