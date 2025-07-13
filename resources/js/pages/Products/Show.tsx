import AppLayout from '@/layouts/app-layout';
import { Product } from '@/types/Products';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products/${product.id}' },
    
];
/*
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}
*/
interface PageProps {
    product: Product;
}

export default function Show({ product }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product: ${product.name}`} />
            <div className="m-4">
                <h2 className="text-2xl font-bold mb-4">Product Detail</h2>
                <div className="mb-2"><strong>ID:</strong> {product.id}</div>
                <div className="mb-2"><strong>Name:</strong> {product.name}</div>
                <div className="mb-2"><strong>Price:</strong> {product.price}</div>
                <div className="mb-2"><strong>Description:</strong> {product.description}</div>
                <Link href={route('products.index')}>
                    <Button className="mt-4">Back to Products</Button>
                </Link>
            </div>
        </AppLayout>
    );
}