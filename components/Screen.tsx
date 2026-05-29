import type { ComponentProps, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  edges?: ComponentProps<typeof SafeAreaView>['edges'];
  className?: string;
};

export function Screen({ children, edges = ['top'], className = '' }: Props) {
  return (
    <SafeAreaView
      className={`flex-1 bg-cream dark:bg-[#161614] ${className}`.trim()}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
