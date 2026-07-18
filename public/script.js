const questionInput = document.getElementById('question');
const askButton = document.getElementById('askButton');
const status = document.getElementById('status');
const answerOutput = document.getElementById('answer');

askButton.addEventListener('click', async () => {
  const question = questionInput.value.trim();

  if (!question) {
    answerOutput.value = '';
    status.textContent = 'Enter a question.';
    return;
  }

  askButton.disabled = true;
  status.textContent = 'Generating...';
  answerOutput.value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong.');
    }

    answerOutput.value = data.answer || '';
    status.textContent = '';
  } catch (error) {
    answerOutput.value = 'Something went wrong.';
    status.textContent = '';
  } finally {
    askButton.disabled = false;
  }
});
