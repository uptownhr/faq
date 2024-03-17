'use client';
import { useState } from 'react';
import { addAnswerActionType } from '@/app/topic/[slug]/page';

interface AddAnswerModalProps {
  topicSlug: string;
  questionId: number;
  addAnswerAction: addAnswerActionType;
}

export function AddAnswerModal(props: AddAnswerModalProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(!showModal)}>Add Answer</button>
      {showModal ? (
        <div>
          <div>
            <div>
              <form
                action={props.addAnswerAction.bind(
                  undefined,
                  props.topicSlug,
                  props.questionId
                )}
              >
                <div>
                  <label htmlFor="answer">Answer</label>
                  <textarea id="answer" name="answer" />
                  <input
                    type="hidden"
                    name="questionId"
                    value={props.questionId}
                  />
                </div>
                <div>
                  <button>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
