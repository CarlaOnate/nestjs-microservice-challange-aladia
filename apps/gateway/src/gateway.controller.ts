import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Public } from '../../../core/decorators/public.decorator';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.gatewayService.getHello();
  }
}
