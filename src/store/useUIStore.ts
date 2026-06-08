import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isNewsletterOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  openSearch: () => void;
  toggleNewsletter: () => void;
  closeNewsletter: () => void;
  openNewsletter: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isNewsletterOpen: false,

  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),

  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),

  toggleNewsletter: () =>
    set((state) => ({ isNewsletterOpen: !state.isNewsletterOpen })),
  closeNewsletter: () => set({ isNewsletterOpen: false }),
  openNewsletter: () => set({ isNewsletterOpen: true }),
}));
