import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mission } from 'src/common/entity/Mission.entity';
import { User } from 'src/common/entity/User.entity';
import { getDateString } from 'src/common/util/date';
import { MoreThan, Repository } from 'typeorm';
import { BodyDto } from './dto/body.dto';
import { InvalidUserIdDto } from './dto/invalid.user.id.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(body: User): Promise<User> {
    const user = await this.userRepository.create({ ...body });
    const newUser = this.userRepository.save(user);
    return newUser;
  }

  async getAll(id?: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: {
        id: MoreThan(parseInt(id, 10) || 0),
      },
      take: 10,
    });
    return users;
  }

  async get(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }

  async getUserBySnsIdAndSnsType({
    snsId,
    snsType,
  }: {
    snsId: string;
    snsType: string;
  }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { snsId, snsType },
    });
    return user;
  }

  async updateMyInfo(
    id: number,
    body: BodyDto | { refreshDate: null },
  ): Promise<User> {
    const user = await this.checkUser(id);
    const newUser = { ...user, ...body };
    await this.userRepository.save(newUser);
    const returnUser = await this.get(id);
    return returnUser;
  }

  async deleteUser(id: number): Promise<null> {
    const user = await this.checkUser(id);
    await this.userRepository.remove(user);
    return null;
  }

  async checkUser(id: number): Promise<User> {
    const user = await this.get(id);
    if (!user) {
      throw new HttpException(new InvalidUserIdDto(), HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async setMissionsInUser({
    missions,
    id,
  }: {
    id: number;
    missions: Mission[];
  }) {
    const date = getDateString({});
    const user = await this.checkUser(id);
    const newUser = { ...user, mission: JSON.stringify({ date, missions }) };
    const returnUser = await this.userRepository.save(newUser);
    return returnUser;
  }

  async setMissionsAndRefreshDateInUser({
    id,
    missions,
  }: {
    id: number;
    missions: Mission[];
  }) {
    const date = getDateString({});
    const user = await this.checkUser(id);
    const newUser = {
      ...user,
      refreshDate: date,
      mission: JSON.stringify({ date, missions }),
    };
    const returnUser = await this.userRepository.save(newUser);
    return returnUser;
  }
}
