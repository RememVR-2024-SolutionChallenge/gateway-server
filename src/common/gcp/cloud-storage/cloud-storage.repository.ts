import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { Stream } from 'stream';

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

  async uploadFile(fileStream: Stream, destination: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destination);
    await new Promise<void>((resolve, reject) => {
      fileStream
        .pipe(file.createWriteStream())
        .on('error', reject)
        .on('finish', resolve);
    });
  }
}
