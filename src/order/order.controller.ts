import {
  Controller,
  Post,
  Headers,
  Get,
  Param,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guards';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('create-order')
  async createOrder(@Headers() headers) {
    return await this.orderService.createOrder(headers);
  }

  @Post('set-status')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'status', type: String })
  @ApiParam({ name: 'orderId', type: Number })
  async setOrderStatus(@Body() body) {
    return await this.orderService.setOrderStatus(body);
  }

  @Get('get-many')
  async getOrders(@Headers() headers) {
    return await this.orderService.getOrders(headers);
  }

  @Get('get-order/:id')
  async getOrder(@Param() param) {
    return await this.orderService.getOrder(param.id);
  }

  @Get('get-orders')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'status', type: String })
  async getOrderAdmin(@Query() param) {
    return await this.orderService.getOrderForAdmin(param.status);
  }
}
