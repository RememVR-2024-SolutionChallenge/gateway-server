import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudStorageRepository {
  private storage: Storage;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.bucketName = this.configService.get<string>('GCP_STORAGE_BUCKET');
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const cloudFile = bucket.file(destination);
    await cloudFile.save(file.buffer);
  }
}
