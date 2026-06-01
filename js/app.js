// Core state
let textToType = '';
let practiceMode = 'word';
let segments = [];
let currentSegmentIndex = 0;
let typedText = '';
let startTime = null;
let timerInterval = null;
let totalKeystrokes = 0;
let correctKeystrokes = 0;
let totalErrors = 0;
let isCompleted = false;
let activeLayout = 'es';
let practiceActive = false;
let textFontSize = 1.6;
const ZOOM_MIN = 1.0;
const ZOOM_MAX = 3.2;
const ZOOM_STEP = 0.2;
let ttsEnabled = false;
let voices = [];

// Standard QWERTY ES Layout Configuration
const esLayout = [
  [
    { key: 'º', shift: 'ª', id: 'KeyPipe' },
    { key: '1', shift: '!', id: 'Digit1' },
    { key: '2', shift: '\"', id: 'Digit2' },
    { key: '3', shift: '·', id: 'Digit3' },
    { key: '4', shift: '$', id: 'Digit4' },
    { key: '5', shift: '%', id: 'Digit5' },
    { key: '6', shift: '&', id: 'Digit6' },
    { key: '7', shift: '/', id: 'Digit7' },
    { key: '8', shift: '(', id: 'Digit8' },
    { key: '9', shift: ')', id: 'Digit9' },
    { key: '0', shift: '=', id: 'Digit0' },
    { key: "'", shift: '?', id: 'Minus' },
    { key: '¡', shift: '¿', id: 'Equal' },
    { key: 'Backspace', id: 'Backspace', class: 'key-backspace' }
  ],
  [
    { key: 'Tab', id: 'Tab', class: 'key-tab' },
    { key: 'q', shift: 'Q', id: 'KeyQ' },
    { key: 'w', shift: 'W', id: 'KeyW' },
    { key: 'e', shift: 'E', id: 'KeyE' },
    { key: 'r', shift: 'R', id: 'KeyR' },
    { key: 't', shift: 'T', id: 'KeyT' },
    { key: 'y', shift: 'Y', id: 'KeyY' },
    { key: 'u', shift: 'U', id: 'KeyU' },
    { key: 'i', shift: 'I', id: 'KeyI' },
    { key: 'o', shift: 'O', id: 'KeyO' },
    { key: 'p', shift: 'P', id: 'KeyP' },
    { key: '`', shift: '^', alt: '[', id: 'BracketLeft' },
    { key: '+', shift: '*', alt: ']', id: 'BracketRight' },
    { key: 'Enter', id: 'Enter', class: 'key-enter' }
  ],
  [
    { key: 'Caps', id: 'CapsLock', class: 'key-caps' },
    { key: 'a', shift: 'A', id: 'KeyA' },
    { key: 's', shift: 'S', id: 'KeyS' },
    { key: 'd', shift: 'D', id: 'KeyD' },
    { key: 'f', shift: 'F', id: 'KeyF' },
    { key: 'g', shift: 'G', id: 'KeyG' },
    { key: 'h', shift: 'H', id: 'KeyH' },
    { key: 'j', shift: 'J', id: 'KeyJ' },
    { key: 'k', shift: 'K', id: 'KeyK' },
    { key: 'l', shift: 'L', id: 'KeyL' },
    { key: 'ñ', shift: 'Ñ', id: 'Semicolon' },
    { key: '´', shift: '¨', alt: '{', id: 'Quote' },
    { key: 'ç', shift: 'Ç', alt: '}', id: 'Backslash' }
  ],
  [
    { key: 'Shift', id: 'ShiftLeft', class: 'key-shift-l' },
    { key: '<', shift: '>', id: 'IntlBackslash' },
    { key: 'z', shift: 'Z', id: 'KeyZ' },
    { key: 'x', shift: 'X', id: 'KeyX' },
    { key: 'c', shift: 'C', id: 'KeyC' },
    { key: 'v', shift: 'V', id: 'KeyV' },
    { key: 'b', shift: 'B', id: 'KeyB' },
    { key: 'n', shift: 'N', id: 'KeyN' },
    { key: 'm', shift: 'M', id: 'KeyM' },
    { key: ',', shift: ';', id: 'Comma' },
    { key: '.', shift: ':', id: 'Period' },
    { key: '-', shift: '_', id: 'Slash' },
    { key: 'Shift', id: 'ShiftRight', class: 'key-shift-r' }
  ],
  [
    { key: 'Ctrl', id: 'ControlLeft', class: 'key-ctrl' },
    { key: 'Alt', id: 'AltLeft', class: 'key-alt' },
    { key: 'Space', id: 'Space', class: 'key-space' },
    { key: 'AltGr', id: 'AltRight', class: 'key-alt' },
    { key: 'Ctrl', id: 'ControlRight', class: 'key-ctrl' }
  ]
];

