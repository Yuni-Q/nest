import { Module, Global, DynamicModule } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/User.entity';
import { Answer } from 'src/entity/Answer.entity';
import { File } from 'src/entity/File.entity';
import { Mission } from 'src/entity/Mission.entity';
import { Question } from 'src/entity/Question.entity';

function DatabaseOrmModule(): DynamicModule {
  const config = new EnvService().read();

  return TypeOrmModule.forRoot({
    name: 'default',
    type: 'mysql',
    host: config.DB_HOST,
    port: 3306,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DATABASE,
    synchronize: false,
    entities: [User, Answer, File, Mission, Question], // 설정 부분
  });
}

@Global()
@Module({
  imports: [EnvModule, DatabaseOrmModule()],
})
export class DatabaseModule {}