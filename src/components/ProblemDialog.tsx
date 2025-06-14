'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Problem, QuizProblem } from '@/types'
import CodeEditor from './CodeEditor'
import { useState } from 'react'

interface ProblemDialogProps {
  isOpen: boolean
  onClose: () => void
  problem: Problem
}

function isNormalProblem(problem: Problem): problem is import('@/types').NormalProblem {
  return (problem as any).description !== undefined;
}

export default function ProblemDialog({ isOpen, onClose, problem }: ProblemDialogProps) {
  const [code, setCode] = useState('solution' in problem ? problem.solution : '')
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  // Quiz rendering
  if ('type' in problem && problem.type === 'quiz') {
    const quiz = problem as QuizProblem
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] h-[600px] p-0 overflow-y-auto">
          <div className="flex h-full min-h-0">
            {/* Quiz Section (left) */}
            <div className="w-1/2 p-6 space-y-6 border-r overflow-y-auto max-h-[600px]">
              <h2 className="text-lg font-semibold mb-2">{quiz.title}</h2>
              <div className="mb-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: quiz.question.replace(/\n/g, '<br/>').replace(/```js([\s\S]*?)```/g, '<pre><code>$1</code></pre>') }} />
              <div className="space-y-2">
                {quiz.choices.map((choice, idx) => (
                  <label key={idx} className={`flex items-center p-2 border rounded cursor-pointer ${selected === idx ? 'border-primary' : 'border-muted'}`}>
                    <input
                      type="radio"
                      name="quiz-choice"
                      checked={selected === idx}
                      onChange={() => { setSelected(idx); setAnswered(true); }}
                      className="mr-2"
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
              {answered && (
                <div className="mt-4">
                  {selected === quiz.correctAnswer ? (
                    <span className="text-green-600 font-semibold">Correct!</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Incorrect.</span>
                  )}
                </div>
              )}
            </div>
            {/* Explanation Section (right) */}
            <div className="w-1/2 p-6 flex items-center justify-center overflow-y-auto max-h-[600px]">
              {answered && quiz.explanation && (
                <div className="bg-muted rounded p-4 text-sm text-muted-foreground max-w-md">
                  <span className="font-semibold block mb-2">Explanation:</span>
                  {quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Normal problem rendering
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[80vh] p-0">
        <div className="flex h-full">
          {/* Editor Section */}
          <div className="w-1/2 border-r">
            <div className="h-[40px] border-b px-4 flex items-center bg-muted">
              <h3 className="text-sm font-medium">Editor</h3>
            </div>
            <div className="h-[calc(80vh-40px)]">
              <CodeEditor
                value={code}
                onChange={handleEditorChange}
              />
            </div>
          </div>

          {/* Solution Section */}
          <div className="w-1/2">
            <div className="h-[40px] border-b px-4 flex items-center bg-muted">
              <h3 className="text-sm font-medium">Solution</h3>
            </div>
            <div className="h-[calc(80vh-40px)] overflow-y-auto p-4">
              <div className="space-y-6">
                {isNormalProblem(problem) && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {problem.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Test Cases</h3>
                      <div className="space-y-2">
                        {Array.isArray(problem.testCases) && problem.testCases.length > 0 ? (
                          problem.testCases.map((testCase, index) => (
                            <div key={index} className="rounded-md bg-muted p-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Input:</p>
                                <pre className="text-sm text-muted-foreground">{testCase.input}</pre>
                              </div>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm font-medium">Output:</p>
                                <pre className="text-sm text-muted-foreground">{testCase.output}</pre>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">No test cases available.</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 