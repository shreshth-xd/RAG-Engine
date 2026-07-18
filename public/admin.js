const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const reindexButton = document.getElementById('reindexButton');
const status = document.getElementById('status');

loginButton.addEventListener('click', async () => {
  const password = passwordInput.value;

  status.textContent = '';

  try {
    const response = await fetch('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Invalid password.');
    }

    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
  } catch (error) {
    status.textContent = 'Invalid password.';
  }
});

reindexButton.addEventListener('click', async () => {
  reindexButton.disabled = true;
  status.textContent = 'Indexing...';

  try {
    const response = await fetch('/admin/reindex', {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Indexing failed.');
    }

    status.textContent = 'Index completed successfully.';
  } catch (error) {
    status.textContent = 'Indexing failed.';
  } finally {
    reindexButton.disabled = false;
  }
});