// Standard QWERTY US Layout Configuration
const enLayout = [
  [
    { key: '`', shift: '~', id: 'Backquote' },
    { key: '1', shift: '!', id: 'Digit1' },
    { key: '2', shift: '@', id: 'Digit2' },
    { key: '3', shift: '#', id: 'Digit3' },
    { key: '4', shift: '$', id: 'Digit4' },
    { key: '5', shift: '%', id: 'Digit5' },
    { key: '6', shift: '^', id: 'Digit6' },
    { key: '7', shift: '&', id: 'Digit7' },
    { key: '8', shift: '*', id: 'Digit8' },
    { key: '9', shift: '(', id: 'Digit9' },
    { key: '0', shift: ')', id: 'Digit0' },
    { key: '-', shift: '_', id: 'Minus' },
    { key: '=', shift: '+', id: 'Equal' },
    { key: 'Backspace', id: 'Backspace', class: 'key-backspace' }
  ],
  [
    { key: 'Tab', id: 'Tab', class: 'key-tab' },
    { key: 'q', shift: 'Q', id: 'KeyQ' },
    { key: 'w', shift: 'W', id: 'KeyW' },
    { key: 'e', shift: 'E', id: 'KeyE' },
    { key: 'r', shift: 'R', id: 'KeyR' },
    { key: 't', shift: 'T', id: 'KeyT' },
    { key: 'y', shift: 'Y', id: 'KeyY' },
    { key: 'u', shift: 'U', id: 'KeyU' },
    { key: 'i', shift: 'I', id: 'KeyI' },
    { key: 'o', shift: 'O', id: 'KeyO' },
    { key: 'p', shift: 'P', id: 'KeyP' },
    { key: '[', shift: '{', id: 'BracketLeft' },
    { key: ']', shift: '}', id: 'BracketRight' },
    { key: '\\', shift: '|', id: 'Backslash', class: 'key-enter' }
  ],
  [
    { key: 'Caps', id: 'CapsLock', class: 'key-caps' },
    { key: 'a', shift: 'A', id: 'KeyA' },
    { key: 's', shift: 'S', id: 'KeyS' },
    { key: 'd', shift: 'D', id: 'KeyD' },
    { key: 'f', shift: 'F', id: 'KeyF' },
    { key: 'g', shift: 'G', id: 'KeyG' },
    { key: 'h', shift: 'H', id: 'KeyH' },
    { key: 'j', shift: 'J', id: 'KeyJ' },
    { key: 'k', shift: 'K', id: 'KeyK' },
    { key: 'l', shift: 'L', id: 'KeyL' },
    { key: ';', shift: ':', id: 'Semicolon' },
    { key: "'", shift: '"', id: 'Quote' },
    { key: 'Enter', id: 'Enter', class: 'key-enter' }
  ],
  [
    { key: 'Shift', id: 'ShiftLeft', class: 'key-shift-l' },
    { key: 'z', shift: 'Z', id: 'KeyZ' },
    { key: 'x', shift: 'X', id: 'KeyX' },
    { key: 'c', shift: 'C', id: 'KeyC' },
    { key: 'v', shift: 'V', id: 'KeyV' },
    { key: 'b', shift: 'B', id: 'KeyB' },
    { key: 'n', shift: 'N', id: 'KeyN' },
    { key: 'm', shift: 'M', id: 'KeyM' },
    { key: ',', shift: '<', id: 'Comma' },
    { key: '.', shift: '>', id: 'Period' },
    { key: '/', shift: '?', id: 'Slash' },
    { key: 'Shift', id: 'ShiftRight', class: 'key-shift-r' }
  ],
  [
    { key: 'Ctrl', id: 'ControlLeft', class: 'key-ctrl' },
    { key: 'Alt', id: 'AltLeft', class: 'key-alt' },
    { key: 'Space', id: 'Space', class: 'key-space' },
    { key: 'Alt', id: 'AltRight', class: 'key-alt' },
    { key: 'Ctrl', id: 'ControlRight', class: 'key-ctrl' }
  ]
];

// Finger classification style top border tags
const fingerClasses = {
  ControlLeft: 'key-pinky', ShiftLeft: 'key-pinky', KeyZ: 'key-pinky', KeyA: 'key-pinky', KeyQ: 'key-pinky', Digit1: 'key-pinky', KeyPipe: 'key-pinky', Backquote: 'key-pinky',
  KeyX: 'key-ring', KeyS: 'key-ring', KeyW: 'key-ring', Digit2: 'key-ring',
  KeyC: 'key-middle', KeyD: 'key-middle', KeyE: 'key-middle', Digit3: 'key-middle',
  KeyV: 'key-index-l', KeyB: 'key-index-l', KeyF: 'key-index-l', KeyG: 'key-index-l', KeyR: 'key-index-l', KeyT: 'key-index-l', Digit4: 'key-index-l', Digit5: 'key-index-l',
  Space: 'key-thumb',
  KeyN: 'key-index-r', KeyM: 'key-index-r', KeyH: 'key-index-r', KeyJ: 'key-index-r', KeyY: 'key-index-r', KeyU: 'key-index-r', Digit6: 'key-index-r', Digit7: 'key-index-r',
  Comma: 'key-middle', KeyK: 'key-middle', KeyI: 'key-middle', Digit8: 'key-middle',
  Period: 'key-ring', KeyL: 'key-ring', KeyO: 'key-ring', Digit9: 'key-ring',
  Slash: 'key-pinky', Semicolon: 'key-pinky', KeyP: 'key-pinky', Digit0: 'key-pinky', Minus: 'key-pinky', Equal: 'key-pinky', Backspace: 'key-pinky', Tab: 'key-pinky', BracketLeft: 'key-pinky', BracketRight: 'key-pinky', Quote: 'key-pinky', Backslash: 'key-pinky', Enter: 'key-pinky', ShiftRight: 'key-pinky', ControlRight: 'key-pinky', AltRight: 'key-pinky', CapsLock: 'key-pinky'
};

