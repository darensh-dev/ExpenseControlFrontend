const elementId = "theme-css";
const APP_KEY_THEME = import.meta.env.APP_KEY_THEME;

function initTheme() {
  const init = {
    layoutConfig: {
      ripple: false,
      darkTheme: true,
      inputStyle: "outlined",
      menuMode: "static",
      theme: "vela-orange",
      scale: 14,
      activeMenuItem: null,
    },
    layoutState: {
      staticMenuDesktopInactive: false,
      overlayMenuActive: false,
      profileSidebarVisible: false,
      configSidebarVisible: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    },
  };
  localStorage.setItem(APP_KEY_THEME, JSON.stringify(init));
}

export const loadThemeColorScheme = () => {
  const layout = localStorage.getItem(APP_KEY_THEME);
  if (layout != undefined) {
    const obj = JSON.parse(layout);
    const { theme } = obj.layoutConfig;
    const linkElement = document.getElementById(elementId);
    const newHref = `/themes/${theme}/theme.css`;
    replaceLink(linkElement, newHref, () => {});
  } else {
    initTheme();
  }
};

const replaceLink = (linkElement, href, onComplete) => {
  if (!linkElement || !href) {
    return;
  }

  const cloneLinkElement = linkElement.cloneNode(true);

  cloneLinkElement.setAttribute("href", href);
  cloneLinkElement.setAttribute("id", elementId + "-clone");

  linkElement.parentNode.insertBefore(
    cloneLinkElement,
    linkElement.nextSibling
  );

  cloneLinkElement.addEventListener("load", () => {
    linkElement.remove();

    const element = document.getElementById(elementId);
    element && element.remove();

    cloneLinkElement.setAttribute("id", elementId);
    onComplete && onComplete();
  });
};
