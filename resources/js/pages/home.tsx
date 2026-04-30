import BrandFooter from '@/components/brand-footer';
import GeneratorForm from '@/components/home/generator-form';
import PagesTable from '@/components/pages-table';
import { Button } from '@/components/ui/button';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { useGeneratorFormStore } from '@/stores/generator-form-store';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useCallback } from 'react';

export default function Home() {
    const { auth } = usePage<SharedData>().props;
    const { isOpen: isGeneratorOpen, setIsOpen: setIsOpenGenerator } = useGeneratorFormStore();

    const sales = [
        {
            id: 1,
            name: 'Dummy Product 1',
            createdAtISO: new Date().toISOString(),
        },
        {
            id: 2,
            name: 'Dummy Product 2',
            createdAtISO: new Date().toISOString(),
        },
    ];

    const handleOpenGenerator = useCallback(() => {
        setIsOpenGenerator(true);
    }, []);

    return (
        <>
            <Head title="Home"></Head>
            <AppHeaderLayout>
                <main className="my-10 px-6">
                    <div className="space-y-4">
                        {sales.length ? (
                            <div className="mb-11">
                                <h1 className="text-2xl leading-loose font-semibold">Generated Sales Page</h1>
                                <PagesTable data={sales}></PagesTable>
                            </div>
                        ) : (
                            <p className="mb-4 text-center">Let's generate your first sales page</p>
                        )}
                    </div>
                    {!isGeneratorOpen ? (
                        <div className="text-center">
                            <Button onClick={handleOpenGenerator} size="lg">
                                Open Generator
                            </Button>
                        </div>
                    ) : (
                        <GeneratorForm />
                    )}
                </main>
                <BrandFooter />
            </AppHeaderLayout>
        </>
    );
}
