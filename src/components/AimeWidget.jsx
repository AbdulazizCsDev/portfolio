import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './AimeWidget.css';

const API = 'https://aime-voice-assistant-rw2z.vercel.app';

// Detect which portfolio section the text is about
function detectIntent(text) {
  if (!text) return null;
  if (/cert|شهادة|شهادات|ibm|tensorflow|aws/i.test(text))
    return { section: 'about', highlight: 'certs' };
  if (/now building|working on|currently|قيد البناء|يعمل حالياً|حالياً على/i.test(text))
    return { section: 'now' };
  if (/board.?room|hackathon|himmah|agrocure|هاكاثون|همة|همّة|مجلس الإدارة|أجروكيور/i.test(text))
    return { section: 'projects', highlight: 'projects' };
  if (/project|مشروع|مشاريع|aime voice|spy|game|tweet|forecast|car.?wash/i.test(text))
    return { section: 'projects', highlight: 'projects' };
  if (/experience|bootcamp|quality assurance|خبرة|خبرات|معسكر|ضمان الجودة/i.test(text))
    return { section: 'experience' };
  if (/skill|مهارة|مهارات|python|react|flutter|fastapi|backend|frontend|pytorch|rag|llm/i.test(text))
    return { section: 'skills', highlight: 'skills' };
  if (/contact|email|linkedin|github|تواصل|ايميل|بريد/i.test(text))
    return { section: 'contact' };
  if (/about|education|university|gpa|عني|تعليم|جامع|درجة|معدل/i.test(text))
    return { section: 'about' };
  return null;
}

function highlightCerts() {
  document.querySelectorAll('[data-cert-index]').forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('cert-spotlight');
      setTimeout(() => card.classList.remove('cert-spotlight'), 2200);
    }, i * 900);
  });
}

function highlightSkills() {
  document.querySelectorAll('.skill-category').forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('skill-spotlight');
      setTimeout(() => card.classList.remove('skill-spotlight'), 2000);
    }, i * 200);
  });
}

function clearSpotlight() {
  document.querySelectorAll('.card-targeted').forEach((el) => el.classList.remove('card-targeted'));
  document.querySelectorAll('.spotlight-dim').forEach((el) => el.classList.remove('spotlight-dim'));
}

