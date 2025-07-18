import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Category } from '@/types/Categories';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

interface CategoryPagination {
    data: Category[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: { url: string | null; label: string; active: boolean }[];
}


interface Flash {
    message?: string;
}


export default function Index() {
    const [categories, setCategories] = useState<CategoryPagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(
        new URLSearchParams(window.location.search).get('perPage') || '10'
    );
    const [flash, setFlash] = useState<Flash>({});
    const { processing, delete: destroy } = useForm();

    // Fetch categories from API
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/categories?perPage=${perPage}`)
            .then(res => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [perPage]);

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setPerPage(value);
        // No recarga la página, solo cambia el estado y dispara el useEffect
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`¿Está seguro de eliminar la categoría - ${id}. ${name}?`)) {
            destroy(route("categories.destroy", id), {
                onSuccess: () => {
                    setFlash({ message: 'Categoría eliminada correctamente.' });
                    // Refresca la lista
                    axios.get(`/api/categories?perPage=${perPage}`)
                        .then(res => setCategories(res.data));
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            {flash.message && (
                <Alert>
                    <Megaphone className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <span className="font-small text-black text-sm">Show:</span>
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="border border-black rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                        style={{ width: 48 }}
                    >
                        <option className="text-sm" value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                    <span className="ml-1 text-black">per page</span>
                </div>
                <Link href={route('categories.create')}>
                    <Button className="bg-black text-white hover:bg-red-600 transition-colors">Create a Category</Button>
                </Link>
            </div>
            {loading ? (
                <div className="text-center py-10">Cargando...</div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories && categories.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No categories found.</TableCell>
                                </TableRow>
                            ) : (
                                categories && categories.data.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>{category.id}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Link href={route('categories.show', category.id)}>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="hover:bg-black hover:text-white text-black"
                                                    title="View"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <Link href={route('categories.edit', category.id)}>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="hover:bg-red-600 hover:text-white text-black"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                disabled={processing}
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="hover:bg-red-600 hover:text-white text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {categories && categories.links && categories.links.map((link, idx) =>
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-3 py-1 rounded border transition-colors
                                        ${link.active
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600'}
                                    `}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded border border-gray-200 text-gray-400"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        )}
                    </div>
                </>
            )}
        </AppLayout>
    );
}