// Maps for Español layout typing identification
const charToKeyIdES = {
  ' ': 'Space', '\n': 'Enter',
  'a': 'KeyA', 'b': 'KeyB', 'c': 'KeyC', 'd': 'KeyD', 'e': 'KeyE', 'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'i': 'KeyI', 'j': 'KeyJ', 'k': 'KeyK', 'l': 'KeyL', 'm': 'KeyM', 'n': 'KeyN', 'o': 'KeyO', 'p': 'KeyP', 'q': 'KeyQ', 'r': 'KeyR', 's': 'KeyS', 't': 'KeyT', 'u': 'KeyU', 'v': 'KeyV', 'w': 'KeyW', 'x': 'KeyX', 'y': 'KeyY', 'z': 'KeyZ',
  'A': 'KeyA', 'B': 'KeyB', 'C': 'KeyC', 'D': 'KeyD', 'E': 'KeyE', 'F': 'KeyF', 'G': 'KeyG', 'H': 'KeyH', 'I': 'KeyI', 'J': 'KeyJ', 'K': 'KeyK', 'L': 'KeyL', 'M': 'KeyM', 'N': 'KeyN', 'O': 'KeyO', 'P': 'KeyP', 'Q': 'KeyQ', 'R': 'KeyR', 'S': 'KeyS', 'T': 'KeyT', 'U': 'KeyU', 'V': 'KeyV', 'W': 'KeyW', 'X': 'KeyX', 'Y': 'KeyY', 'Z': 'KeyZ',
  'ñ': 'Semicolon', 'Ñ': 'Semicolon',
  'á': 'KeyA', 'é': 'KeyE', 'í': 'KeyI', 'ó': 'KeyO', 'ú': 'KeyU',
  'Á': 'KeyA', 'É': 'KeyE', 'Í': 'KeyI', 'Ó': 'KeyO', 'Ú': 'KeyU',
  'ü': 'KeyU', 'Ü': 'KeyU',
  '1': 'Digit1', '2': 'Digit2', '3': 'Digit3', '4': 'Digit4', '5': 'Digit5', '6': 'Digit6', '7': 'Digit7', '8': 'Digit8', '9': 'Digit9', '0': 'Digit0',
  '!': 'Digit1', '"': 'Digit2', '·': 'Digit3', '$': 'Digit4', '%': 'Digit5', '&': 'Digit6', '/': 'Digit7', '(': 'Digit8', ')': 'Digit9', '=': 'Digit0',
  '.': 'Period', ',': 'Comma', ';': 'Comma', ':': 'Period', '-': 'Slash', '_': 'Slash',
  "'": 'Minus', '?': 'Minus', '¡': 'Equal', '¿': 'Equal',
  'º': 'KeyPipe', 'ª': 'KeyPipe', '<': 'IntlBackslash', '>': 'IntlBackslash',
  'ç': 'Backslash', 'Ç': 'Backslash', '+': 'BracketRight', '*': 'BracketRight',
  '`': 'BracketLeft', '^': 'BracketLeft', '´': 'Quote', '¨': 'Quote'
};

// Maps for English US layout typing identification
const charToKeyIdEN = {
  ' ': 'Space', '\n': 'Enter',
  'a': 'KeyA', 'b': 'KeyB', 'c': 'KeyC', 'd': 'KeyD', 'e': 'KeyE', 'f': 'KeyF', 'g': 'KeyG', 'h': 'KeyH', 'i': 'KeyI', 'j': 'KeyJ', 'k': 'KeyK', 'l': 'KeyL', 'm': 'KeyM', 'n': 'KeyN', 'o': 'KeyO', 'p': 'KeyP', 'q': 'KeyQ', 'r': 'KeyR', 's': 'KeyS', 't': 'KeyT', 'u': 'KeyU', 'v': 'KeyV', 'w': 'KeyW', 'x': 'KeyX', 'y': 'KeyY', 'z': 'KeyZ',
  'A': 'KeyA', 'B': 'KeyB', 'C': 'KeyC', 'D': 'KeyD', 'E': 'KeyE', 'F': 'KeyF', 'G': 'KeyG', 'H': 'KeyH', 'I': 'KeyI', 'J': 'KeyJ', 'K': 'KeyK', 'L': 'KeyL', 'M': 'KeyM', 'N': 'KeyN', 'O': 'KeyO', 'P': 'KeyP', 'Q': 'KeyQ', 'R': 'KeyR', 'S': 'KeyS', 'T': 'KeyT', 'U': 'KeyU', 'V': 'KeyV', 'W': 'KeyW', 'X': 'KeyX', 'Y': 'KeyY', 'Z': 'KeyZ',
  '1': 'Digit1', '2': 'Digit2', '3': 'Digit3', '4': 'Digit4', '5': 'Digit5', '6': 'Digit6', '7': 'Digit7', '8': 'Digit8', '9': 'Digit9', '0': 'Digit0',
  '!': 'Digit1', '@': 'Digit2', '#': 'Digit3', '$': 'Digit4', '%': 'Digit5', '^': 'Digit6', '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0',
  '-': 'Minus', '_': 'Minus', '=': 'Equal', '+': 'Equal',
  '[': 'BracketLeft', '{': 'BracketLeft', ']': 'BracketRight', '}': 'BracketRight',
  '\\': 'Backslash', '|': 'Backslash',
  ';': 'Semicolon', ':': 'Semicolon', "'": 'Quote', '"': 'Quote',
  ',': 'Comma', '<': 'Comma', '.': 'Period', '>': 'Period', '/': 'Slash', '?': 'Slash',
  '`': 'Backquote', '~': 'Backquote'
};

