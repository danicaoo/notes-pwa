📝 Offline Notes PWA
PWA Notes App
Offline Support
LocalStorage

Простое прогрессивное веб-приложение для создания заметок с полной офлайн-поддержкой и возможностью установки на домашний экран.

✨ Особенности

📲 Установка как PWA (работает как нативное приложение)
⚡ Офлайн-доступ (Service Worker кэширует ресурсы)
📝 CRUD для заметок (Создание, Чтение, Обновление, Удаление)
💾 Локальное хранение (использует localStorage)
📱 Адаптивный дизайн (оптимизирован для мобильных устройств)
🚀 Быстрый старт

1. Клонируйте репозиторий

bash
Copy
git clone https://github.com/ваш-username/notes-pwa.git
cd notes-pwa
2. Запустите приложение

Выберите один из вариантов:

🔹 С помощью Live Server (VS Code)

Установите расширение "Live Server"
Нажмите "Go Live" в правом нижнем углу
🔹 С помощью Python

bash
Copy
python3 -m http.server 8000
Откройте в браузере: http://localhost:8000

🛠 Технологии

mermaid
Copy
graph TD
    A[HTML] --> B[PWA]
    A --> C[CSS]
    A --> D[JavaScript]
    B --> E[Service Worker]
    B --> F[Web Manifest]
    D --> G[LocalStorage API]
    D --> H[DOM Manipulation]
📂 Структура проекта

Copy
/notes-pwa/
├── index.html        # Главная страница
├── manifest.json     # Конфигурация PWA
├── sw.js             # Service Worker
├── css/
│   └── style.css     # Стили приложения
└── js/
    └── app.js        # Основная логик

🔧 Основные функции

Добавление заметки

javascript
'''function addNote(text) {
  const newNote = {
    id: Date.now(),
    text: text,
    date: new Date().toLocaleString()
  };
  
  let notes = getNotes();
  notes.unshift(newNote);
  saveNotes(notes);
}'''
Редактирование заметки

javascript
Copy
function saveEditedNote(id) {
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  const newText = document.querySelector(`.edit-textarea`).value.trim();
  
  if (newText) {
    notes[noteIndex].text = newText;
    notes[noteIndex].date = new Date().toLocaleString();
    saveNotes(notes);
  }
}
🌐 PWA Конфигурация

manifest.json

json
Copy
{
  "name": "Офлайн Заметки",
  "short_name": "Заметки",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4a8af4",
  "background_color": "#ffffff"
}
Service Worker

javascript
Copy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
