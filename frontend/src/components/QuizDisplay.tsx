import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Card from '@theme/Card';
import Button from '@theme/Button';
import Admonition from '@theme/Admonition';
import styles from './QuizDisplay.module.css';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  question_id: string;
  text: string;
  options: QuizOption[];
}

interface QuizData {
  chapter_title: string;
  questions: QuizQuestion[];
}

interface QuizSubmissionResult {
  quiz_id: string;
  score: number;
  total_questions: number;
  feedback: { [question_id: string]: { correct: boolean; submitted_answer: string } };
}

interface QuizDisplayProps {
  chapterContent: string;
  chapterTitle: string;
  userId: string; // Assuming user ID is available for authentication
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ chapterContent, chapterTitle, userId }) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = "DUMMY_TOKEN"; // Replace with actual token retrieval for the logged-in user
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chapter_content: chapterContent, chapter_title: chapterTitle }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate quiz: ${response.statusText}`);
      }
      const data: QuizData = await response.json();
      setQuiz(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setLoading(true);
    setError(null);
    try {
      const token = "DUMMY_TOKEN"; // Replace with actual token retrieval
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quiz_id: chapterTitle, submissions: selectedAnswers }), // Using chapterTitle as quiz_id for simplicity
      });

      if (!response.ok) {
        throw new Error(`Failed to submit quiz: ${response.statusText}`);
      }
      const data: QuizSubmissionResult = await response.json();
      setSubmissionResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch quiz automatically when component mounts or chapter changes
    // fetchQuiz();
  }, [chapterContent, chapterTitle, userId]);

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.quizContainer}>
      <h2>Quiz for {chapterTitle}</h2>
      {!quiz && (
        <Button onClick={fetchQuiz} disabled={loading} className={styles.quizButton}>
          Generate Quiz
        </Button>
      )}

      {quiz && (
        <div>
          {quiz.questions.map(question => (
            <Card key={question.question_id} className={styles.quizCard}>
              <h3 className={styles.questionText}>{question.text}</h3>
              <div>
                {question.options.map(option => (
                  <label key={option.id} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name={question.question_id}
                      value={option.id}
                      checked={selectedAnswers[question.question_id] === option.id}
                      onChange={() => handleOptionChange(question.question_id, option.id)}
                      disabled={!!submissionResult}
                    />
                    {option.text}
                  </label>
                ))}
              </div>
              {submissionResult && submissionResult.feedback[question.question_id] && (
                <Admonition
                  type={submissionResult.feedback[question.question_id].correct ? 'success' : 'danger'}
                  title={submissionResult.feedback[question.question_id].correct ? 'Correct!' : 'Incorrect'}>
                  <p>
                    {submissionResult.feedback[question.question_id].correct
                      ? ''
                      : `You selected: ${option.text}`}
                  </p>
                </Admonition>
              )}
            </Card>
          ))}
          {!submissionResult && (
            <Button onClick={handleSubmitQuiz} disabled={loading || Object.keys(selectedAnswers).length === 0} className={styles.quizButton}>
              Submit Quiz
            </Button>
          )}
          {submissionResult && (
            <Admonition
              type={submissionResult.score >= quiz.questions.length / 2 ? 'success' : 'danger'}
              title={`Your Score: ${submissionResult.score} / ${submissionResult.total_questions}`}>
              <p>Review your answers above.</p>
            </Admonition>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;