// INITIALIZATION & DOM PARSING
document.addEventListener('DOMContentLoaded', () => {
  initTTS();
  detectSystemLayout();
  populateStorySelect();
  loadStatsHistory();

  // Virtual keyboard render
  renderVirtualKeyboard(activeLayout);

  // Setup Event Listeners
  document.getElementById('story_lang').addEventListener('change', (e) => {
    populateStorySelect();
    updateTTSVoiceOptions(e.target.value);
  });

  document.getElementById('story_select').addEventListener('change', () => {
    updateStoryPreview();
  });

  document.getElementById('keyboard_layout').addEventListener('change', (e) => {
    activeLayout = e.target.value;
    renderVirtualKeyboard(activeLayout);
  });

  document.getElementById('practice_mode').addEventListener('change', (e) => {
    practiceMode = e.target.value;
    if (practiceActive) {
      restartExercise();
    }
  });

  document.getElementById('user_name').addEventListener('input', () => {
    loadStatsHistory();
  });

  document.getElementById('tts_enabled').addEventListener('change', (e) => {
    ttsEnabled = e.target.checked;
    const container = document.getElementById('voice_select_container');
    if (ttsEnabled) {
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  });

  document.getElementById('btn_start_practice').addEventListener('click', startPractice);
  document.getElementById('btn_random_story').addEventListener('click', loadRandomStory);
  document.getElementById('btn_close_practice').addEventListener('click', stopPractice);
  document.getElementById('btn_reset_exercise').addEventListener('click', restartExercise);
  document.getElementById('btn_close_celebration').addEventListener('click', closeCelebration);
  document.getElementById('btn_clear_history').addEventListener('click', clearUserHistory);

  // Focus managers
  document.getElementById('focus_overlay').addEventListener('click', focusTriggerInput);
  document.getElementById('typing_text_area').addEventListener('click', focusTriggerInput);
  document.getElementById('sidebar_toggle').addEventListener('click', () => {
    document.getElementById('app_sidebar').classList.remove('sidebar-hidden');
    document.getElementById('sidebar_toggle').classList.remove('visible');
    if (practiceActive) {
      setTimeout(focusTriggerInput, 380);
    }
  });

  // Zoom controls
  document.getElementById('btn_zoom_in').addEventListener('mousedown', (e) => e.preventDefault());
  document.getElementById('btn_zoom_in').addEventListener('click', () => {
    if (textFontSize < ZOOM_MAX) {
      textFontSize = Math.round((textFontSize + ZOOM_STEP) * 10) / 10;
      applyTextZoom();
    }
    if (practiceActive) focusTriggerInput();
  });

  document.getElementById('btn_zoom_out').addEventListener('mousedown', (e) => e.preventDefault());
  document.getElementById('btn_zoom_out').addEventListener('click', () => {
    if (textFontSize > ZOOM_MIN) {
      textFontSize = Math.round((textFontSize - ZOOM_STEP) * 10) / 10;
      applyTextZoom();
    }
    if (practiceActive) focusTriggerInput();
  });

  // Keyboard capture listeners on hidden input
  const trigger = document.getElementById('keyboard_input_trigger');
  trigger.addEventListener('keydown', handleKeyDown);
  trigger.addEventListener('keyup', handleKeyUp);
  trigger.addEventListener('blur', () => {
    if (practiceActive && !isCompleted) {
      document.getElementById('focus_overlay').style.display = 'flex';
    }
  });

  // Global keydown redirection
  document.addEventListener('keydown', (e) => {
    if (!practiceActive) return;
    if (e.target.tagName === 'INPUT' && e.target.id !== 'keyboard_input_trigger') return;
    if (e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    
    // Ignore meta/modifier keys from trigger redirection
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'AltGraph'].includes(e.key)) return;
    
    if (document.activeElement !== trigger) {
      focusTriggerInput();
      // Forward the event manually
      trigger.focus();
    }
  });
});

// POPULATING STORIES SELECTOR
function populateStorySelect() {
  const select = document.getElementById('story_select');
  const lang = document.getElementById('story_lang').value;
  const currentVal = select.value;
  
  select.innerHTML = '';
  
  STORIES.forEach((story) => {
    const opt = document.createElement('option');
    opt.value = story.id;
    opt.textContent = lang === 'es' ? story.title_es : story.title_en;
    select.appendChild(opt);
  });

  // Retain selection if valid, else pick first
  const match = STORIES.find(s => s.id == currentVal);
  if (match) {
    select.value = currentVal;
  } else {
    select.value = STORIES[0].id;
  }

  updateStoryPreview();
}

function updateStoryPreview() {
  const storyId = document.getElementById('story_select').value;
  const lang = document.getElementById('story_lang').value;
  const story = STORIES.find(s => s.id == storyId) || STORIES[0];
  
  const title = lang === 'es' ? story.title_es : story.title_en;
  const text = lang === 'es' ? story.text_es : story.text_en;
  const truncatedText = text.length > 110 ? text.substring(0, 107) + '...' : text;

  document.getElementById('preview_title').textContent = title;
  document.getElementById('preview_text').textContent = truncatedText;
}

function loadRandomStory() {
  const select = document.getElementById('story_select');
  const randomIndex = Math.floor(Math.random() * STORIES.length);
  select.value = STORIES[randomIndex].id;
  updateStoryPreview();
}

