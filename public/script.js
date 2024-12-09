// Gerar quadro de números
const numberGrid = document.getElementById('numberGrid');
for (let i = 1; i <= 250; i++) {
  const numberDiv = document.createElement('div');
  numberDiv.className = 'number';
  numberDiv.textContent = i;
  numberGrid.appendChild(numberDiv);
}

// Carregar dados armazenados
fetch('/data')
  .then(response => response.json())
  .then(data => {
    const storedDataList = document.getElementById('storedDataList');
    data.forEach(entry => {
      const listItem = document.createElement('li');
      listItem.textContent = `Número: ${entry.number}, Nome: ${entry.name}`;
      storedDataList.appendChild(listItem);

      // Mudar a cor do número no quadro
      const numberDivs = document.querySelectorAll('.number');
      numberDivs.forEach(div => {
        if (div.textContent == entry.number) {
          div.classList.add('red');
        }
      });
    });
  });

// Manipular envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginErrorMessage = document.getElementById('loginErrorMessage');

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) });
    }
    return response.text();
  })
  .then(message => {
    alert(message);
    loginErrorMessage.textContent = '';
    document.getElementById('dataSection').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
  })
  .catch(error => {
    loginErrorMessage.textContent = error.message;
    alert(error.message);
  });
});

// Manipular envio do formulário de dados
document.getElementById('dataForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const number = document.getElementById('numberInput').value;
  const name = document.getElementById('nameInput').value;
  const errorMessage = document.getElementById('errorMessage');
  const storedDataList = document.getElementById('storedDataList');

  if (!number || !name) {
    errorMessage.textContent = 'Por favor, preencha todos os campos.';
    alert('Por favor, preencha todos os campos.');
    return;
  }

  fetch('/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ number, name })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text) });
    }
    return response.text();
  })
  .then(message => {
    alert(message);
    errorMessage.textContent = '';

    // Mudar a cor do número no quadro
    const numberDivs = document.querySelectorAll('.number');
    numberDivs.forEach(div => {
      if (div.textContent == number) {
        div.classList.add('red');
      }
    });

    // Adicionar dados armazenados à lista
    const listItem = document.createElement('li');
    listItem.textContent = `Número: ${number}, Nome: ${name}`;
    storedDataList.appendChild(listItem);
  })
  .catch(error => {
    errorMessage.textContent = error.message;
    alert(error.message);
  });
});
