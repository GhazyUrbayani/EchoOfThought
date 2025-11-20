(() => {
  "use strict";

  const CLIENT_NAME = "Echo of Thought Prototype";
  const PROVIDER_CHOICE_STORAGE = "echo-of-thought-provider-choice";
  const API_KEY_MAP_STORAGE = "echo-of-thought-api-key-map";
  const MAX_HISTORY_MESSAGES = 12;
  const REQUIRED_PAYLOAD_KEYS = ["response", "prompt", "scene", "relationship_delta", "flags", "choices"];
  const DEFAULT_CHOICE_FALLBACK = "Take a breath and observe the room.";
  const REFERER_HEADER = (() => {
    try {
      const origin = window.location.origin;
      if (origin && origin !== "null") {
        return origin;
      }
      const href = window.location.href;
      return href && href.startsWith("http") ? href : "https://openrouter.ai";
    } catch (_) {
      return "https://openrouter.ai";
    }
  })();
  const LEGACY_STORAGE_KEYS = [
    { storage: "echo-of-thought-openrouter-key", provider: "openrouter" },
    { storage: "echo-of-thought-groq-key", provider: "groq" }
  ];
  const PROVIDERS = {
    openrouter: {
      id: "openrouter",
      displayName: "OpenRouter",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      model: "meta-llama/llama-3.3-70b-instruct",
      keyLabel: "OpenRouter API Key",
      placeholder: "sk-or-...",
      hint: "Get one at openrouter.ai (stored locally only).",
      headers: (key) => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": REFERER_HEADER,
        "X-Title": CLIENT_NAME
      })
    },
    groq: {
      id: "groq",
      displayName: "Groq",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant",
      keyLabel: "Groq API Key",
      placeholder: "gsk_...",
      hint: "Generate at console.groq.com (stored locally only).",
      headers: (key) => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      })
    },
    openai: {
      id: "openai",
      displayName: "OpenAI",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-3.5-turbo",
      keyLabel: "OpenAI API Key",
      placeholder: "sk-...",
      hint: "Sign up at platform.openai.com (stored locally only).",
      headers: (key) => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      })
    }
  };
  const WORLD_BIBLE = {
    premise: "Late-summer transfer student navigating first week at Shibuya High.",
    location: "Tokyo, modern day. Events stay inside campus until explicitly moved.",
    cast: ["Player", "Yuta", "homeroom teacher (Ms. Kuroda)", "background classmates"],
    tone: "Grounded YA drama: intimate, sensory, no fantasy elements or sudden genre shifts.",
    forbidden: [
      "new supernatural powers",
      "new characters speaking without prior approval",
      "time jumps outside the school day",
      "locations outside Shibuya High",
      "romantic interactions that go beyond PG-13 (no explicit sexual content, no physical intimacy descriptions beyond holding hands or a brief hug)"
    ]
  };
  const SCENE_RULES = {
    intro: {
      location: "Homeroom 2-A, moments before first bell.",
      cast: ["Player", "Yuta", "teacher at podium (mostly observing)", "background classmates"],
      mood: "buzzy, first-day nerves, hopeful curiosity.",
      allowedActions: ["greet yuta", "ignore yuta", "observe classroom", "prepare for teacher", "share feelings"],
      notes: [
        "Yuta sits near the window; he already waved first.",
        "Teacher is about to start roll call but has not spoken yet."
      ]
    },
    classroom: {
      location: "Same homeroom during math lecture.",
      cast: ["Player", "Yuta", "teacher"],
      mood: "quiet chalk sounds, whispered rebellion.",
      allowedActions: ["listen to teacher", "whisper to yuta", "pass note", "focus on notebook", "ask to repeat question"],
      notes: [
        "Class is ongoing; keep voices low.",
        "No other students jump into the conversation without prompting."
      ]
    },
    hallway: {
      location: "Second-floor hallway right after class.",
      cast: ["Player", "Yuta", "passing students (background)"],
      mood: "echoing footsteps, adrenaline from recent class.",
      allowedActions: ["follow yuta", "ask about club", "head to locker", "excuse yourself"],
      notes: ["Everyone is moving toward lunch; no teachers nearby."]
    },
    default: {
      location: "Somewhere on campus still during first morning.",
      cast: ["Player", "Yuta"],
      mood: "calm but alert.",
      allowedActions: ["check surroundings", "talk to yuta", "reflect"],
      notes: ["Stay on school grounds; no surprise visitors."]
    }
  };
  const FEW_SHOT_MESSAGES = [
    {
      role: "user",
      content: [
        "Player line: I smile nervously at Yuta and whisper hi.",
        "",
        "State summary:",
        "Scene: intro",
        "Relationship (Yuta): 0",
        "Has introduced self: false",
        "Active hook: Yuta is waiting for acknowledgement.",
        "",
        "World bible:",
        "Stay inside Shibuya High, grounded teen drama, only listed characters may speak.",
        "",
        "Scene directives:",
        "Location: Homeroom 2-A before class.",
        "",
        "Respond strictly with JSON as described in the system prompt. Never add commentary outside JSON."
      ].join("\n")
    },
    {
      role: "assistant",
      content:
        '{"response":"You lean toward Yuta and breathe out a shy hello, palm still damp against your bag strap. His grin softens into something conspiratorial as the room hushes for the bell.","prompt":"How do you introduce yourself?","scene":"intro","relationship_delta":2,"flags":{"hasIntroducedSelf":true},"choices":["Tell him your name.","Ask if he has advice for new students.","Confess you\'re nervous.","Crack a small joke to break the tension."]}'
    }
  ];
  const SYSTEM_PROMPT = [
    "You are Echo, an AI narrator for a choice-driven teen drama set in a Japanese high school.",
    "Write in immersive second-person prose, keeping each turn under roughly 120 words.",
    "Tie every beat to previous events. If the player was kind, show that trust grows. If they were cold, let tension linger.",
    "End every turn with four concise options that vary in focus (internal reflection, teacher, classmates, environment, or Yuta). Only push toward Yuta if the player's recent actions invite it.",
    "Stay within approved locations, characters, and actions. Never invent new powers, time jumps, or surprise characters.",
    "Romance must stay PG-13: no sexual content, no explicit body descriptions, no touching beyond a brief hug or holding hands.",
    "If the player requests forbidden or unsafe content, refuse politely and remind them of the rules; do not describe the forbidden content.",
    "Respond ONLY with minified JSON containing keys: response (string), prompt (string), scene (string), relationship_delta (number), flags (object with hasIntroducedSelf boolean), choices (array of four concise options).",
    "Never add commentary or any text outside that JSON."
  ].join(" ");
  class GameState {
    constructor(initialScene = "intro") {
      this.scene = initialScene;
      this.relationship = { yuta: 0 };
      this.hasIntroducedSelf = false;
      this.conversationHistory = [];
      this.choiceHistory = [];
    }

    rememberChoice(text) {
      if (!text) {
        return;
      }
      this.choiceHistory.push(text);
      if (this.choiceHistory.length > 6) {
        this.choiceHistory.shift();
      }
    }

    describeChoiceHistory() {
      if (!this.choiceHistory.length) {
        return "No explicit choices have been made yet.";
      }
      return this.choiceHistory.map((choice, idx) => `#${idx + 1}: ${choice}`).join("\n");
    }

    remember(role, content, limit = MAX_HISTORY_MESSAGES) {
      this.conversationHistory.push({ role, content });
      if (this.conversationHistory.length > limit) {
        this.conversationHistory.splice(0, this.conversationHistory.length - limit);
      }
    }

    getRecentHistory(limit = MAX_HISTORY_MESSAGES) {
      return this.conversationHistory.slice(-limit);
    }

    describeRelationshipBand(score = this.relationship.yuta) {
      if (score >= 12) return "trusting";
      if (score >= 5) return "warming";
      if (score <= -8) return "hostile";
      if (score <= -3) return "icy";
      return "uncertain";
    }

    computeActiveHook() {
      if (!this.hasIntroducedSelf) {
        return "Yuta is still waiting for you to introduce yourself.";
      }
      if (this.relationship.yuta >= 8) {
        return "Yuta is ready to confide in you if you reach out.";
      }
      if (this.relationship.yuta <= -4) {
        return "Yuta keeps his guard up and may push you away.";
      }
      return "Yuta is curious about your next move.";
    }

    snapshot() {
      return [
        `Scene: ${this.scene}`,
        `Relationship (Yuta): ${this.relationship.yuta} (${this.describeRelationshipBand()})`,
        `Has introduced self: ${this.hasIntroducedSelf}`,
        `Active hook: ${this.computeActiveHook()}`
      ].join("\n");
    }

    applyPayload(payload) {
      if (payload.scene) {
        this.scene = payload.scene;
      }
      if (typeof payload.relationship_delta === "number" && !Number.isNaN(payload.relationship_delta)) {
        this.relationship.yuta += payload.relationship_delta;
      }
      if (payload.flags && typeof payload.flags === "object" && typeof payload.flags.hasIntroducedSelf === "boolean") {
        this.hasIntroducedSelf = payload.flags.hasIntroducedSelf;
      }
    }

    hasHistory() {
      return this.conversationHistory.length > 0;
    }
  }
  class ProviderManager {
    constructor({ providers, mapStorageKey, choiceStorageKey, legacyKeys = [] }) {
      this.providers = providers;
      this.mapStorageKey = mapStorageKey;
      this.choiceStorageKey = choiceStorageKey;
      this.legacyKeys = legacyKeys;
      this.providerKeys = this.loadKeyMap();
      this.applyLegacyKeys();
      this.currentProvider = this.resolveInitialProvider();
    }

    loadKeyMap() {
      try {
        return JSON.parse(window.localStorage.getItem(this.mapStorageKey) || "{}");
      } catch (_) {
        return {};
      }
    }

    applyLegacyKeys() {
      this.legacyKeys.forEach(({ storage, provider }) => {
        if (this.providerKeys[provider]) {
          return;
        }
        try {
          const legacyValue = window.localStorage.getItem(storage);
          if (legacyValue) {
            this.providerKeys[provider] = legacyValue;
            window.localStorage.removeItem(storage);
          }
        } catch (_) {
          /* ignore */
        }
      });
      if (Object.keys(this.providerKeys).length > 0) {
        this.persistKeyMap();
      }
    }

    resolveInitialProvider() {
      let storedChoice = null;
      try {
        storedChoice = window.localStorage.getItem(this.choiceStorageKey);
      } catch (_) {
        storedChoice = null;
      }
      if (storedChoice && this.providers[storedChoice]) {
        return storedChoice;
      }
      if (storedChoice && !this.providers[storedChoice]) {
        return "openrouter";
      }
      const fallback = Object.keys(this.providerKeys).find(
        (key) => this.providers[key] && this.providerKeys[key]
      );
      return fallback || "openrouter";
    }

    getCurrentConfig() {
      return this.providers[this.currentProvider];
    }

    getKey(providerId = this.currentProvider) {
      return this.providerKeys[providerId] || "";
    }

    setProvider(providerId) {
      this.currentProvider = this.providers[providerId] ? providerId : "openrouter";
      this.persistProviderChoice();
      return this.getCurrentConfig();
    }

    persistProviderChoice() {
      try {
        window.localStorage.setItem(this.choiceStorageKey, this.currentProvider);
      } catch (_) {
        /* ignore */
      }
    }

    saveKey(value) {
      this.providerKeys[this.currentProvider] = value;
      this.persistKeyMap();
    }

    clearKey() {
      delete this.providerKeys[this.currentProvider];
      this.persistKeyMap();
    }

    persistKeyMap() {
      try {
        window.localStorage.setItem(this.mapStorageKey, JSON.stringify(this.providerKeys));
      } catch (error) {
        console.warn("Unable to persist API keys map:", error);
      }
    }
  }
  class StoryPromptBuilder {
    constructor(gameState) {
      this.gameState = gameState;
    }

    static getSceneConfig(scene) {
      return SCENE_RULES[scene] || SCENE_RULES.default;
    }

    describeWorldBible() {
      return [
        `Premise: ${WORLD_BIBLE.premise}`,
        `Primary location: ${WORLD_BIBLE.location}`,
        `Allowed cast: ${WORLD_BIBLE.cast.join(", ")}`,
        `Tone: ${WORLD_BIBLE.tone}`,
        `Forbidden topics: ${WORLD_BIBLE.forbidden.join(", ")}`
      ].join("\n");
    }

    describeSceneRules(scene) {
      const config = StoryPromptBuilder.getSceneConfig(scene);
      return [
        `Scene codename: ${scene}`,
        `Location focus: ${config.location}`,
        `Cast allowed to speak: ${config.cast.join(", ")}`,
        `Mood anchors: ${config.mood}`,
        `Allowed actions: ${config.allowedActions.join(" | ")}`,
        config.notes && config.notes.length ? `Non-negotiable facts: ${config.notes.join(" ")}` : ""
      ]
        .filter(Boolean)
        .join("\n");
    }

    composeUserMessage(playerText, meta = {}) {
      const summary = this.gameState.snapshot();
      const playerDescriptor =
        typeof meta.choiceIndex === "number"
          ? `Chosen option #${meta.choiceIndex + 1}: ${playerText}`
          : meta.isBootstrap
          ? "Bootstrap event triggered to start the day."
          : `Player line: ${playerText}`;
      return [
        playerDescriptor,
        "",
        "Recent player selections:",
        this.gameState.describeChoiceHistory(),
        "",
        "Canon snapshot:",
        summary,
        "",
        "World rules:",
        this.describeWorldBible(),
        "",
        "Scene directives:",
        this.describeSceneRules(this.gameState.scene),
        "",
        "Obligations:",
        "- Keep narration under ~120 words and stay in second person.",
        "- No new characters, powers, or locations beyond what the scene lists.",
        "- If the player asks for anything forbidden (e.g., leaving school grounds, adding supernatural elements, explicit romance), gently remind them of the boundaries instead of fulfilling the request.",
        "- Provide exactly four concise options the player can choose from next. Vary their focus so not all revolve around Yuta unless the player keeps pursuing him.",
        "",
        "Respond strictly with JSON as described in the system prompt. Never add commentary outside JSON."
      ].join("\n");
    }

    buildMessages(playerText, meta = {}) {
      return [
        { role: "system", content: SYSTEM_PROMPT },
        ...FEW_SHOT_MESSAGES,
        ...this.gameState.getRecentHistory(MAX_HISTORY_MESSAGES),
        { role: "user", content: this.composeUserMessage(playerText, meta) }
      ];
    }
  }
  class AiJsonParser {
    static cleanJsonCandidate(raw) {
      if (typeof raw !== "string") {
        return "";
      }
      let text = raw.trim();
      if (!text) {
        return "";
      }
      if (text.startsWith("```")) {
        text = text.replace(/^```(?:json)?/i, "");
        const closingIndex = text.lastIndexOf("```");
        if (closingIndex >= 0) {
          text = text.slice(0, closingIndex);
        }
        text = text.trim();
      }
      return text;
    }

    static normalizeQuotes(text) {
      return text
        .replace(/[\u201C\u201D\u2033]/g, '"')
        .replace(/[\u2018\u2019\u2032]/g, "'")
        .replace(/[\u2013\u2014]/g, "-");
    }

    static extractBalancedJson(text) {
      let start = -1;
      let depth = 0;
      let inString = false;
      let escapeNext = false;
      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        if (char === "\\") {
          escapeNext = true;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          continue;
        }
        if (inString) {
          continue;
        }
        if (char === "{") {
          if (depth === 0) {
            start = i;
          }
          depth += 1;
        } else if (char === "}") {
          if (depth > 0) {
            depth -= 1;
            if (depth === 0 && start !== -1) {
              return text.slice(start, i + 1);
            }
          }
        }
      }
      if (start === 0 && depth === 0) {
        return text;
      }
      return "";
    }

    static escapeBareNewlines(text) {
      let inString = false;
      let escapeNext = false;
      let output = "";
      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (escapeNext) {
          output += char;
          escapeNext = false;
          continue;
        }
        if (char === "\\") {
          escapeNext = true;
          output += char;
          continue;
        }
        if (char === '"') {
          inString = !inString;
          output += char;
          continue;
        }
        if (inString && (char === "\n" || char === "\r" || char === "\t")) {
          output += char === "\t" ? "\\t" : "\\n";
          continue;
        }
        output += char;
      }
      return output;
    }

    static fixTrailingCommas(text) {
      return text.replace(/,\s*(\}|\])/g, "$1");
    }

    static normalizeChoices(rawChoices) {
      const list = Array.isArray(rawChoices) ? rawChoices : [];
      const cleaned = list
        .map((choice) => {
          if (typeof choice === "string") {
            return choice.trim();
          }
          if (choice && typeof choice.text === "string") {
            return choice.text.trim();
          }
          return "";
        })
        .filter(Boolean);
      while (cleaned.length < 4) {
        cleaned.push(DEFAULT_CHOICE_FALLBACK);
      }
      return cleaned.slice(0, 4);
    }

    static parse(result) {
      const content = result?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Story AI returned an empty response.");
      }
      const text =
        Array.isArray(content) && content.length
          ? content.map((chunk) => (typeof chunk === "string" ? chunk : chunk?.text ?? "")).join("")
          : content;
      const cleaned = AiJsonParser.normalizeQuotes(AiJsonParser.cleanJsonCandidate(text));
      const balanced = AiJsonParser.extractBalancedJson(cleaned) || cleaned;
      const sanitized = AiJsonParser.fixTrailingCommas(AiJsonParser.escapeBareNewlines(balanced));
      try {
        return JSON.parse(sanitized);
      } catch (error) {
        console.warn("AI JSON parse failed. Raw payload:", sanitized, error);
        const braceStart = cleaned.indexOf("{");
        const braceEnd = cleaned.lastIndexOf("}");
        if (braceStart !== -1 && braceEnd > braceStart) {
          const sliced = cleaned.slice(braceStart, braceEnd + 1);
          try {
            const normalized = AiJsonParser.fixTrailingCommas(AiJsonParser.escapeBareNewlines(sliced));
            return JSON.parse(normalized);
          } catch (innerError) {
            console.warn("Brace-sliced JSON parse failed:", innerError);
          }
        }
        try {
          const candidate = sanitized.trim() ? sanitized : cleaned.trim();
          return new Function(`return (${candidate});`)();
        } catch (fallbackError) {
          throw new Error("AI returned invalid JSON: " + fallbackError.message);
        }
      }
    }
  }
  class StoryEngine {
    constructor({ providerManager, promptBuilder, gameState }) {
      this.providerManager = providerManager;
      this.promptBuilder = promptBuilder;
      this.gameState = gameState;
    }

    buildMessages(playerText, meta = {}) {
      return this.promptBuilder.buildMessages(playerText, meta);
    }

    async requestStoryBeat(playerText, meta = {}) {
      const config = this.providerManager.getCurrentConfig();
      const payload = {
        model: config.model,
        messages: this.buildMessages(playerText, meta),
        temperature: 0.85,
        max_tokens: 500
      };
      let attempt = 0;
      // retry a few times if we hit rate limits
      // to avoid exceeding quotas mid-gameplay.
      while (attempt < 4) {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: config.headers(this.providerManager.getKey()),
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (response.ok) {
          return this.ensurePayloadIntegrity(AiJsonParser.parse(data));
        }
        const message = data?.error?.message || `HTTP ${response.status}`;
        if (response.status === 429 || /rate limit/i.test(message)) {
          attempt += 1;
          const waitMs = StoryEngine.deriveWaitMs(message, attempt);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }
        throw new Error(message);
      }
      throw new Error("Rate limit reached repeatedly. Please pause for a minute before trying again.");
    }

    static deriveWaitMs(message, attempt) {
      const match = message.match(/([\d.]+)\s*s/);
      const seconds = match ? Number(match[1]) : 5 + attempt * 2;
      const clamped = Number.isFinite(seconds) ? seconds : 8;
      return Math.max(clamped, 5) * 1000;
    }

    ensurePayloadIntegrity(payload) {
      REQUIRED_PAYLOAD_KEYS.forEach((key) => {
        if (!(key in payload)) {
          throw new Error(`Story JSON missing key: ${key}`);
        }
      });
      if (typeof payload.response !== "string" || !payload.response.trim()) {
        throw new Error("Story JSON missing response text.");
      }
      if (typeof payload.prompt !== "string" || !payload.prompt.trim()) {
        payload.prompt = "What do you say next?";
      }
      if (typeof payload.relationship_delta !== "number" || Number.isNaN(payload.relationship_delta)) {
        payload.relationship_delta = 0;
      }
      if (!payload.scene || typeof payload.scene !== "string" || !SCENE_RULES[payload.scene]) {
        payload.scene = this.gameState.scene;
      }
      if (!payload.flags || typeof payload.flags !== "object") {
        payload.flags = {};
      }
      if (typeof payload.flags.hasIntroducedSelf !== "boolean") {
        payload.flags.hasIntroducedSelf = this.gameState.hasIntroducedSelf;
      }
      payload.choices = AiJsonParser.normalizeChoices(payload.choices);
      return payload;
    }
  }
  class StoryUI {
    constructor({
      logEl,
      choicesEl,
      statusEl,
      providerSelect,
      apiKeyInput,
      saveKeyBtn,
      clearKeyBtn,
      apiKeyLabelEl,
      apiHintEl
    }) {
      this.logEl = logEl;
      this.choicesEl = choicesEl;
      this.statusEl = statusEl;
      this.providerSelect = providerSelect;
      this.apiKeyInput = apiKeyInput;
      this.saveKeyBtn = saveKeyBtn;
      this.clearKeyBtn = clearKeyBtn;
      this.apiKeyLabelEl = apiKeyLabelEl;
      this.apiHintEl = apiHintEl;
      this.awaitingChoice = false;
      this.currentChoices = [];
      this.choiceHandler = null;
    }

    addMessage(text, role = "game") {
      const div = document.createElement("div");
      div.className = "msg " + role;
      div.textContent = text;
      this.logEl.appendChild(div);
      this.logEl.scrollTop = this.logEl.scrollHeight;
    }

    setStatus(text) {
      this.statusEl.textContent = text;
    }

    renderChoices(choices) {
      this.currentChoices = Array.isArray(choices)
        ? choices.filter((choice) => typeof choice === "string" && choice.trim())
        : [];
      this.choicesEl.innerHTML = "";
      if (!this.currentChoices.length) {
        this.clearChoices("Echo is thinking...");
        return;
      }
      this.awaitingChoice = true;
      this.choicesEl.classList.remove("empty");
      const fragment = document.createDocumentFragment();
      this.currentChoices.forEach((choiceText, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-btn";
        button.textContent = `${index + 1}. ${choiceText}`;
        button.addEventListener("click", () => {
          if (this.choiceHandler) {
            this.choiceHandler(index, this.currentChoices[index]);
          }
        });
        fragment.appendChild(button);
      });
      this.choicesEl.appendChild(fragment);
    }

    clearChoices(message = "Echo is thinking...") {
      this.awaitingChoice = false;
      this.currentChoices = [];
      this.choicesEl.classList.add("empty");
      this.choicesEl.textContent = message;
    }

    onChoice(handler) {
      this.choiceHandler = handler;
    }

    onProviderChange(handler) {
      this.providerSelect?.addEventListener("change", () => handler(this.providerSelect.value));
    }

    onSaveKey(handler) {
      this.saveKeyBtn?.addEventListener("click", handler);
    }

    onClearKey(handler) {
      this.clearKeyBtn?.addEventListener("click", handler);
    }

    updateProviderDetails(config, storedKey) {
      this.setProviderSelectValue(config.id);
      this.apiKeyLabelEl.textContent = config.keyLabel;
      this.apiKeyInput.placeholder = config.placeholder;
      this.apiHintEl.textContent = config.hint;
      if (typeof storedKey === "string") {
        this.apiKeyInput.value = storedKey;
      }
    }

    setProviderSelectValue(value) {
      if (this.providerSelect) {
        this.providerSelect.value = value;
      }
    }

    getApiKeyInputValue() {
      return this.apiKeyInput.value.trim();
    }

    setApiKeyInputValue(value) {
      this.apiKeyInput.value = value;
    }

    isAwaitingChoice() {
      return this.awaitingChoice;
    }
  }
  class EchoStoryApp {
    constructor() {
      this.gameState = new GameState();
      this.providerManager = new ProviderManager({
        providers: PROVIDERS,
        mapStorageKey: API_KEY_MAP_STORAGE,
        choiceStorageKey: PROVIDER_CHOICE_STORAGE,
        legacyKeys: LEGACY_STORAGE_KEYS
      });
      this.ui = new StoryUI({
        logEl: document.getElementById("log"),
        choicesEl: document.getElementById("choices"),
        statusEl: document.getElementById("status"),
        providerSelect: document.getElementById("provider-select"),
        apiKeyInput: document.getElementById("api-key"),
        saveKeyBtn: document.getElementById("save-key"),
        clearKeyBtn: document.getElementById("clear-key"),
        apiKeyLabelEl: document.getElementById("api-key-label"),
        apiHintEl: document.getElementById("api-hint")
      });
      this.promptBuilder = new StoryPromptBuilder(this.gameState);
      this.engine = new StoryEngine({
        providerManager: this.providerManager,
        promptBuilder: this.promptBuilder,
        gameState: this.gameState
      });
      this.isProcessingTurn = false;
      this.registerHandlers();
      this.syncProviderUI();
      this.startStory();
    }

    registerHandlers() {
      this.ui.onChoice((index, text) => this.handleChoiceSelection(index, text));
      this.ui.onProviderChange((providerId) => this.handleProviderChange(providerId));
      this.ui.onSaveKey(() => this.handleSaveKey());
      this.ui.onClearKey(() => this.handleClearKey());
    }

    syncProviderUI() {
      const config = this.providerManager.getCurrentConfig();
      this.ui.updateProviderDetails(config, this.providerManager.getKey());
    }

    handleChoiceSelection(index, choiceText) {
      if (!choiceText || this.isProcessingTurn) {
        return;
      }
      this.ui.clearChoices("Echo is considering your choice...");
      this.ui.addMessage(`You pick: ${choiceText}`, "player");
      this.gameState.rememberChoice(choiceText);
      this.runStoryTurn(choiceText, { choiceIndex: index });
    }

    handleProviderChange(providerId) {
      const config = this.providerManager.setProvider(providerId);
      this.syncProviderUI();
      this.ui.addMessage(`Provider switched to ${config.displayName}.`, "system");
      if (!this.providerManager.getKey()) {
        this.ui.addMessage(
          `Tip: add your ${config.displayName} API key above to let the AI drive the narrative.`,
          "system"
        );
      }
    }

    handleSaveKey() {
      const value = this.ui.getApiKeyInputValue();
      if (!value) {
        this.ui.addMessage("Enter a valid API key before saving.", "system");
        return;
      }
      this.providerManager.saveKey(value);
      const config = this.providerManager.getCurrentConfig();
      this.ui.addMessage(`${config.displayName} API key saved locally in this browser.`, "system");
      if (!this.gameState.hasHistory() && !this.isProcessingTurn) {
        this.ui.addMessage("Starting the scene now that a key is set...", "system");
        this.runStoryTurn("BEGIN", { skipHistory: true, isBootstrap: true });
      }
    }

    handleClearKey() {
      this.ui.setApiKeyInputValue("");
      this.providerManager.clearKey();
      const config = this.providerManager.getCurrentConfig();
      this.ui.addMessage(`${config.displayName} API key cleared from this device.`, "system");
      this.ui.clearChoices("Add an API key to keep playing.");
      this.ui.setStatus("Add an API key to keep playing.");
    }

    async runStoryTurn(playerText, meta = {}) {
      if (!this.providerManager.getKey()) {
        const providerName = this.providerManager.getCurrentConfig().displayName;
        this.ui.addMessage(`Add your ${providerName} API key in the header to contact the story model.`, "system");
        this.ui.setStatus("Add an API key to continue.");
        return;
      }
      if (this.isProcessingTurn) {
        this.ui.addMessage("Still waiting on the previous turn. Give it a moment.", "system");
        return;
      }

      this.isProcessingTurn = true;
      this.ui.clearChoices("Echo is considering your move...");
      this.ui.setStatus("Echo is thinking...");

      try {
        const aiPayload = await this.engine.requestStoryBeat(playerText, meta);
        const combinedText = aiPayload.prompt ? `${aiPayload.response}\n\n${aiPayload.prompt}` : aiPayload.response;

        this.applyHistory(playerText, meta, aiPayload);
        this.ui.addMessage(combinedText, "game");
        this.speak(aiPayload.response);
        this.ui.renderChoices(aiPayload.choices);
      } catch (error) {
        console.error(error);
        this.ui.addMessage("Story engine error: " + error.message, "system");
        this.ui.clearChoices("Waiting for a valid response...");
        this.ui.setStatus("Waiting for a valid response...");
      } finally {
        this.isProcessingTurn = false;
        if (this.ui.isAwaitingChoice()) {
          this.ui.setStatus("Choose your next move.");
        } else {
          this.ui.setStatus("Idle");
        }
      }
    }

    applyHistory(playerText, meta, aiPayload) {
      this.gameState.applyPayload(aiPayload);
      if (!meta.skipHistory) {
        const descriptor =
          typeof meta.choiceIndex === "number"
            ? `Choice ${meta.choiceIndex + 1}: ${playerText}`
            : meta.isBootstrap
            ? "Bootstrap action"
            : `Player: ${playerText}`;
        this.gameState.remember("user", descriptor);
      }
      this.gameState.remember(
        "assistant",
        [
          `Narration: ${aiPayload.response}`,
          aiPayload.scene ? `Scene: ${aiPayload.scene}` : "",
          aiPayload.prompt ? `Prompt: ${aiPayload.prompt}` : "",
          typeof aiPayload.relationship_delta === "number" ? `Relationship delta: ${aiPayload.relationship_delta}` : ""
        ]
          .filter(Boolean)
          .join("\n")
      );
    }

    speak() {
      // Text-to-speech intentionally disabled for now.
    }

    startStory() {
      this.ui.addMessage("You step into Shibuya High and breathe in the chalk dust.", "game");
      this.ui.setStatus("Echo is setting the scene...");
      this.runStoryTurn("BEGIN", { skipHistory: true, isBootstrap: true });
      if (!this.providerManager.getKey()) {
        this.ui.addMessage(
          `Tip: add your ${this.providerManager.getCurrentConfig().displayName} API key above to let the AI drive the narrative.`,
          "system"
        );
      }
      this.ui.addMessage("When you're ready, tap one of Echo's options to answer Yuta.", "system");
    }
  }

  new EchoStoryApp();
})();
