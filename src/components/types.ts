import { ReactNode } from 'react';

export interface PageProps {
  id: string | number;
  bgColor?: string;
  className?: string;
  children?: ReactNode;
  index?: number; // Optional index for tracking which page this is
}

export interface FullPageScrollProps {
  pages: PageProps[];
  transitionDuration?: number;
  initialPage?: number;
  showNavigation?: boolean;
}

export interface NavigationDotsProps {
  pages: PageProps[];
  currentPage: number;
  navigateToPage: (index: number) => void;
}