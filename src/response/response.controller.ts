import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseContract } from './contracts/CreateResponse';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeleteResponseContract } from './contracts/DeleteResponse';
import { AdminGuard } from 'src/guards/admin.guards';

@ApiTags('Response')
@Controller('response')
export class ResponseController {
  constructor(private responseService: ResponseService) {}

  @Post('create-response')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'text', type: String })
  @ApiParam({ name: 'score', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  async createResponse(
    @Body() body: CreateResponseContract,
    @Headers() headers,
  ) {
    return this.responseService.createResponse(body, headers);
  }

  @Post('delete-response')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'responseId', type: Number })
  async deleteResponse(@Body() body: DeleteResponseContract) {
    return this.responseService.deleteReposne(body);
  }
}
