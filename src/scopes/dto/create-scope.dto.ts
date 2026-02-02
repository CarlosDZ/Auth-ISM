import { IsString, IsNotEmpty } from 'class-validator';
export class CreateScopeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
