import { useSearchParams } from 'react-router-dom';  // Use correct import

export default function useQueryConfig() {
    const [searchParams] = useSearchParams();  // This will give you the query parameters
    const queryConfig = {
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '10',
        category: searchParams.get('category'),
        exclude: searchParams.get('exclude'),
        name: searchParams.get('name'),
        order: searchParams.get('order'),
        priceMax: searchParams.get('priceMax'),
        priceMin: searchParams.get('priceMin'),
        rating: searchParams.get('rating') || null,
        sort_by: searchParams.get('sort_by')
    };

    return queryConfig;
}