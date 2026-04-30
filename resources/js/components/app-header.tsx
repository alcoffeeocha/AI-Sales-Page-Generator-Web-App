import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGeneratorFormStore } from '@/stores/generator-form-store';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function AppHeader() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const { isOpen, setIsOpen: setIsOpenGenerator } = useGeneratorFormStore();

    const handleOpenGenerator = () => {
        setIsOpenGenerator(true);
    };

    return (
        <>
            <header className="bg-background border-b-border flex items-center justify-between gap-x-2 border-b border-solid px-6 py-5">
                <div className="flex items-center gap-x-3">
                    <p>Hello, {auth.user.name}!</p>
                    {!isOpen && (
                        <Button onClick={handleOpenGenerator} variant="link" size="sm">
                            Generate Sales Page
                        </Button>
                    )}
                </div>
                <Link
                    className={cn(
                        buttonVariants({
                            variant: 'secondary',
                        }),
                    )}
                    method="post"
                    href={route('logout')}
                    as="button"
                >
                    Logout
                </Link>
            </header>
        </>
    );
}
