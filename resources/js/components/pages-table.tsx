import { formatDate } from '@/lib/utils';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './ui/table';

interface PageSummary {
    id: number;
    createdAtISO: string;
    name: string;
}

interface PagesTableProps {
    data: PageSummary[];
}

export default function PagesTable({ data }: PagesTableProps) {
    return (
        <Table className="text-xxs">
            <TableHeader>
                <TableRow className="*:px-2">
                    <TableHead className="text-center">#</TableHead>
                    <TableHead className="text-left text-nowrap">Created Date</TableHead>
                    <TableHead className="text-left text-nowrap">Product/Service Name</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((page) => (
                    <TableRow className="*:p-1.5" key={page.id}>
                        <TableCell className="text-center">{page.id}</TableCell>
                        <TableCell>{formatDate(page.createdAtISO)}</TableCell>
                        <TableCell>{page.name}</TableCell>
                        <TableCell>
                            <div className="flex justify-center gap-x-2.5">
                                <Button variant="outline" size="icon">
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {!data.length && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>
                            <p className="text-center text-sm">No data to show.</p>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
}
