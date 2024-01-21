import { Injectable } from '@nestjs/common';
import { CloudStorageRepository } from './cloud-storage.repository';

@Injectable()
export class CloudStorageService {
  constructor(
    private readonly cloudStorageRepository: CloudStorageRepository,
  ) {}
}
