import { Injectable } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductType } from './product-type.enum';

export type ProductInfo = {
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
};

// Dùng chung cho Cart/Wishlist (và bất kỳ nơi nào cần tra cứu nhanh thông tin cơ
// bản của 1 sản phẩm theo productType + productId, không cần biết trước nằm ở bảng nào).
@Injectable()
export class ProductLookupService {
  constructor(private readonly productService: ProductService) {}

  async getInfo(
    productType: ProductType,
    productId: string,
  ): Promise<ProductInfo | null> {
    try {
      switch (productType) {
        case ProductType.CPU:
          return await this.productService.getCpuById(productId);
        case ProductType.RAM:
          return await this.productService.getRamById(productId);
        case ProductType.VGA:
          return await this.productService.getVgaById(productId);
        case ProductType.MAINBOARD:
          return await this.productService.getMainboardById(productId);
        case ProductType.PSU:
          return await this.productService.getPsuById(productId);
        case ProductType.COOLER:
          return await this.productService.getCoolerById(productId);
        case ProductType.CASE:
          return await this.productService.getCaseById(productId);
        case ProductType.SSD:
          return await this.productService.getSsdById(productId);
        default:
          return null;
      }
    } catch {
      return null;
    }
  }
}
