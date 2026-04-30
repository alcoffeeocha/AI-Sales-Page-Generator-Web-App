const endpoints = {
    generateHTML: '/generate-html',
};

interface GenerateHTMLData {
    error: unknown | null;
    data: null | {
        preview_url: string;
    };
}
interface generateHTMLPayload {
    type: string;
    name: string;
    description: string;
    key_features: string;
    target_audience: string;
    price: string;
    USP: string;
    prompt: string;
}

export async function postGenerateHTML(payload: generateHTMLPayload): Promise<GenerateHTMLData> {
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken)
            return {
                error: 'No CSRF Token found in the HTML meta tag',
                data: null,
            };
        const response = await fetch(`${endpoints.generateHTML}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const json = await response.json();
        return {
            error: null,
            data: {
                preview_url: json.preview_url,
            },
        };
    } catch (err) {
        return {
            error: err,
            data: null,
        };
    }
}
