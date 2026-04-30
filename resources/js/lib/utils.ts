import { SalesItem } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(ISODate: string) {
    const date = new Date(ISODate);
    if (isNaN(date.getTime())) {
        console.error(`Invalid date string: ${ISODate}`);
        return ISODate;
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function createSalesPrompt(item: SalesItem) {
    const { salesType, name, description, keyFeatures, targetAudience, price, USP } = item;
    let prompt = `Create a sales page using HTML and embedded CSS with presentable sleek design.\nThe page must have:\n1. A compelling headline\n2. Sub-headline\n3. Product description\n4. Benefits section\n5. Features Breakdown\n6. Social Proof Placeholder\n7. Pricing display\n8. Clear call-to-action\n\nby using these provided details:\n- ${salesType || ''} Name: ${name || ''}\n`;

    if (description) prompt += `- Description: ${description}\n`;
    prompt += `- Key features: ${keyFeatures}\n`;
    if (targetAudience) prompt += `- Target Audience: ${targetAudience}\n`;
    prompt += `- Price: ${price}\n`;
    if (USP) prompt += `- Unique Selling Points: ${USP}\n`;
    prompt += `\nPlease ensure only 1 html block is provided.`;

    return prompt;
}
