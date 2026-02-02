import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { NewScopeDto } from './dto/new-scope.dto';

@Injectable()
export class ScopesService {
    constructor(private readonly prisma: PrismaService) {}

    async createScope(tenantId: string, dto: CreateScopeDto): Promise<NewScopeDto> {
        const scope = await this.prisma.scope.create({
            data: {
                name: dto.name,
                tenantId
            }
        });
        return {
            name: scope.name,
            tenantId: scope.tenantId,
            createdAt: scope.createdAt
        };
    }
}
