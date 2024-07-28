export interface PwaInjection {
  /**
   * @deprecated use `isPWAInstalled` instead
   */
  isInstalled: boolean;
  /**
   * From version v0.3.5+.
   */
  isPWAInstalled: Ref<boolean>;
  showInstallPrompt: Ref<boolean>;
  cancelInstall: () => void;
  install: () => Promise<void>;
  swActivated: Ref<boolean>;
  registrationError: Ref<boolean>;
  offlineReady: Ref<boolean>;
  needRefresh: Ref<boolean>;
  updateServiceWorker: (reloadPage?: boolean | undefined) => Promise<void>;
  cancelPrompt: () => Promise<void>;
  getSWRegistration: () => ServiceWorkerRegistration | undefined;
}

declare module "#app" {
  interface NuxtApp {
    $pwa: UnwrapNestedRefs<PwaInjection>;
  }
}
