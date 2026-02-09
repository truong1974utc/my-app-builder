import { useEffect, useState } from "react"
import { productsService } from "@/services/products/product.service"
import { Product } from "@/types/product.type"
import { PaginationMeta } from "@/types/pagination.type"
import { GetProductsParams } from "@/services/products/product.service"

export function useProducts(params: GetProductsParams) {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await productsService.getProducts(params)

        if (res.success) {
          setProducts(res.data.items)
          setMeta(res.data.meta)
        }
      } catch (err) {
        setError("Không tải được danh sách sản phẩm")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [params])

  return { products, meta, loading, error, setProducts }
}
