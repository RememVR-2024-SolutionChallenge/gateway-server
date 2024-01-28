import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';
import { AiTaskRequest } from '../document/ai-task-request.document';

@Injectable()
export class AiTaskRequestRepository {
  private firestore: Firestore;
  private collectionPath: string;

  constructor(private configService: ConfigService) {
    this.firestore = new Firestore({
      projectId: this.configService.get<string>('GCP_PROJECT'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.collectionPath = '3dgs_request';
  }

  // Firestore에 문서를 추가하는 메서드
  async addTask(documentId: string, data: AiTaskRequest): Promise<void> {
    const documentRef = this.firestore
      .collection(this.collectionPath)
      .doc(documentId);
    await documentRef.set(data);
  }

  // Firestore에서 문서를 검색하는 메서드
  async getTask(
    documentId: string,
  ): Promise<FirebaseFirestore.DocumentData | undefined> {
    const documentRef = this.firestore
      .collection(this.collectionPath)
      .doc(documentId);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      return undefined;
    }

    return documentSnapshot.data();
  }
}
