import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartContract } from './contracts/CreateCart';
import { CreateItemCartContract } from './contracts/CreateItemCart';
import { AddItemCartContract } from './contracts/AddItemCart';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('create-cart')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', type: Number })
  async createCart(@Body() body: CreateCartContract, @Headers() headers) {
    return this.cartService.createCart(body, headers);
  }

  @Post('create-item-cart')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'itemId', type: Number })
  @ApiParam({ name: 'count', type: Number })
  async createItemCart(
    @Body() body: CreateItemCartContract,
    @Headers() headers,
  ) {
    return this.cartService.createItemCart(body, headers);
  }

  @Post('add-item-cart')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'itemId', type: Number })
  @ApiParam({ name: 'count', type: Number })
  async addItemCart(@Body() body: AddItemCartContract, @Headers() headers) {
    return this.cartService.addItemCart(body, headers);
  }

  @Post('remove-item-cart')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'itemId', type: Number })
  async removeItemCart(@Body() body, @Headers() headers) {
    return this.cartService.removeItemCart(body, headers);
  }

  @Get('get-cart')
  @UseGuards(AuthGuard)
  async getCart(@Headers() headers) {
    return this.cartService.getCart(headers);
  }
}
