import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Card from '@theme/Card';
import Button from '@theme/Button';
import Admonition from '@theme/Admonition';
import CodeBlock from '@theme/CodeBlock';
import styles from './LabDisplay.module.css';

interface LabTask {
  task_id: string;
  description: string;
  expected_output_hint: string;
}

interface LabData {
  chapter_title: string;
  lab_id: string;
  tasks: LabTask[];
}

interface LabSubmissionResult {
  lab_id: string;
  passed: boolean;
  feedback: string;
}

interface LabDisplayProps {
  chapterContent: string;
  chapterTitle: string;
  userId: string; // Assuming user ID is available for authentication
}

const LabDisplay: React.FC<LabDisplayProps> = ({ chapterContent, chapterTitle, userId }) => {
  const [lab, setLab] = useState<LabData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string>('');
  const [submissionResult, setSubmissionResult] = useState<LabSubmissionResult | null>(null);

  const fetchLab = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = "DUMMY_TOKEN"; // Replace with actual token retrieval for the logged-in user
      const response = await fetch('/api/labs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chapter_content: chapterContent, chapter_title: chapterTitle }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate lab: ${response.statusText}`);
      }
      const data: LabData = await response.json();
      setLab(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!lab || !submittedCode) return;

    setLoading(true);
    setError(null);
    try {
      const token = "DUMMY_TOKEN"; // Replace with actual token retrieval
      const response = await fetch('/api/labs/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ lab_id: lab.lab_id, submitted_code: submittedCode }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit lab: ${response.statusText}`);
      }
      const data: LabSubmissionResult = await response.json();
      setSubmissionResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optionally fetch lab automatically when component mounts or chapter changes
    // fetchLab();
  }, [chapterContent, chapterTitle, userId]);

  if (loading) return <div>Loading lab...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.labContainer}>
      <h2>Lab for {chapterTitle}</h2>
      {!lab && (
        <Button onClick={fetchLab} disabled={loading} className={styles.labButton}>
          Generate Lab Tasks
        </Button>
      )}

      {lab && (
        <div>
          <h3>Lab ID: {lab.lab_id}</h3>
          {lab.tasks.map(task => (
            <Card key={task.task_id} className={styles.labCard}>
              <h4>Task {task.task_id}</h4>
              <p className={styles.taskDescription}>{task.description}</p>
              <p className={styles.hintText}><em>Hint: {task.expected_output_hint}</em></p>
            </Card>
          ))}

          <div className={styles.codeSubmissionSection}>
            <h4>Your Code Submission</h4>
            <CodeBlock
              language="python" // Assuming Python labs, can be dynamic if needed
              className={styles.codeEditor}>
              {submittedCode}
            </CodeBlock>
            <textarea
              className={clsx(styles.codeEditor, styles.hiddenTextarea)} // Hide the textarea, CodeBlock is for display
              value={submittedCode}
              onChange={(e) => setSubmittedCode(e.target.value)}
              disabled={!!submissionResult}
              placeholder="Write your code here..."
            />
            <br />
            {!submissionResult && (
              <Button onClick={handleSubmitCode} disabled={loading || !submittedCode} className={styles.labButton}>
                Submit Code
              </Button>
            )}
          </div>

          {submissionResult && (
            <Admonition
              type={submissionResult.passed ? 'success' : 'danger'}
              title={`Submission Result for ${submissionResult.lab_id}`}>
              <p>Status: {submissionResult.passed ? 'Passed' : 'Failed'}</p>
              <p>Feedback: {submissionResult.feedback}</p>
            </Admonition>
          )}
        </div>
      )}
    </div>
  );
};

export default LabDisplay;
