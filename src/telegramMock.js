export function createMockTelegram() {
  const listeners = {}

  const MainButton = {
    _visible: false,
    _text: '',
    show() { this._visible = true; dispatch('mainButtonClicked') },
    hide() { this._visible = false },
    setText(t) { this._text = t },
    onClick(cb) { addEventListener('mainButtonClicked', cb) },
    offClick(cb) { removeEventListener('mainButtonClicked', cb) }
  }

  const WebApp = {
    initData: null,
    initDataUnsafe: { user: { id: 123, first_name: 'Dev' } },
    isExpanded: false,
    showMainButton() { MainButton._visible = true },
    MainButton,
    ready() { dispatch('ready') },
    onEvent(event, cb) { addEventListener(event, cb) },
    offEvent(event, cb) { removeEventListener(event, cb) },
    openTelegramLink(url) { console.log('[mock] openTelegramLink', url) },
    sendData(data) { console.log('[mock] sendData', data) }
  }

  function addEventListener(evt, cb) {
    listeners[evt] = listeners[evt] || []
    listeners[evt].push(cb)
  }

  function removeEventListener(evt, cb) {
    if (!listeners[evt]) return
    listeners[evt] = listeners[evt].filter((f) => f !== cb)
  }

  function dispatch(evt, payload) {
    (listeners[evt] || []).forEach((cb) => cb(payload))
  }

  return { WebApp, dispatch }
}
