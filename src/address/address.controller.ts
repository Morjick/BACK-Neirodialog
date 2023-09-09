import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SetDefaultAddress } from './contracts/SetDefaultAddress.contract';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('add-address')
  @ApiParam({ name: 'value', type: String })
  async addAddress(@Body() body, @Headers() headers) {
    return await this.addressService.addAddress(body.value, headers);
  }

  @Post('set-default-address')
  @ApiParam({ name: 'addressId', type: Number })
  async setDefaultAddress(@Body() body: SetDefaultAddress, @Headers() headers) {
    return await this.addressService.setDefaultAddress(body, headers);
  }

  @Get()
  async getAddress(@Headers() headers) {
    return await this.addressService.getAddress(headers);
  }
}
