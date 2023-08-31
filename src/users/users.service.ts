import { Inject, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from './entities/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { Config, ConfigService } from 'src/config/config.service';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private readonly config: Config;

  constructor(
    private prisma: PrismaService,
    private awsService: AwsService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.config = configService.get();
  }

  async getCountryCodes() {
    try {
      const countryCodes = await this.awsService.getObjectFromS3(
        this.config.AWS_S3_BUCKET_NAME,
        'static/country_codes_d2442ee2-c3ff-40ae-aa22-d69342f7a0b7.json',
      );

      const countryCodesList = await countryCodes.Body.transformToString();

      return JSON.parse(countryCodesList);
    } catch (error) {
      this.logger.error(error);
    }
  }

  create(createUserInput: CreateUserInput) {
    this.users.push(createUserInput);
    return createUserInput;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
