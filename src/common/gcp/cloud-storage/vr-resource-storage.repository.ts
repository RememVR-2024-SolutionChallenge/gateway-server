import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VrResourceStorageRepository {
  private storage: Storage;
  private vrResourceBucket: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.vrResourceBucket = this.configService.get<string>(
      'GCP_STORAGE_RESOURCE_BUCKET',
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<void> {
    const bucket = this.storage.bucket(this.vrResourceBucket);
    const cloudFile = bucket.file(destination);
    await cloudFile.save(file.buffer);
  }

  async generateSignedUrlList(prefix: string): Promise<string[]> {
    const findOptions = { prefix: prefix };
    const [files] = await this.storage
      .bucket(this.vrResourceBucket)
      .getFiles(findOptions);

    const urls = await Promise.all(
      // delete first elements: empty.
      files.splice(-1, 1).map(async (file) => {
        return await this.generateSignedUrl(file.name);
      }),
    );
    return urls;
  }

  async generateSignedUrl(filePath: string): Promise<string> {
    const options = {
      version: 'v4' as const,
      action: 'read' as const,
      expires: Date.now() + 10 * 60 * 1000,
    };
    const [url] = await this.storage
      .bucket(this.vrResourceBucket)
      .file(filePath)
      .getSignedUrl(options);
    return url;
  }
}
