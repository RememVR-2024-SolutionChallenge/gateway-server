export interface AiTaskRequest {
  // 작업 타입
  type: 'scene' | 'avatar';

  // 현재 작업 상태
  status: 'waiting' | 'working' | 'complete' | 'fail';

  // 인풋 비디오의 위치
  videoPath: string;

  // 생성 일자
  craetedAt: Date;
}