function spotlightCard(section, targetId) {
  const card = document.querySelector(`#${section} [data-target-id="${targetId}"]`);
  if (!card) return;
  clearSpotlight();
  const grid = card.closest('.projects-grid, .projects-more-grid, .now-grid');
  grid?.classList.add('spotlight-dim');
  card.classList.add('card-targeted');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => {
    card.classList.remove('card-targeted');
    grid?.classList.remove('spotlight-dim');
  }, 7000);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AimeWidget() {
  const { t, lang } = useLanguage();

  const [isOpen, setIsOpen]             = useState(false);
  const [isExpanded, setIsExpanded]     = useState(false);
  const [isMuted, setIsMuted]           = useState(false);
  const [messages, setMessages]         = useState([]);
  const [inputText, setInputText]       = useState('');
  const [isRecording, setIsRecording]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [micError, setMicError]         = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const streamRef        = useRef(null);
  const messagesEndRef   = useRef(null);
  const currentAudioRef  = useRef(null);
  const hasGreetedRef    = useRef(false);
  const inputRef         = useRef(null);
  const isMutedRef       = useRef(false);
  const pendingGreetRef  = useRef(false);
  const speakTextRef     = useRef(null);
  const bubbleTextRef    = useRef('');
  const audioCtxRef      = useRef(null);
  const silenceTimerRef  = useRef(null);
  const isRecordingRef   = useRef(false);
  const tourRef          = useRef(false);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  const isLangMountRef = useRef(true);

  // Open from Hero CTA button
  useEffect(() => {
    const handler = () => setIsOpen(true);
    document.addEventListener('openAime', handler);
    return () => document.removeEventListener('openAime', handler);
  }, []);

  // Reset greeting when language changes (skip on first mount)
  useEffect(() => {
    if (isLangMountRef.current) { isLangMountRef.current = false; return; }
    hasGreetedRef.current = false;
    pendingGreetRef.current = false;
    setMessages([{ role: 'aime', content: t.aime.greeting }]);
    setShowSuggestions(true);
    setTimeout(() => speakTextRef.current?.(t.aime.greeting), 300);
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resolves when playback finishes (or fails), so callers can sequence speech.
  const speakText = useCallback(async (text) => {
    if (isMutedRef.current) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    try {
      setIsSpeaking(true);
      const res = await fetch(`${API}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      await new Promise((resolve) => {
        audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); currentAudioRef.current = null; resolve(); };
        audio.onerror = () => { setIsSpeaking(false); currentAudioRef.current = null; resolve(); };
        audio.play().catch(() => { setIsSpeaking(false); resolve(); });
      });
    } catch {
      setIsSpeaking(false);
    }
  }, []);
  // Keep refs in sync so early-bound effects can call the latest version
  useEffect(() => { speakTextRef.current = speakText; });
  useEffect(() => { bubbleTextRef.current = t.aime.bubbleGreet; }, [t.aime.bubbleGreet]);

  // Show greeting in chat on first open (text only, no sound - lang effect handles sound)
  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setMessages([{ role: 'aime', content: t.aime.greeting }]);
    setShowSuggestions(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const navigateToSection = useCallback((intent) => {
    if (!intent) return;
    setTimeout(() => {
      document.getElementById(intent.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (intent.highlight === 'certs')    setTimeout(highlightCerts, 700);
      if (intent.highlight === 'skills')   setTimeout(highlightSkills, 500);
    }, 400);
  }, []);

  // Backend-driven navigation: "projects.board-room" scrolls to the section
  // and spotlights the matching card; a bare section token just scrolls.
  const applyAction = useCallback((token) => {
    if (!token || token === 'none') return;
    const [section, targetId] = token.split('.');
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (targetId) {
        setTimeout(() => spotlightCard(section, targetId), 700);
      } else if (section === 'skills') {
        setTimeout(highlightSkills, 500);
      }
    }, 350);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setShowSuggestions(false);
      tourRef.current = false; // the visitor takes over: stop any running tour
      // Cancel any pending greeting speak so it doesn't overlap
      pendingGreetRef.current = false;

      const userIntent = detectIntent(trimmed);
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      setIsLoading(true);

      try {
        const langInstruction = lang === 'en'
          ? 'Please always respond in English only, regardless of what language I write in.'
          : 'من فضلك أجب دائماً باللغة العربية فقط، بغض النظر عن لغة رسالتي.';
        const langAck = lang === 'en'
          ? 'Understood, I will always respond in English.'
          : 'حسناً، سأجيب دائماً باللغة العربية.';

        const history = [
          { role: 'user', content: langInstruction },
          { role: 'assistant', content: langAck },
          ...messages.map((m) => ({
            role: m.role === 'aime' ? 'assistant' : 'user',
            content: m.content,
          })),
        ];
        const res = await fetch(`${API}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history, lang }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const reply = data.reply || data.message || t.aime.noBackend;
        setMessages((prev) => [...prev, { role: 'aime', content: reply }]);
        // Prefer the backend's navigation action; fall back to local intent detection
        if (data.action) applyAction(data.action);
        else navigateToSection(userIntent || detectIntent(reply));
        speakText(reply);
      } catch {
        setMessages((prev) => [...prev, { role: 'aime', content: t.aime.noBackend }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, speakText, navigateToSection, applyAction, t.aime.noBackend, lang]
  );

  // ── Guided tour & canned answers ──────────────────────────────────────────
  // Stop the tour if the panel is closed
  useEffect(() => {
    if (!isOpen) tourRef.current = false;
  }, [isOpen]);

  const runTour = useCallback(async () => {
    if (tourRef.current) return;
    setShowSuggestions(false);
    tourRef.current = true;
    for (const step of t.aime.tour) {
      if (!tourRef.current) break;
      setMessages((prev) => [...prev, { role: 'aime', content: step.text }]);
      applyAction(step.action);
      if (isMutedRef.current) {
        await wait(4200);
      } else {
        await Promise.race([speakText(step.text), wait(25000)]);
        await wait(900);
      }
    }
    tourRef.current = false;
  }, [t.aime.tour, applyAction, speakText]);

  // Instant answers for common questions: no LLM round-trip, the page itself
  // is the content — Aime just navigates and adds one line.
  const handleCanned = useCallback((s) => {
    tourRef.current = false;
    setShowSuggestions(false);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: s.query },
      { role: 'aime', content: s.canned },
    ]);
    applyAction(s.action);
    speakText(s.canned);
  }, [applyAction, speakText]);

  // ── Smart VAD recording ────────────────────────────────────────────────────
  const SILENCE_THRESHOLD = 0.012; // RMS below this = silence
  const SILENCE_DELAY     = 1600;  // ms of silence before auto-stop
  const MIN_SPEECH_MS     = 400;   // ignore clips shorter than this

  const submitAudio = useCallback(async () => {
    const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setIsRecording(false);
    isRecordingRef.current = false;
    if (blob.size < 1000) return;
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      setIsLoading(true);
      const res = await fetch(`${API}/transcribe`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.text || data.transcript || '';
      if (text.trim()) await sendMessage(text);
      else setIsLoading(false);
    } catch {
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: 'aime', content: t.aime.noTranscribe }]);
    }
  }, [sendMessage, t.aime.noTranscribe]);

  const stopRecordingVAD = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state === 'inactive') return;
    mr.onstop = submitAudio;
    mr.stop();
  }, [submitAudio]);

  const startRecording = async () => {
    if (isRecordingRef.current) { stopRecordingVAD(); return; } // toggle off
    setMicError(null);
    // Stop any playing audio first
    if (currentAudioRef.current) { currentAudioRef.current.pause(); setIsSpeaking(false); }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // ── Voice Activity Detection via Web Audio ──────────────────────────
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source    = audioCtx.createMediaStreamSource(stream);
      const analyser  = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let speechStarted = false;
      let speechStartTime = Date.now();

      const checkVAD = () => {
        if (!isRecordingRef.current) return;
        analyser.getFloatTimeDomainData(buf);
        const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
        if (rms > SILENCE_THRESHOLD) {
          if (!speechStarted) { speechStarted = true; speechStartTime = Date.now(); }
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        } else if (speechStarted && !silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            if (Date.now() - speechStartTime >= MIN_SPEECH_MS) stopRecordingVAD();
          }, SILENCE_DELAY);
        }
        requestAnimationFrame(checkVAD);
      };
      requestAnimationFrame(checkVAD);
      // ───────────────────────────────────────────────────────────────────

      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', ''].find(
        (m) => !m || MediaRecorder.isTypeSupported(m)
      );
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start(100);
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch (err) {
      setMicError(
        err.name === 'NotAllowedError'
          ? (lang === 'en' ? 'Microphone permission denied.' : 'تم رفض إذن الميكروفون.')
          : (lang === 'en' ? 'Could not access microphone.' : 'تعذّر الوصول إلى الميكروفون.')
      );
    }
  };

  const handleTextSend = () => { sendMessage(inputText); setInputText(''); };

  const statusLabel = isRecording ? t.aime.listening
    : isLoading   ? t.aime.thinking
    : isSpeaking  ? t.aime.speaking
    : t.aime.online;

  return (
    <>
      {/* FAB - minimize/maximize toggle */}
      <button
        className={`aime-fab ${isOpen ? 'open' : ''} ${isSpeaking ? 'speaking' : ''} ${isRecording ? 'recording' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle Aime assistant"
      >
        {isSpeaking ? (
          <div className="fab-wave">
            {[...Array(5)].map((_, i) => <span key={i} style={{ '--i': i }} />)}
          </div>
        ) : isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
        {!isOpen && <span className="fab-label">Aime</span>}
      </button>

      {/* Chat panel */}
      <div
        className={`aime-panel ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="aime-header">
          <div className="aime-header-left">
            <div className={`aime-avatar ${isSpeaking ? 'speaking' : ''}`}>
              A
              {isSpeaking && <div className="avatar-rings"><span /><span /><span /></div>}
            </div>
            <div>
              <h4><span className="name-ai">AI</span>me</h4>
              <span className={`aime-status ${isRecording ? 'listening' : isSpeaking ? 'speaking' : isLoading ? 'thinking' : 'online'}`}>
                <span className="status-dot" />
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="aime-header-actions">
            {/* Mute */}
            <button
              className={`header-icon-btn ${isMuted ? 'muted' : ''}`}
              onClick={() => {
                if (!isMuted && currentAudioRef.current) { currentAudioRef.current.pause(); setIsSpeaking(false); }
                setIsMuted((m) => !m);
              }}
              title={isMuted ? t.aime.unmute : t.aime.mute}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            {/* Expand */}
            <button
              className={`header-icon-btn ${isExpanded ? 'active' : ''}`}
              onClick={() => setIsExpanded((e) => !e)}
              title={isExpanded ? (lang === 'en' ? 'Collapse' : 'تصغير') : (lang === 'en' ? 'Expand' : 'تكبير')}
            >
              {isExpanded ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
                  <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button className="aime-close-btn" onClick={() => setIsOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="aime-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              {msg.role === 'aime' && <div className="msg-icon">A</div>}
              <div className="msg-bubble">{msg.content}</div>
            </div>
          ))}

          {/* Suggestion chips after greeting */}
          {showSuggestions && messages.length === 1 && (
            <div className="suggestions-row">
              {t.aime.suggestions.map((s) => (
                <button
                  key={s.label}
                  className="suggestion-chip"
                  onClick={() => {
                    if (s.tour) runTour();
                    else if (s.canned) handleCanned(s);
                    else sendMessage(s.query);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="msg-row aime">
              <div className="msg-icon">A</div>
              <div className="msg-bubble typing"><span /><span /><span /></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Speaking waveform */}
        {isSpeaking && (
          <div className="speaking-wave">
            {[...Array(18)].map((_, i) => <div key={i} className="wave-bar" style={{ '--i': i }} />)}
          </div>
        )}

        {/* Input area */}
        <div className="aime-input-area">
          {micError && <p className="mic-error">{micError}</p>}

          <div className="aime-input-bar">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSend(); } }}
              placeholder={t.aime.placeholder}
              disabled={isLoading || isRecording}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />

            {isSpeaking && (
              <button
                className="stop-btn"
                onClick={() => { currentAudioRef.current?.pause(); setIsSpeaking(false); }}
                title={lang === 'en' ? 'Stop' : 'إيقاف'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            )}

            <button
              className={`mic-btn-inline ${isRecording ? 'recording' : ''}`}
              onClick={startRecording}
              title={isRecording
                ? (lang === 'en' ? 'Stop recording' : 'إيقاف التسجيل')
                : (lang === 'en' ? 'Click to speak' : 'اضغط للتحدث')}
              disabled={isLoading || isSpeaking}
            >
              {isRecording ? (
                <div className="mic-recording-anim">
                  {[...Array(3)].map((_, i) => <span key={i} style={{ '--i': i }} />)}
                </div>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>

            <button className="send-btn" onClick={handleTextSend} disabled={!inputText.trim() || isLoading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          <p className="input-hint">
            {isRecording
              ? (lang === 'en' ? 'Listening… tap mic again to stop' : 'يستمع… اضغط المايك للإيقاف')
              : (lang === 'en' ? 'Type a message or tap 🎤 to speak' : 'اكتب رسالة أو اضغط 🎤 للتحدث')}
          </p>
        </div>
      </div>
    </>
  );
}
