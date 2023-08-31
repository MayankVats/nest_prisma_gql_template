import {
  GetObjectCommand,
  GetObjectCommandOutput,
  GetObjectRequest,
  S3Client,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from 'src/config/config.service';
import { Logger } from 'winston';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const config = configService.get();

    this.s3 = new S3Client({ region: config.AWS_DEFAULT_REGION });
  }

  async getObjectFromS3(
    bucketName: string,
    key: string,
  ): Promise<GetObjectCommandOutput> {
    const params: GetObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await this.s3.send(command);

      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
