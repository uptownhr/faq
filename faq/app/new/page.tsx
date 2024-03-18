import { z } from 'zod';
import { db } from '@/db';
import { redirect } from 'next/navigation';

const CreateTopicValidation = z.object({
  title: z.string({ required_error: 'Title Required' }),
});

async function createTopicAction(formData: FormData) {
  'use server';

  const data = CreateTopicValidation.parse({
    title: formData.get('title'),
  });

  const topic = await db.topic.create({
    data: {
      slug: data.title.toLowerCase().replace(/ /g, '-'),
      title: data.title,
    },
  });

  redirect(`/topic/${topic.id}`);
}

export default async function New() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1">
      <form action={createTopicAction} className="flex flex-col">
        <input type="text" name="title" />
        <button className="mt-1" type="submit">
          Start new Topic
        </button>
      </form>
    </main>
  );
}
