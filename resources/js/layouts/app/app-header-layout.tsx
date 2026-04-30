import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';

interface AppHeaderLayoutProps {
    children: React.ReactNode;
}

export default function AppHeaderLayout({ children }: AppHeaderLayoutProps) {
    return (
        <AppShell>
            <AppHeader />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
