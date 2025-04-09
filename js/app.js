// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
  
  // Проверка онлайн-статуса
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  function updateOnlineStatus() {
    const offlineStatus = document.getElementById('offline-status');
    if (navigator.onLine) {
      offlineStatus.classList.add('hidden');
    } else {
      offlineStatus.classList.remove('hidden');
    }
  }
  
  // Инициализация приложения
  document.addEventListener('DOMContentLoaded', () => {
    updateOnlineStatus();
    initApp();
  });
  
  function initApp() {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
  
    // Загрузка заметок при запуске
    loadNotes();
  
    // Обработчик добавления заметки
    addNoteBtn.addEventListener('click', addNewNote);
  
    // Также добавляем по Enter
    noteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNewNote();
      }
    });
  }
  
  function addNewNote() {
    const noteInput = document.getElementById('note-input');
    const noteText = noteInput.value.trim();
    
    if (noteText) {
      addNote(noteText);
      noteInput.value = '';
      noteInput.focus();
    }
  }
  
  // Добавление новой заметки
  function addNote(text) {
    const newNote = {
      id: Date.now(),
      text: text,
      date: new Date().toLocaleString()
    };
  
    let notes = getNotes();
    notes.unshift(newNote);
    saveNotes(notes);
    renderNotes();
  }
  
  // Начало редактирования заметки
  function startEditNote(id) {
    const notes = getNotes();
    const noteToEdit = notes.find(note => note.id === id);
    
    if (!noteToEdit) return;
    
    const noteElement = document.querySelector(`.note[data-id="${id}"]`);
    const contentElement = noteElement.querySelector('.note-content');
    const actionsElement = noteElement.querySelector('.note-actions');
    
    // Создаем форму редактирования
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
      <textarea class="edit-textarea">${noteToEdit.text}</textarea>
      <div class="edit-form-buttons">
        <button class="save-edit" onclick="saveEditedNote(${id})">Сохранить</button>
        <button class="cancel-edit" onclick="cancelEditNote(${id})">Отмена</button>
      </div>
    `;
    
    // Скрываем оригинальный контент и кнопки
    contentElement.style.display = 'none';
    actionsElement.style.display = 'none';
    
    // Вставляем форму редактирования
    noteElement.appendChild(editForm);
    
    // Фокусируемся на текстовом поле
    const textarea = editForm.querySelector('.edit-textarea');
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }
  
  // Сохранение отредактированной заметки
  function saveEditedNote(id) {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) return;
    
    const editTextarea = document.querySelector(`.note[data-id="${id}"] .edit-textarea`);
    const newText = editTextarea.value.trim();
    
    if (newText) {
      notes[noteIndex].text = newText;
      notes[noteIndex].date = new Date().toLocaleString();
      saveNotes(notes);
      renderNotes();
    }
  }
  
  // Отмена редактирования
  function cancelEditNote(id) {
    renderNotes();
  }
  
  // Удаление заметки
  function deleteNote(id) {
    let notes = getNotes();
    notes = notes.filter(note => note.id !== id);
    saveNotes(notes);
    renderNotes();
  }
  
  // Получение всех заметок
  function getNotes() {
    const notesJson = localStorage.getItem('notes');
    return notesJson ? JSON.parse(notesJson) : [];
  }
  
  // Сохранение заметок
  function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
  }
  
  // Загрузка заметок
  function loadNotes() {
    renderNotes();
  }
  
  // Отображение заметок
  function renderNotes() {
    const notesList = document.getElementById('notes-list');
    const notes = getNotes();
  
    if (notes.length === 0) {
      notesList.innerHTML = '<p class="empty-notes">Нет заметок</p>';
      return;
    }
  
    notesList.innerHTML = notes.map(note => `
      <div class="note" data-id="${note.id}">
        <div class="note-content">${note.text.replace(/\n/g, '<br>')}</div>
        <div class="note-date">${note.date}</div>
        <div class="note-actions">
          <button class="note-edit" onclick="startEditNote(${note.id})">Редактировать</button>
          <button class="note-delete" onclick="deleteNote(${note.id})">Удалить</button>
        </div>
      </div>
    `).join('');
  }
  
  // Глобальные функции для вызова из HTML
  window.startEditNote = startEditNote;
  window.saveEditedNote = saveEditedNote;
  window.cancelEditNote = cancelEditNote;
  window.deleteNote = deleteNote;