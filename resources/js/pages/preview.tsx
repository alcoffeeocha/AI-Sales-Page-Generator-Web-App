import { Head } from '@inertiajs/react';

interface PreviewPageData {
    generatedUrl: string;
    pageName: string;
}

export default function Preview({ generatedUrl, pageName }: PreviewPageData) {
    return (
        <>
            <Head title={`Preview ${pageName}`}></Head>
            <header className="bg-background border-b-border flex items-center justify-between gap-x-2 border-b border-solid px-6 py-5">
                <h1>Preview {pageName}</h1>
            </header>
            <iframe className="h-screen w-full border-0" src={generatedUrl} title="Generated sales page preview"></iframe>
        </>
    );
}
