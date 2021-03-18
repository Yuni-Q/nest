import { ApiProperty } from '@nestjs/swagger';
import { RequestDto } from 'src/dto/response.dto';
import { User } from 'src/entity/User.entity';

export class UsersDto extends RequestDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        birthday: '2020-03-18',
        email: 'moti@gmail.com',
        name: '모티',
        gender: '여',
        refreshDate: null,
        refreshToken: null,
        mission: null,
        snsId: '1',
        snsType: 'google',
        createdAt: '2020-03-19T15:27:18.000Z',
        updatedAt: '2020-03-19T15:27:18.000Z',
      },
    ],
    description: '유저 정보 배열',
    required: true,
  })
  public data: User[];
}