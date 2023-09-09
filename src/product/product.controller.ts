import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AdminGuard } from 'src/guards/admin.guards';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetManyProductContract } from './contracts/getManyProduct.contract';
import { UpdateProductContract } from './contracts/updateProduct.contract';
import { SetShowProductContract } from './contracts/setShowProduct.contract';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('create-product')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'description', type: String })
  @ApiParam({ name: 'basePrice', type: Number })
  @ApiParam({ name: 'show', type: Boolean, required: false })
  @ApiParam({ name: 'discount', type: Number, required: false })
  @ApiParam({ name: 'volume', type: Number, required: false })
  @ApiParam({ name: 'countInStock', type: Number, required: false })
  @ApiParam({ name: 'size', type: Number, required: false })
  @ApiParam({ name: 'quantityInThePackage', type: Number, required: false })
  @ApiParam({ name: 'weight', type: Number, required: false })
  @ApiParam({ name: 'type', type: String, required: false })
  @ApiParam({ name: 'inStock', type: Boolean, required: false })
  @ApiParam({ name: 'images', type: Array, required: false })
  @ApiParam({ name: 'videos', type: Array, required: false })
  @ApiParam({ name: 'colors', type: Array, required: false })
  async createProduct(@Body() body, @Headers() headers) {
    return this.productService.createProduct(body, headers);
  }

  @Post('set-show')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'productId', type: Number })
  @ApiParam({ name: 'show', type: Boolean })
  async swtShowProduct(@Body() body: SetShowProductContract) {
    return this.productService.setShowProduct(body);
  }

  @Post('update-product')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'description', type: String })
  @ApiParam({ name: 'basePrice', type: Number })
  @ApiParam({ name: 'show', type: Boolean, required: false })
  @ApiParam({ name: 'discount', type: Number, required: false })
  @ApiParam({ name: 'images', type: Array, required: false })
  @ApiParam({ name: 'videos', type: Array, required: false })
  async updateProduct(@Body() body: UpdateProductContract) {
    return this.productService.updateProduct(body);
  }

  @Get('get-one/:href')
  async getProduct(@Param() param) {
    return this.productService.getOne(param.href);
  }

  @Get('get-many')
  @ApiQuery({ name: 'title', type: String, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sortColumn', type: String, required: false })
  async getManyProducts(@Query() query: GetManyProductContract) {
    return this.productService.getMany(query);
  }

  @Delete('delete-product/:href')
  @UseGuards(AdminGuard)
  async deleteProduct(@Param() param) {
    return this.productService.deleteProduct(param.href);
  }
}
