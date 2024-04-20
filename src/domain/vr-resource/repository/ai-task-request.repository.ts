import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';
import { AiTaskRequest } from '../document/ai-task-request.document';
import { RequestInfoRepository } from 'src/domain/sample/repository/request-info.repository';

@Injectable()
export class AiTaskRequestRepository {
  private firestore: Firestore;
  private collectionPath: string;

  constructor(
    private configService: ConfigService,
    private requestInfoRepository: RequestInfoRepository,
  ) {
    this.firestore = new Firestore({
      projectId: this.configService.get<string>('GCP_PROJECT'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.collectionPath = '3dgs_request';
  }

  async addTask(documentId: string, data: AiTaskRequest): Promise<void> {
    const documentRef = this.firestore
      .collection(this.collectionPath)
      .doc(documentId);
    await documentRef.set(data);

    this.requestInfoRepository.addInfo(documentId, {
      id: documentId,
      isSample: false,
    });
  }

  async getQueuedTasksByGroupId(groupId: string): Promise<AiTaskRequest[]> {
    const querySnapshot = await this.firestore
      .collection(this.collectionPath)
      .where('groupId', '==', groupId)
      .where('status', 'in', ['pending', 'processing', 'failed'])
      .get();
    const documents = querySnapshot.docs.map((doc) => doc.data());
    return documents as AiTaskRequest[];
  }
}
