"use client";

import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { FaBars, FaTimes } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { FaDownload } from "react-icons/fa6";

export default function AppHeader() {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isInstallPrompt, setIsInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const { items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === "accepted") {
        setIsInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
      setIsMenuOpen(false); // Close menu on search
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you'd handle authentication here (e.g., API call)
    console.log("Login/Sign Up logic here");
    setIsLoginOpen(false);
  };

  const menuItems = (
    <>
      <Link
        href="/categories"
        className="text-gray-600 hover:text-blue-500"
        onClick={() => setIsMenuOpen(false)}
      >
        Categories
      </Link>
      <Link
        href="/cart"
        className="relative"
        onClick={() => setIsMenuOpen(false)}
      >
        <Button variant="secondary">Cart ({items.length})</Button>
      </Link>
      <Button
        onClick={() => {
          setIsLoginOpen(true);
          setIsMenuOpen(false);
        }}
        variant="outline"
      >
        Account
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-20 bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Amigo eStore
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-grow max-w-xl mx-4">
          <form onSubmit={handleSearch} className="w-full">
            <Input
              type="text"
              placeholder="Search products (e.g., Goldstar, Trekking, etc.)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
              aria-label="Search products"
            />
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">{menuItems}</nav>

        {isInstallPrompt && (
          <Button
            onClick={handleInstall}
            variant="outline"
            className="gap-2 ms-auto mr-2 !bg-transparent"
          >
            <FaDownload className="text-sky-600" />{translations.install_app}
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
          <FaBars />
        </Button>
      </div>

      {/* Mobile Search (below header on mobile) */}
      <div className="md:hidden w-full mt-4">
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* Mobile Menu Dialog */}
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
            <div className="flex min-h-full items-start justify-end">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-64 bg-white h-full p-4 shadow-xl">
                  <Button onClick={() => setIsMenuOpen(false)} className="mb-4">
                    <FaTimes />
                  </Button>
                  <nav className="flex flex-col gap-4">{menuItems}</nav>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Login Dialog */}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Login or Sign Up
                  </Dialog.Title>
                  <form onSubmit={handleLogin} className="mt-4 space-y-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      required
                      className="w-full"
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </header>
  );
}
