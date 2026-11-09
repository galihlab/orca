import { useEffect, useState } from 'react'
import { useTranslate } from '@/i18n/use-translate'
import { isLinux } from './app-window-chrome'

// Why: Windows uses right-aligned Win11 buttons; Linux uses left-aligned macOS-style traffic lights.
export function WindowControls(): React.JSX.Element {
  const t = useTranslate()
  const [maximized, setMaximized] = useState(false)
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    // Seed maximization from main; transition events alone miss startup-maximized windows.
    let cancelled = false
    void window.api.ui.isMaximized().then((value) => {
      if (!cancelled) {
        setMaximized(value)
      }
    })
    const unsubscribe = window.api.ui.onMaximizeChanged(setMaximized)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  if (isLinux) {
    return (
      <div
        className="window-controls-left"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="traffic-light traffic-light-close"
          aria-label={t('auto.App.e960d18540', 'Close')}
          onClick={() => window.api.ui.requestClose()}
          title={t('auto.App.e960d18540', 'Close')}
        >
          {hovered && (
            <svg width="6" height="6" viewBox="0 0 6 6" className="traffic-light-icon" aria-hidden>
              <path
                d="M1 1L5 5M5 1L1 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="traffic-light traffic-light-minimize"
          aria-label={t('auto.App.bbb7f90669', 'Minimize')}
          onClick={() => window.api.ui.minimize()}
          title={t('auto.App.bbb7f90669', 'Minimize')}
        >
          {hovered && (
            <svg width="6" height="2" viewBox="0 0 6 2" className="traffic-light-icon" aria-hidden>
              <path
                d="M0.5 1h5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="traffic-light traffic-light-maximize"
          aria-label={
            maximized ? t('auto.App.66f0a552e5', 'Restore') : t('auto.App.c9d6f98459', 'Maximize')
          }
          onClick={() => window.api.ui.maximize()}
          title={
            maximized ? t('auto.App.66f0a552e5', 'Restore') : t('auto.App.c9d6f98459', 'Maximize')
          }
        >
          {hovered && (
            <svg width="6" height="6" viewBox="0 0 6 6" className="traffic-light-icon" aria-hidden>
              <path
                d="M1 2.5L2.5 1M5 3.5L3.5 5M1 1h2v2M5 5H3V3"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="window-controls">
      <button
        className="window-controls-btn"
        aria-label={t('auto.App.bbb7f90669', 'Minimize')}
        onClick={() => window.api.ui.minimize()}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M0 5h10v1H0z" fill="currentColor" />
        </svg>
      </button>
      <button
        className="window-controls-btn"
        aria-label={
          maximized ? t('auto.App.66f0a552e5', 'Restore') : t('auto.App.c9d6f98459', 'Maximize')
        }
        onClick={() => window.api.ui.maximize()}
      >
        {maximized ? (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2 0v2H0v8h8V8h2V0H2zm6 9H1V3h7v6zM9 7H8V2H3V1h6v6z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
          </svg>
        )}
      </button>
      <button
        className="window-controls-btn window-controls-close"
        aria-label={t('auto.App.e960d18540', 'Close')}
        // Request main’s close event so terminal confirmation runs; sandboxed window.close is unreliable.
        onClick={() => window.api.ui.requestClose()}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
