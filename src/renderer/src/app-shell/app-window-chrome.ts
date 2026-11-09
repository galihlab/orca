import {
  isPairedWebClientWindow,
  shouldRenderDesktopWindowChrome
} from '@/lib/desktop-window-chrome'

export const isMac = navigator.userAgent.includes('Mac')
export const isWindows = !isMac && navigator.userAgent.includes('Windows')
export const isLinux = !isMac && !isWindows
export const shortcutPlatform: NodeJS.Platform = isMac ? 'darwin' : isWindows ? 'win32' : 'linux'
// Custom chrome belongs to Windows/Linux desktops; paired browser tabs need no window controls.
export const hasCustomTitleBar = shouldRenderDesktopWindowChrome({
  platform: shortcutPlatform,
  isWebClient: isPairedWebClientWindow()
})

// Why: Windows renders window controls on the right (138px). Linux with MacTahoe traffic lights
// puts them on the left, so the right-side offset is 0px there.
export const WINDOW_CONTROLS_WIDTH = hasCustomTitleBar && isWindows ? '138px' : '0px'
export const WINDOW_CONTROLS_HEIGHT = hasCustomTitleBar ? '36px' : '0px'

// Why: macOS and Linux both paint traffic lights on the window's top-left edge.
export const hasMacTrafficLights = (isMac || (hasCustomTitleBar && isLinux)) && !isPairedWebClientWindow()
export const MAC_TRAFFIC_LIGHTS_WIDTH = hasMacTrafficLights ? '80px' : '0px'
