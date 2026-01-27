import { useState, useEffect } from 'react'
import './options.css'

interface Settings {
  enableNotifications: boolean
  autoStart: boolean
  theme: 'light' | 'dark'
}

function Options() {
  const [settings, setSettings] = useState<Settings>({
    enableNotifications: true,
    autoStart: false,
    theme: 'light',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings as Settings)
      }
    })
  }, [])

  const handleSave = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const handleReset = () => {
    const defaultSettings: Settings = {
      enableNotifications: true,
      autoStart: false,
      theme: 'light',
    }
    setSettings(defaultSettings)
    chrome.storage.local.set({ settings: defaultSettings })
  }

  return (
    <div className="options-container">
      <header>
        <h1>Extension Settings</h1>
        <p>Configure your extension preferences</p>
      </header>

      <main>
        <section className="settings-section">
          <h2>General</h2>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, enableNotifications: e.target.checked })
                }
              />
              <span>Enable Notifications</span>
            </label>
            <p className="setting-description">
              Show notifications when content script receives messages
            </p>
          </div>

          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoStart}
                onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })}
              />
              <span>Auto Start</span>
            </label>
            <p className="setting-description">
              Automatically start extension features on page load
            </p>
          </div>
        </section>

        <section className="settings-section">
          <h2>Appearance</h2>

          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' })
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="setting-description">Choose your preferred color theme</p>
          </div>
        </section>

        <div className="actions">
          <button className="btn-primary" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reset to Defaults
          </button>
        </div>
      </main>

      <footer>
        <p>Demumu Chrome Extension v{chrome.runtime.getManifest().version}</p>
      </footer>
    </div>
  )
}

export default Options
