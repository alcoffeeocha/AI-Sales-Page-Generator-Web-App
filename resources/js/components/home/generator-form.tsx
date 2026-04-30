import { createSalesPrompt } from '@/lib/utils';
import { postGenerateHTML } from '@/services/generator';
import { useGeneratorFormStore } from '@/stores/generator-form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, XIcon } from 'lucide-react';
import { Ref, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '../ui/field';
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
    type: z.string({
        error: 'Please select a type',
    }),
    name: z.string().nonempty('Name is required').max(255, {
        error: 'Sorry, maximum 255 characters for Name',
    }),
    description: z.string().optional(),
    key_features: z.array(z.object({ value: z.string().nonempty('Please specify a feature') })).min(1, 'Add at least one key feature'),
    target_audience: z
        .string()
        .max(255, {
            error: 'Sorry, maximum 255 characters for Target Audience.',
        })
        .optional(),
    price: z.string().nonempty("Price is required or set this to 'Free'").max(255, {
        error: 'Sorry, maximum 255 characters for Price',
    }),
    USP: z.string().optional(),
    prompt: z.string(),
});

export default function GeneratorForm() {
    const { isOpen, setIsOpen } = useGeneratorFormStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'Product',
            name: '',
            description: '',
            key_features: [{ value: '' }],
            target_audience: '',
            price: '',
            USP: '',
            prompt: createSalesPrompt({
                salesType: 'Product',
                name: '',
                description: '',
                keyFeatures: '',
                price: '',
                targetAudience: '',
                USP: '',
            }),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'key_features',
    });

    const watchedType = useWatch({ control: form.control, name: 'type' });
    const watchedProductorServiceName = useWatch({ control: form.control, name: 'name' });
    const watchedDescription = useWatch({ control: form.control, name: 'description' });
    const watchedKeyFeatures = useWatch({ control: form.control, name: 'key_features' });
    const watchedTargetAudience = useWatch({ control: form.control, name: 'target_audience' });
    const watchedPrice = useWatch({ control: form.control, name: 'price' });
    const watchedUSP = useWatch({ control: form.control, name: 'USP' });

    const generatorWrapperRef = useRef<HTMLDivElement | null>(null);

    const loadingDialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        if (generatorWrapperRef.current) {
            generatorWrapperRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isSubmitting) {
            loadingDialogRef.current &&
                loadingDialogRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
        }
    }, [isSubmitting]);

    useEffect(() => {
        const updatedPrompt = createSalesPrompt({
            salesType: watchedType ?? 'Product',
            name: watchedProductorServiceName,
            description: watchedDescription,
            keyFeatures: watchedKeyFeatures.map(({ value }) => value).join(', '),
            price: watchedPrice,
            targetAudience: watchedTargetAudience,
            USP: watchedUSP,
        });
        form.setValue('prompt', updatedPrompt);
    }, [watchedType, watchedProductorServiceName, watchedDescription, watchedKeyFeatures, watchedTargetAudience, watchedPrice, watchedUSP, form]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        postGenerateHTML({
            ...data,
            description: data.description || '',
            key_features: data.key_features.map((feature) => feature.value).join(', '),
            target_audience: data.target_audience || '',
            USP: data.USP || '',
        })
            .then((data) => {
                if (!data.error && data.data?.preview_url) {
                    window.location.href = data.data.preview_url;
                }
            })
            .catch((error) => {
                console.error('[postGenerateHTML] error: ', error);
                alert('Generation failed.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return <></>;

    return (
        <>
            <Card className="relative scroll-mt-4" ref={generatorWrapperRef}>
                <CardHeader>
                    <div className="mb-2.5 flex justify-end">
                        <Button onClick={handleClose} className="w-max rounded-full" size="icon">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardTitle className="mb-1.5 text-base uppercase">Describe Your Product or Service</CardTitle>
                    <CardDescription>AI will generate sales page for you in seconds.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-3" id="form-generate-sales-page" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldSet className="md:flex-row">
                            <FieldGroup>
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <RadioGroup
                                            defaultValue="Product"
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="radio-product">
                                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                    <FieldContent>
                                                        <FieldTitle>Product</FieldTitle>
                                                    </FieldContent>
                                                    <RadioGroupItem aria-invalid={fieldState.invalid} value="Product" id="radio-product" />
                                                </Field>
                                            </FieldLabel>
                                            <FieldLabel htmlFor="radio-service">
                                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                    <FieldContent>
                                                        <FieldTitle>Service</FieldTitle>
                                                    </FieldContent>
                                                    <RadioGroupItem aria-invalid={fieldState.invalid} value="Service" id="radio-service" />
                                                </Field>
                                            </FieldLabel>
                                        </RadioGroup>
                                    )}
                                ></Controller>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid-state={fieldState.invalid}>
                                            <FieldLabel htmlFor="input-name">{form.getValues('type')} Name</FieldLabel>
                                            <Input {...field} id="input-name" aria-invalid={fieldState.invalid} placeholder="Spicy Noodles"></Input>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                ></Controller>
                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="input-description">Description</FieldLabel>
                                            <Textarea
                                                {...field}
                                                id="input-description"
                                                rows={5}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Instant spicy boiled noodle from Asia"
                                            ></Textarea>
                                        </Field>
                                    )}
                                ></Controller>
                                <FieldSet className="gap-4">
                                    <FieldLegend variant="label">Key Features</FieldLegend>
                                    <FieldGroup className="gap-4">
                                        {fields.map((field, index) => (
                                            <Controller
                                                key={field.id}
                                                name={`key_features.${index}.value`}
                                                control={form.control}
                                                render={({ field: controllerField, fieldState }) => (
                                                    <Field orientation="vertical" data-invalid={fieldState.invalid}>
                                                        <FieldContent>
                                                            <InputGroup>
                                                                <InputGroupInput
                                                                    {...controllerField}
                                                                    id={`input-feature-${index}`}
                                                                    placeholder={index === 0 ? 'Tasty' : ''}
                                                                />
                                                                {fields.length > 1 && (
                                                                    <InputGroupAddon align="inline-end">
                                                                        <InputGroupButton
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon-xs"
                                                                            onClick={() => remove(index)}
                                                                            aria-label={`Remove key feature ${index + 1}`}
                                                                        >
                                                                            <XIcon />
                                                                        </InputGroupButton>
                                                                    </InputGroupAddon>
                                                                )}
                                                            </InputGroup>
                                                        </FieldContent>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            ></Controller>
                                        ))}
                                        <div className="text-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full"
                                                onClick={() => append({ value: '' })}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FieldGroup>
                                    {form.formState.errors.key_features?.root && <FieldError errors={[form.formState.errors.key_features.root]} />}
                                </FieldSet>
                                <Controller
                                    name="target_audience"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid-state={fieldState.invalid}>
                                            <FieldLabel htmlFor="input-target-audience">Target Audience</FieldLabel>
                                            <Input
                                                {...field}
                                                id="input-target-audience"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Young Adult"
                                            ></Input>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                ></Controller>
                                <Controller
                                    name="price"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid-state={fieldState.invalid}>
                                            <FieldLabel htmlFor="input-price">Price</FieldLabel>
                                            <Input {...field} id="input-price" placeholder="RM 5" aria-invalid={fieldState.invalid}></Input>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                ></Controller>
                                <Controller
                                    name="USP"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="input-USP">Unique Selling Points</FieldLabel>
                                            <Textarea
                                                {...field}
                                                id="input-USP"
                                                rows={5}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="There are real meat and egg inside!"
                                            ></Textarea>
                                        </Field>
                                    )}
                                ></Controller>
                            </FieldGroup>
                            <FieldGroup className="sticky top-0">
                                <Controller
                                    name="prompt"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel htmlFor="input-prompt">Auto-generated Prompt</FieldLabel>
                                            <Textarea {...field} id="input-prompt" rows={7} readOnly></Textarea>
                                        </Field>
                                    )}
                                ></Controller>
                            </FieldGroup>
                        </FieldSet>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal" className="justify-center">
                        <Button type="submit" form="form-generate-sales-page">
                            Generate
                        </Button>
                    </Field>
                </CardFooter>
                {isSubmitting && <div className="absolute inset-0 rounded-[inherit] bg-black/75"></div>}
                <LoadingDialog open={isSubmitting} ref={loadingDialogRef} />
            </Card>
        </>
    );
}

interface LoadingDialogProps {
    open: boolean;
    ref?: Ref<HTMLDialogElement | null>;
}

function LoadingDialog(props: LoadingDialogProps) {
    return (
        <dialog
            ref={props.ref}
            className="bg-background absolute top-1/2 left-1/2 w-9/12 max-w-80 -translate-x-1/2 -translate-y-1/2 p-8 text-white"
            open={props.open}
        >
            <article className="grid justify-items-center">
                <strong className="text-lg">Sit Tight</strong>
                <p className="text-xs">Generating the page...</p>
            </article>
        </dialog>
    );
}
