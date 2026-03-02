import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RoutePaths } from "@/config/route";

import { LastestProduct } from "@/services/dashboard.service";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/constants/api";

interface Props {
  products: LastestProduct[];
}

export const LatestProducts = ({ products }: Props) => {
  return (
    <Card className="rounded-2xl shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle>Latest Products</CardTitle>
        <CardDescription>New additions to the hardware inventory</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {products?.length === 0 && (
          <p className="text-sm text-muted-foreground">No products found</p>
        )}

        {products?.slice(0, 3).map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {product.mainImage ? (
                <img
                  src={
                    product.mainImage
                      ? `${API_BASE_URL}${product.mainImage}`
                      : "/no-image.png"
                  }
                  alt={product.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-muted" />
              )}

              <div>
                <p className="font-medium">{product.name}</p>
                {/* <p className="text-xs text-muted-foreground">
                  {product.category}
                </p> */}
              </div>
            </div>

            <span className="font-semibold text-primary text-base">{product.basePrice} $</span>
          </div>
        ))}
      </CardContent>

      <div className="p-6 pt-0">
        <button className="w-full rounded-xl bg-muted/40 py-3 text-sm font-medium text-primary hover:bg-muted transition flex items-center justify-center gap-2">
          <Link to={RoutePaths.PRODUCTS}>View All Products →</Link>
        </button>
      </div>
    </Card>
  );
};
