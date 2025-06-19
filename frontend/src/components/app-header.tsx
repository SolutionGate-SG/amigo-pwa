// components/AppHeader.tsx
"use client";

import { useEffect, useState, Fragment, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/android-launchericon-48-48.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaBars, FaTimes, FaDownload, FaCog } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";

// Define BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Type for the translations object
type Translations = {
  [key: string]: string | Translations;
};

export default function AppHeader() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("customer");
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallPrompt, setIsInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [language, setLanguage] = useState("en"); // Default English
  const [theme, setTheme] = useState("light"); // Default light
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(
    {}
  );

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const router = useRouter();
  const { fetchCart } = useCartStore();

  // Function to load translations dynamically
  const loadTranslations = useCallback(
    async (lang: string) => {
      try {
        const translationsModule = await import(`@/lib/locales/${lang}.json`);
        setCurrentTranslations(translationsModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        // Fallback to English if translation file is missing or an error occurs
        const defaultTranslationsModule = await import(`@/lib/locales/en.json`);
        setCurrentTranslations(defaultTranslationsModule.default);
      }
    },
    []
  );

  // Helper to get translated text based on current language
  const getTranslation = useCallback(
    (key: keyof Translations | string) => {
      return currentTranslations[key] || key; // Fallback to key if translation not found
    },
    [currentTranslations]
  );

  useEffect(() => {
    setIsClient(true);
    // Initialize language from localStorage or default to 'en'
    const storedLanguage = localStorage.getItem("appLanguage");
    if (storedLanguage) {
      setLanguage(storedLanguage);
      loadTranslations(storedLanguage); // Load translations for the stored language
    } else {
      loadTranslations("en"); // Load English by default
    }
  }, [loadTranslations]);

  useEffect(() => {
    if (!isClient) return;

    // Supabase Auth Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await fetchCart();
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          const { data: vendor } = await supabase
            .from("vendors")
            .select("id")
            .eq("user_id", session.user.id)
            .single();
          setRole(vendor ? "vendor" : profile?.role || "customer");
        } else {
          setRole("customer");
          setUser(null);
        }
      }
    );

    // Initial user and cart fetch
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        await fetchCart();
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        const { data: vendor } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", data.user.id)
          .single();
        setRole(vendor ? "vendor" : profile?.role || "customer");
      }
    });

    // PWA Install Prompt Logic
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isPromptShown = localStorage.getItem("installPromptShown");

    if (isStandalone || isPromptShown) {
      setIsInstallPrompt(false);
    } else {
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
      setIsIOS(isIOSDevice);

      if (!isIOSDevice) {
        const handler = (e: Event) => {
          e.preventDefault();
          const installEvent = e as BeforeInstallPromptEvent;
          setDeferredPrompt(installEvent);
          setIsInstallPrompt(true);
        };

        const timeout = setTimeout(() => {
          window.addEventListener("beforeinstallprompt", handler);
        }, 30000); // 30-second delay

        return () => {
          clearTimeout(timeout);
          window.removeEventListener("beforeinstallprompt", handler);
        };
      }
    }

    return () => authListener.subscription.unsubscribe();
  }, [fetchCart, isClient]);

  useEffect(() => {
    if (!isClient) return;
    // Apply theme
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, isClient]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) alert(`${getTranslation("login_failed")}: ${error.message}`);
    else {
      setIsLoginOpen(false);
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error)
      alert(`${getTranslation("google_login_failed")}: ${error.message}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleInstall = async () => {
    if (!isClient) return;

    if (isIOS) {
      alert(getTranslation("install_ios_guide"));
      localStorage.setItem("installPromptShown", "true");
      setIsInstallPrompt(false);
      return;
    }

    if (deferredPrompt) {
      setIsInstallPrompt(false);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem("installPromptShown", "true");
      }
      setDeferredPrompt(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("appLanguage", lang);
    loadTranslations(lang); // Load new translations when language changes
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const menuItems = (
    <>
      <Link
        href="/categories"
        className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
        onClick={() => setIsMenuOpen(false)}
      >
        {getTranslation("categories")}
      </Link>
      <Link
        href="/cart"
        className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
        onClick={() => setIsMenuOpen(false)}
      >
        {getTranslation("cart")} 
      </Link>
      {user ? (
        <>
          <Link
            href="/account"
            className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
            onClick={() => setIsMenuOpen(false)}
          >
            {getTranslation("account")} ({role})
          </Link>
          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2"
          >
            Logout
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            setIsLoginOpen(true);
            setIsMenuOpen(false);
          }}
          variant="outline"
        >
          {getTranslation("account")}
        </Button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo - Hidden on mobile, shown on desktop */}
        <Link
          href="/"
          className="hidden md:block text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          <Image
            src={logo}
            alt="Amigo eStore Logo"
            className="object-cover rounded"
          />
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-grow max-w-xl mx-4 relative">
          <form onSubmit={handleSearch} className="w-full">
            <Input
              type="text"
              placeholder={getTranslation("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              aria-label="Search products"
            />
          </form>
          {isInstallPrompt && (
            <Button
              onClick={handleInstall}
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label={getTranslation("install_app")}
            >
              <FaDownload className="text-gray-600 dark:text-gray-300" />
            </Button>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {menuItems}
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="ghost"
            aria-label="Settings"
          >
            <FaCog className="text-gray-600 dark:text-gray-300" />
          </Button>
        </nav>

        {/* Mobile Header: Search Bar and Icons in one line */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Button onClick={() => setIsMenuOpen(true)} className="mr-2">
            <FaBars className="text-gray-600 dark:text-gray-300" />
          </Button>

          <form onSubmit={handleSearch} className="flex-grow">
            <Input
              type="text"
              placeholder={getTranslation("search_placeholder_mobile")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </form>

          <div className="flex items-center gap-2 ml-2">
            {isInstallPrompt && (
              <Button
                onClick={handleInstall}
                variant="ghost"
                aria-label={getTranslation("install_app")}
              >
                <FaDownload className="text-gray-600 dark:text-gray-300" />
              </Button>
            )}
            <Button
              onClick={() => setIsSettingsOpen(true)}
              variant="ghost"
              aria-label="Settings"
            >
              <FaCog className="text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Sidebar - Full Screen, from Left) */}
      <Transition appear show={isMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={() => setIsMenuOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            {/* Changed justify-end to justify-start */}
            <div className="flex min-h-full items-start justify-start">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="-translate-x-full" /* Slide in from left */
                enterTo="translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full" /* Slide out to left */
              >
                {/* Changed w-64 to w-full */}
                <Dialog.Panel className="w-full bg-white dark:bg-gray-800 h-full p-4 shadow-xl">
                  {/* Close button inside the sidebar */}
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsMenuOpen(false)}>
                      <FaTimes className="text-gray-600 dark:text-gray-300" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-4">{menuItems}</nav>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Login/Signup Dialog (remains unchanged) */}
      <Transition appear show={isLoginOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={() => setIsLoginOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {getTranslation("login_title")}
                  </Dialog.Title>
                  <form onSubmit={handleLogin} className="mt-4 space-y-4">
                    <Input
                      type="email"
                      placeholder={getTranslation("email_placeholder")}
                      required
                      className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder={getTranslation("password_placeholder")}
                      required
                      className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button type="submit" className="w-full">
                        {getTranslation("login")}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full"
                      >
                        Google Login
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Settings Dialog (remains unchanged) */}
      <Transition appear show={isSettingsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={() => setIsSettingsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {getTranslation("settings_title")}
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getTranslation("language")}
                      </label>
                      <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="en">
                          {getTranslation("english")}
                        </option>
                        <option value="ne">
                          {getTranslation("nepali")}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getTranslation("theme")}
                      </label>
                      <select
                        value={theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="light">
                          {getTranslation("light")}
                        </option>
                        <option value="dark">
                          {getTranslation("dark")}
                        </option>
                      </select>
                    </div>
                    <Button
                      onClick={() => setIsSettingsOpen(false)}
                      className="w-full"
                    >
                      {getTranslation("close")}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}