// SYSTEM LAYOUT AUTO-DETECTION
function detectSystemLayout() {
  const sysLang = navigator.language || navigator.userLanguage || 'es';
  let layout = 'es';
  if (sysLang && !sysLang.toLowerCase().startsWith('es')) {
    layout = 'en';
  }
  
  document.getElementById('keyboard_layout').value = layout;
  activeLayout = layout;
  
  const langName = layout === 'es' ? 'Español (QWERTY ES)' : 'English (QWERTY US)';
  document.getElementById('lang_detect_badge').innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <span>Teclado detectado: ${langName}</span>
  `;
}

// SPEECH SYNTHESIS ENGINE (TTS)
function initTTS() {
  if ('speechSynthesis' in window) {
    // Chrome triggers voiceschanged asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      updateTTSVoiceOptions(document.getElementById('story_lang').value);
    };
    voices = window.speechSynthesis.getVoices();
    updateTTSVoiceOptions(document.getElementById('story_lang').value);
  } else {
    // Disable TTS if unsupported
    document.getElementById('tts_enabled').disabled = true;
    document.querySelector('.sidebar-checkbox-label').style.opacity = '0.5';
    document.querySelector('.sidebar-checkbox-label').title = 'Speech Synthesis no soportado en este navegador';
  }
}

function updateTTSVoiceOptions(lang) {
  const voiceSelect = document.getElementById('tts_voice');
  voiceSelect.innerHTML = '';
  
  // Filter voices based on text language
  const isEs = lang === 'es';
  const prefix = isEs ? 'es' : 'en';
  
  const filtered = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
  
  if (filtered.length === 0) {
    const opt = document.createElement('option');
    opt.value = 'default';
    opt.textContent = isEs ? 'Voz por defecto (Español)' : 'Default voice (English)';
    voiceSelect.appendChild(opt);
    return;
  }

  filtered.forEach((voice) => {
    const opt = document.createElement('option');
    opt.value = voice.voiceURI;
    opt.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(opt);
  });

  // Auto-select standard regional favorites
  let favorite = null;
  if (isEs) {
    favorite = filtered.find(v => v.lang.includes('ES') || v.name.includes('Google') || v.name.includes('Microsoft'));
  } else {
    favorite = filtered.find(v => v.lang.includes('US') || v.name.includes('Google') || v.name.includes('Microsoft'));
  }
  if (favorite) {
    voiceSelect.value = favorite.voiceURI;
  }
}

function speakSegment(text) {
  if (!ttsEnabled || !text || !text.trim() || !('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel(); // Stop current speech
  
  const utterance = new SpeechSynthesisUtterance(text.trim());
  const selectedVoiceURI = document.getElementById('tts_voice').value;
  const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = document.getElementById('story_lang').value === 'es' ? 'es-ES' : 'en-US';
  }
  
  utterance.rate = 0.95; // Slightly slower for clear pronunciation learning
  window.speechSynthesis.speak(utterance);
}

// RENDERING VIRTUAL KEYBOARD
function renderVirtualKeyboard(layoutName) {
  const layoutData = layoutName === 'es' ? esLayout : enLayout;
  const container = document.getElementById('keyboard_display_wrapper');
  container.innerHTML = '';

  layoutData.forEach((row) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    
    row.forEach((k) => {
      const customClass = k.class || '';
      const fingerClass = fingerClasses[k.id] || '';
      
      const keyDiv = document.createElement('div');
      keyDiv.className = `key ${customClass} ${fingerClass}`;
      keyDiv.id = `vkey_${k.id}`;
      keyDiv.setAttribute('data-key-id', k.id);
      
      const mainLabel = document.createElement('span');
      mainLabel.textContent = k.key;
      keyDiv.appendChild(mainLabel);

      if (k.shift) {
        const shiftLabel = document.createElement('span');
        shiftLabel.textContent = k.shift;
        shiftLabel.style.cssText = 'font-size: 0.7rem; opacity: 0.55; margin-top: 2px;';
        keyDiv.appendChild(shiftLabel);
      }
      
      rowDiv.appendChild(keyDiv);
    });
    
    container.appendChild(rowDiv);
  });
  
  highlightNextKey();
}

function highlightNextKey() {
  // Clear previous highlighted keys
  document.querySelectorAll('.key').forEach(el => el.classList.remove('key-next'));
  
  if (isCompleted || !textToType) return;
  
  const nextChar = textToType.charAt(typedText.length);
  const map = activeLayout === 'es' ? charToKeyIdES : charToKeyIdEN;
  const keyId = map[nextChar];

  if (keyId) {
    const nextKeyEl = document.getElementById(`vkey_${keyId}`);
    if (nextKeyEl) nextKeyEl.classList.add('key-next');
    
    // Check if Shift is required
    let isShiftRequired = false;
    
    if (activeLayout === 'es') {
      const uppercaseEs = 'AÁBCÇDEÉFGHIÍJKLMNOÓPQRSTUÚÜVWXYZÑª!"·$%&/()=?¿^*¨>;:';
      if (uppercaseEs.includes(nextChar)) isShiftRequired = true;
      
      // Accented vowels dead-key highlight support
      const accentedEs = 'áéíóúÁÉÍÓÚ';
      const dieresisEs = 'üÜ';
      
      if (accentedEs.includes(nextChar)) {
        const accentKeyEl = document.getElementById('vkey_Quote'); // Quote holds '´' and '¨'
        if (accentKeyEl) accentKeyEl.classList.add('key-next');
      } else if (dieresisEs.includes(nextChar)) {
        const accentKeyEl = document.getElementById('vkey_Quote');
        if (accentKeyEl) accentKeyEl.classList.add('key-next');
        isShiftRequired = true; // Dieresis requires Shift + Quote key
      }
    } else {
      const uppercaseEn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+{}|:"<>?';
      if (uppercaseEn.includes(nextChar)) isShiftRequired = true;
    }

    if (isShiftRequired) {
      const leftShift = document.getElementById('vkey_ShiftLeft');
      const rightShift = document.getElementById('vkey_ShiftRight');
      if (leftShift) leftShift.classList.add('key-next');
      if (rightShift) rightShift.classList.add('key-next');
    }
  }
}

// ZOOM MANAGER
function applyTextZoom() {
  const area = document.getElementById('typing_text_area');
  area.style.fontSize = `${textFontSize}rem`;
  area.style.lineHeight = `${(textFontSize * 1.45).toFixed(2)}rem`;
  
  const pct = Math.round((textFontSize / 1.6) * 100);
  document.getElementById('zoom_pct_label').textContent = `${pct} %`;
  document.getElementById('btn_zoom_out').disabled = textFontSize <= ZOOM_MIN;
  document.getElementById('btn_zoom_in').disabled = textFontSize >= ZOOM_MAX;
}

// PRACTICE START & FLOW MANAGERS
function startPractice() {
  const storyId = document.getElementById('story_select').value;
  const lang = document.getElementById('story_lang').value;
  const story = STORIES.find(s => s.id == storyId) || STORIES[0];
  
  textToType = lang === 'es' ? story.text_es : story.text_en;
  // Standardize backticks and spaces
  textToType = textToType.replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'");
  
  const title = lang === 'es' ? story.title_es : story.title_en;
  
  document.getElementById('modal_story_title').textContent = title;
  
  // Segmentation rules
  buildSegments(textToType, practiceMode);
  
  // Layout switch and render
  practiceActive = true;
  document.getElementById('welcome_placeholder').style.display = 'none';
  document.getElementById('app_sidebar').classList.add('sidebar-hidden');
  document.getElementById('sidebar_toggle').classList.add('visible');
  
  document.getElementById('practice_modal').style.display = 'block';
  
  resetExerciseState();
  applyTextZoom();
  
  setTimeout(focusTriggerInput, 400);
}

function stopPractice() {
  practiceActive = false;
  clearInterval(timerInterval);
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  document.getElementById('focus_overlay').style.display = 'none';
  document.getElementById('sidebar_toggle').classList.remove('visible');
  document.getElementById('app_sidebar').classList.remove('sidebar-hidden');
  document.getElementById('practice_modal').style.display = 'none';
  document.getElementById('welcome_placeholder').style.display = 'block';
}

function restartExercise() {
  resetExerciseState();
  focusTriggerInput();
}

function resetExerciseState() {
  typedText = '';
  startTime = null;
  clearInterval(timerInterval);
  totalKeystrokes = 0;
  correctKeystrokes = 0;
  totalErrors = 0;
  isCompleted = false;
  currentSegmentIndex = 0;

  document.getElementById('wpm_val').textContent = '0 PPM';
  document.getElementById('acc_val').textContent = '100 %';
  document.getElementById('time_val').textContent = '0.0 s';
  document.getElementById('progress_val').textContent = '0 %';
  document.getElementById('errors_val').textContent = '0';
  document.getElementById('focus_overlay').style.display = 'none';

  updateTypingDisplay();
  highlightNextKey();
}

function focusTriggerInput() {
  if (!practiceActive) return;
  const trigger = document.getElementById('keyboard_input_trigger');
  trigger.value = '';
  trigger.focus();
  document.getElementById('focus_overlay').style.display = 'none';
}

// TEXT SEGMENTATION LOGIC
function buildSegments(fullText, mode) {
  segments = [];
  if (mode === 'word') {
    // Split by spaces but preserve them as characters to type
    let words = fullText.split(/(\s+)/);
    segments = words.filter(w => w.length > 0);
  } else if (mode === 'line') {
    // Construct lines up to ~70 characters
    let words = fullText.split(/(\s+)/).filter(w => w.length > 0);
    let currentLine = '';
    words.forEach(w => {
      if ((currentLine + w).length > 70 && currentLine.length > 0) {
        segments.push(currentLine);
        currentLine = w;
      } else {
        currentLine += w;
      }
    });
    if (currentLine.length > 0) segments.push(currentLine);
  } else {
    // Paragraph mode
    segments = [fullText];
  }
  currentSegmentIndex = 0;
}

function getSegmentStartIndex(segIndex) {
  let idx = 0;
  for (let i = 0; i < segIndex; i++) {
    idx += segments[i].length;
  }
  return idx;
}

function getCurrentSegmentStart() {
  return getSegmentStartIndex(currentSegmentIndex);
}

function getCurrentSegmentEnd() {
  let end = 0;
  for (let i = 0; i <= currentSegmentIndex; i++) {
    end += segments[i].length;
  }
  return end;
}

// RENDERING DYNAMIC CHAR HIGHLIGHTS
function updateTypingDisplay() {
  const container = document.getElementById('typing_text_area');
  container.innerHTML = '';
  
  if (!textToType) return;

  const segStart = getCurrentSegmentStart();
  const segEnd = getCurrentSegmentEnd();
  
  // Calculate active word boundaries to apply background highlighted card
  let wordStart = 0;
  let wordEnd = 0;
  const cursorPos = typedText.length;
  
  if (cursorPos < textToType.length) {
    const textBefore = textToType.substring(0, cursorPos);
    const lastSpace = textBefore.lastIndexOf(' ');
    wordStart = lastSpace === -1 ? 0 : lastSpace + 1;
    
    const textAfter = textToType.substring(cursorPos);
    const nextSpace = textAfter.indexOf(' ');
    wordEnd = nextSpace === -1 ? textToType.length : cursorPos + nextSpace;
  }

  for (let i = 0; i < textToType.length; i++) {
    const char = textToType[i];
    let spanClass = 'char-untyped';
    let wordClass = '';

    // Correct vs Incorrect vs Current Character
    if (i < typedText.length) {
      if (typedText[i] === textToType[i]) {
        spanClass = 'char-correct';
      } else {
        spanClass = 'char-incorrect';
      }
    } else if (i === typedText.length) {
      spanClass = 'char-current';
    }

    // Segment ranges classes
    if (i < segStart) {
      wordClass = 'segment-past';
    } else if (i >= segEnd) {
      wordClass = 'segment-future';
    } else {
      wordClass = 'segment-current';
      if (i >= wordStart && i < wordEnd) {
        wordClass += ' word-active';
      }
    }

    const span = document.createElement('span');
    span.className = `${spanClass} ${wordClass}`;
    
    // Format space indicator for user feedback visual
    if (char === ' ') {
      span.textContent = ' ';
    } else if (char === '\n') {
      span.textContent = '↵\n';
    } else {
      span.textContent = char;
    }

    container.appendChild(span);
  }

  // Update progress dashboard percentage
  const progress = Math.round((typedText.length / textToType.length) * 100);
  document.getElementById('progress_val').textContent = `${progress} %`;

  // Dynamic Scroll container centering around current character cursor
  const activeChar = container.querySelector('.char-current');
  if (activeChar) {
    const containerHeight = container.clientHeight;
    container.scrollTop = activeChar.offsetTop - containerHeight / 2 + 20;
  }
}

// SPEED TIMER CALCULATION
function startTimer() {
  if (startTime !== null) return;
  startTime = new Date();
  
  timerInterval = setInterval(() => {
    if (isCompleted) return;
    
    const elapsed = (new Date() - startTime) / 1000.0;
    document.getElementById('time_val').textContent = `${elapsed.toFixed(1)} s`;
    
    if (elapsed > 0.5) {
      let correctCount = 0;
      for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === textToType[i]) correctCount++;
      }
      // Standard WPM = (correct chars / 5) / (minutes)
      const wpm = Math.round((correctCount / 5.0) / (elapsed / 60.0));
      document.getElementById('wpm_val').textContent = `${wpm} PPM`;
    }
  }, 100);
}

// TYPING ENGINE KEY EVENT HANDLING
function handleKeyDown(e) {
  if (isCompleted || !textToType || !practiceActive) return;

  // Prevent default Tab browser navigation focus swap
  if (e.key === 'Tab') {
    e.preventDefault();
    return;
  }

  // Handle active modifiers visual classes
  if (['Shift', 'Control', 'Alt', 'CapsLock', 'AltGraph'].includes(e.key)) {
    const vkey = document.getElementById(`vkey_${e.code}`);
    if (vkey) vkey.classList.add('key-active');
    return;
  }

  // Normalize dead keys for spanish keyboards
  const normKey = e.key.normalize('NFC');
  
  // Make sure we only process character entries or backspace
  if (normKey !== 'Backspace' && normKey.length !== 1) return;

  const keyEl = document.getElementById(`vkey_${e.code}`);
  if (keyEl) keyEl.classList.add('key-active');
  
  startTimer();

  // Prevent default spacebar page scrolling
  if (normKey === ' ') {
    e.preventDefault();
  }

  if (normKey === 'Backspace') {
    totalKeystrokes++;
    if (typedText.length > 0) {
      typedText = typedText.substring(0, typedText.length - 1);
      // Rewind segments index back if backspacing past segment start boundary
      while (currentSegmentIndex > 0 && typedText.length < getSegmentStartIndex(currentSegmentIndex)) {
        currentSegmentIndex--;
      }
    }
  } else {
    totalKeystrokes++;
    const targetChar = textToType.charAt(typedText.length);
    typedText += normKey;
    
    if (normKey === targetChar) {
      correctKeystrokes++;
    } else {
      totalErrors++;
    }
  }

  // Manage segment TTS triggers
  const segEnd = getCurrentSegmentEnd();
  if (typedText.length >= segEnd && currentSegmentIndex < segments.length - 1) {
    if (ttsEnabled) {
      const completedSegment = segments[currentSegmentIndex];
      speakSegment(completedSegment);
    }
    currentSegmentIndex++;
  }

  // Update live statistics values
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
  document.getElementById('acc_val').textContent = `${accuracy} %`;
  document.getElementById('errors_val').textContent = totalErrors;

  updateTypingDisplay();
  highlightNextKey();

  // Finish exercise if text typed fully
  if (typedText.length >= textToType.length) {
    exerciseCompleted();
  }
}

function handleKeyUp(e) {
  const vkey = document.getElementById(`vkey_${e.code}`);
  if (vkey) vkey.classList.remove('key-active');
}

// PRACTICE COMPLETED CELEBRATION
function exerciseCompleted() {
  isCompleted = true;
  clearInterval(timerInterval);
  
  // Speak final text segment
  if (ttsEnabled && segments[currentSegmentIndex]) {
    speakSegment(segments[currentSegmentIndex]);
  }

  const finalTime = (new Date() - startTime) / 1000.0;
  let correctCount = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === textToType[i]) correctCount++;
  }
  const finalWpm = Math.round((correctCount / 5.0) / (finalTime / 60.0));
  const finalAcc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  // Save statistics record locally
  saveStatsRecord(finalWpm, finalAcc, finalTime, totalErrors);
  
  // Show celebration details in custom modal overlay
  document.getElementById('modal_wpm').textContent = `${finalWpm} PPM`;
  document.getElementById('modal_acc').textContent = `${finalAcc} %`;
  document.getElementById('modal_time').textContent = `${finalTime.toFixed(1)} s`;
  document.getElementById('modal_errors').textContent = totalErrors;

  // Analyze accented vowel errors
  const accentedVowels = 'áéíóúüÁÉÍÓÚÜ';
  const accentedGuides = {
    'á': 'Presionar la tecla de acento <strong>´</strong> (Quote / tecla a la derecha de la Ñ) y luego la tecla <strong>a</strong>.',
    'é': 'Presionar la tecla de acento <strong>´</strong> (Quote / tecla a la derecha de la Ñ) y luego la tecla <strong>e</strong>.',
    'í': 'Presionar la tecla de acento <strong>´</strong> (Quote / tecla a la derecha de la Ñ) y luego la tecla <strong>i</strong>.',
    'ó': 'Presionar la tecla de acento <strong>´</strong> (Quote / tecla a la derecha de la Ñ) y luego la tecla <strong>o</strong>.',
    'ú': 'Presionar la tecla de acento <strong>´</strong> (Quote / tecla a la derecha de la Ñ) y luego la tecla <strong>u</strong>.',
    'ü': 'Presionar <strong>Shift</strong> + la tecla de acento <strong>¨</strong> (Quote) y luego la tecla <strong>u</strong>.',
    'Á': 'Presionar la tecla de acento <strong>´</strong> (Quote), luego <strong>Shift</strong> + la tecla <strong>a</strong>.',
    'É': 'Presionar la tecla de acento <strong>´</strong> (Quote), luego <strong>Shift</strong> + la tecla <strong>e</strong>.',
    'Í': 'Presionar la tecla de acento <strong>´</strong> (Quote), luego <strong>Shift</strong> + la tecla <strong>i</strong>.',
    'Ó': 'Presionar la tecla de acento <strong>´</strong> (Quote), luego <strong>Shift</strong> + la tecla <strong>o</strong>.',
    'Ú': 'Presionar la tecla de acento <strong>´</strong> (Quote), luego <strong>Shift</strong> + la tecla <strong>u</strong>.',
    'Ü': 'Presionar <strong>Shift</strong> + la tecla de acento <strong>¨</strong> (Quote), luego <strong>Shift</strong> + la tecla <strong>u</strong>.'
  };

  const accentedErrors = {};
  let totalAccentedErrors = 0;
  
  for (let i = 0; i < textToType.length; i++) {
    const targetChar = textToType[i];
    if (accentedVowels.includes(targetChar)) {
      if (i < typedText.length && typedText[i] !== targetChar) {
        if (!accentedErrors[targetChar]) {
          accentedErrors[targetChar] = 0;
        }
        accentedErrors[targetChar]++;
        totalAccentedErrors++;
      }
    }
  }

  const feedbackContainer = document.getElementById('accent_vowels_feedback');
  const feedbackList = document.getElementById('accent_feedback_list');
  
  if (totalAccentedErrors > 0 && activeLayout === 'es') {
    feedbackList.innerHTML = '';
    for (const [char, count] of Object.entries(accentedErrors)) {
      const li = document.createElement('li');
      li.style.marginBottom = '6px';
      const guideText = accentedGuides[char] || `Presionar la combinación adecuada para <strong>${char}</strong>.`;
      li.innerHTML = `No marcaste correctamente la vocal con tilde <strong>"${char}"</strong> (${count} ${count === 1 ? 'vez' : 'veces'}). Guía: ${guideText}`;
      feedbackList.appendChild(li);
    }
    feedbackContainer.style.display = 'block';
  } else {
    feedbackContainer.style.display = 'none';
  }

  const modal = document.getElementById('celebration_modal');
  modal.classList.add('open');
}

function closeCelebration() {
  document.getElementById('celebration_modal').classList.remove('open');
  stopPractice();
}

// STORAGE & LOCAL LOGS MANAGERS
function saveStatsRecord(wpm, accuracy, time, errors) {
  const nameInput = document.getElementById('user_name').value.trim();
  const userName = nameInput === '' ? 'Anónimo' : nameInput;
  const storyId = document.getElementById('story_select').value;
  const story = STORIES.find(s => s.id == storyId) || STORIES[0];
  const storyTitle = document.getElementById('story_lang').value === 'es' ? story.title_es : story.title_en;

  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const record = {
    user_name: userName,
    story_title: storyTitle,
    mode: practiceMode,
    wpm: wpm,
    accuracy: accuracy,
    time: parseFloat(time.toFixed(1)),
    total_errors: errors,
    date: formattedDate
  };

  let statsList = [];
  try {
    const raw = localStorage.getItem('meca_user_stats');
    if (raw) statsList = JSON.parse(raw);
  } catch (e) {
    statsList = [];
  }

  statsList.push(record);
  localStorage.setItem('meca_user_stats', JSON.stringify(statsList));

  loadStatsHistory();
}

function loadStatsHistory() {
  const nameInput = document.getElementById('user_name').value.trim();
  const userName = nameInput === '' ? 'Anónimo' : nameInput;
  const container = document.getElementById('stats_history_container');
  
  let statsList = [];
  try {
    const raw = localStorage.getItem('meca_user_stats');
    if (raw) statsList = JSON.parse(raw);
  } catch (e) {
    statsList = [];
  }

  // Filter sessions by current active name input
  const filtered = statsList.filter(s => s.user_name === userName);

  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-sessions-text">Aún no hay sesiones registradas para "${userName}". ¡Empieza a practicar!</p>`;
    return;
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Get top 10 sessions
  const displayList = filtered.slice(0, 10);

  let htmlTable = `
    <div class="stats-history-table-wrapper">
      <table class="stats-history-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Fábula</th>
            <th>Modo</th>
            <th>Velocidad</th>
            <th>Precisión</th>
            <th>Tiempo</th>
            <th>Errores</th>
          </tr>
        </thead>
        <tbody>
  `;

  displayList.forEach((s) => {
    const modeName = s.mode === 'word' ? 'Palabra' : s.mode === 'line' ? 'Línea' : 'Párrafo';
    htmlTable += `
      <tr>
        <td>${s.date}</td>
        <td>${s.story_title}</td>
        <td>${modeName}</td>
        <td>${s.wpm} PPM</td>
        <td>${s.accuracy} %</td>
        <td>${s.time} s</td>
        <td>${s.total_errors}</td>
      </tr>
    `;
  });

  htmlTable += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = htmlTable;
}

function clearUserHistory() {
  const nameInput = document.getElementById('user_name').value.trim();
  const userName = nameInput === '' ? 'Anónimo' : nameInput;
  
  const confirmClear = confirm(`¿Estás seguro de que deseas borrar todo el historial de práctica para "${userName}"? Esta acción no se puede deshacer.`);
  if (!confirmClear) return;
  
  let statsList = [];
  try {
    const raw = localStorage.getItem('meca_user_stats');
    if (raw) statsList = JSON.parse(raw);
  } catch (e) {
    statsList = [];
  }
  
  // Filter out the active user's stats
  const remainingStats = statsList.filter(s => s.user_name !== userName);
  
  localStorage.setItem('meca_user_stats', JSON.stringify(remainingStats));
  loadStatsHistory();
}
