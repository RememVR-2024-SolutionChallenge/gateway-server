import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { ConfigService } from '@nestjs/config';
import { SampleAiTaskRequest } from '../document/sample-ai-task-request.document';

@Injectable()
export class SampleAiTaskRequestRepository {
  private firestore: Firestore;
  private collectionPath: string;

  constructor(private configService: ConfigService) {
    this.firestore = new Firestore({
      projectId: this.configService.get<string>('GCP_PROJECT'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'),
    });
    this.collectionPath = 'sample_request';
  }

  async addTask(documentId: string, data: SampleAiTaskRequest): Promise<void> {
    const documentRef = this.firestore
      .collection(this.collectionPath)
      .doc(documentId);
    await documentRef.set(data);
  }

  // Not used in sample.
  // //   async getQueuedTasksByGroupId(
  // //     groupId: string,
  // //   ): Promise<SampleAiTaskRequest[]> {
  // //     const querySnapshot = await this.firestore
  // //       .collection(this.collectionPath)
  // //       .where('groupId', '==', groupId)
  // //       .where('status', 'in', ['pending', 'processing', 'failed'])
  // //       .get();
  // //     const documents = querySnapshot.docs.map((doc) => doc.data());
  // //     return documents as SampleAiTaskRequest[];
  // //   }
}
