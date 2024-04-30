import { Firestore } from '@google-cloud/firestore';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestInfo } from '../document/request-info.document';

@Injectable()
export class RequestInfoRepository {
  private firestore: Firestore;
  private collectionPath: string;

  constructor(private configService: ConfigService) {
    this.firestore = new Firestore({
      projectId: this.configService.get<string>('GCP_PROJECT'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.collectionPath = 'request_info';
  }

  async addInfo(documentId: string, data: RequestInfo): Promise<void> {
    const documentRef = this.firestore
      .collection(this.collectionPath)
      .doc(documentId);
    await documentRef.set(data);
  }

  async isSample(documentId: string): Promise<boolean> {
    const documentRef = this.firestore
      .collection(this.collectionPath)
      .doc(documentId);
    const doc = await documentRef.get();
    return doc.exists && doc.data().isSample;
  }
}
