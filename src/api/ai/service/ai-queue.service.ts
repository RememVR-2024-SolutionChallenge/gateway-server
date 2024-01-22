import { Injectable } from '@nestjs/common';

@Injectable()
export class AiQueueService {
  constructor() {}

  async Queue3DgsTask(body, user) {
    // 1. GCP Cloud Storage에 해당 인풋 저장

    // 2. Fire Store에 해당 리퀘스트 관련 데이터 저장

    // 3. GCP Cloud Tasks로 요청 큐잉하기

    // 4. AI 서버로 새 태스크 알리기

    return;
  }
}
